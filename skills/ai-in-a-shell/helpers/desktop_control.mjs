#!/usr/bin/env node
import net from 'node:net';
import path from 'node:path';
import { realpath, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { TextDecoder } from 'node:util';

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 4143;
const DEFAULT_TIMEOUT_MS = 2000;
const MAX_RESPONSE_BYTES = 64 * 1024;

function status(status, next, extra = {}) {
  return { status, next, ...extra };
}

async function canonicalDirectory(value) {
  if (typeof value !== 'string' || !value.trim()) throw new Error('Choose an existing project directory.');
  const canonical = await realpath(path.resolve(value));
  if (!(await stat(canonical)).isDirectory()) throw new Error('The requested project path is not a directory.');
  return canonical;
}

function rpc({ host, port, action, timeoutMs, maxResponseBytes }) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port });
    let settled = false;
    let bytes = Buffer.alloc(0);
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      error ? reject(error) : resolve(value);
    };
    const timer = setTimeout(() => finish(Object.assign(new Error('Desktop control request timed out.'), { unavailable: true })), timeoutMs);
    socket.once('connect', () => socket.write(`${JSON.stringify({ action })}\n`));
    socket.on('data', (chunk) => {
      bytes = Buffer.concat([bytes, chunk]);
      if (bytes.length > maxResponseBytes) return finish(Object.assign(new Error('Desktop response exceeded the size limit.'), { protocol: true }));
      const newline = bytes.indexOf(0x0a);
      if (newline < 0) return;
      if (newline !== bytes.length - 1) return finish(Object.assign(new Error('Unexpected bytes after response frame.'), { protocol: true }));
      try {
        const line = new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(0, newline));
        finish(null, JSON.parse(line));
      } catch {
        finish(Object.assign(new Error('Desktop returned an invalid UTF-8 JSON frame.'), { protocol: true }));
      }
    });
    socket.once('end', () => {
      if (!settled) finish(Object.assign(new Error('Desktop closed without a complete response frame.'), { protocol: true }));
    });
    socket.once('error', (error) => finish(Object.assign(error, { unavailable: true })));
  });
}

function validPing(reply) {
  return reply && typeof reply === 'object' && !Array.isArray(reply) && reply.ok === true;
}

function validProjectReply(reply) {
  return reply && typeof reply === 'object' && !Array.isArray(reply) && reply.ok === true &&
    (typeof reply.currentProject === 'string' || reply.currentProject === null);
}

export async function checkConnection({ project, host = DEFAULT_HOST, port = DEFAULT_PORT,
  timeoutMs = DEFAULT_TIMEOUT_MS, maxResponseBytes = MAX_RESPONSE_BYTES } = {}) {
  if (!project) return status('project_required', 'Open the intended project in the Desktop, then run this check with --project <directory>.');
  let requestedProject;
  try { requestedProject = await canonicalDirectory(project); }
  catch (error) { return status('invalid_project', error.message, { requestedProject: path.resolve(String(project)) }); }

  try {
    const ping = await rpc({ host, port, action: 'ping', timeoutMs, maxResponseBytes });
    if (!validPing(ping)) return status('protocol_error', 'Desktop returned an unexpected ping reply.', { requestedProject });
    const first = await rpc({ host, port, action: 'get_current_project', timeoutMs, maxResponseBytes });
    if (!validProjectReply(first)) return status('protocol_error', 'Desktop returned an unexpected current-project reply.', { requestedProject });
    const second = await rpc({ host, port, action: 'get_current_project', timeoutMs, maxResponseBytes });
    if (!validProjectReply(second)) return status('protocol_error', 'Desktop returned an unexpected current-project recheck.', { requestedProject });
    if (!first.currentProject || !second.currentProject) {
      return status('project_required', 'Open the requested project in the Desktop, then run this check again.', { requestedProject, currentProject: second.currentProject });
    }
    if (!path.isAbsolute(first.currentProject) || !path.isAbsolute(second.currentProject)) {
      return status('protocol_error', 'Desktop reported a non-absolute project path.', { requestedProject });
    }
    let firstRoot, currentRoot;
    try {
      firstRoot = await canonicalDirectory(first.currentProject);
      currentRoot = await canonicalDirectory(second.currentProject);
    } catch {
      return status('protocol_error', 'Desktop reported a project path that is not an existing directory.', { requestedProject });
    }
    if (firstRoot !== currentRoot) return status('project_mismatch', 'The Desktop project changed during the check. Select the requested project and retry.', { requestedProject, currentProject: currentRoot });
    if (currentRoot !== requestedProject) return status('project_mismatch', 'Open the requested project in the Desktop, then run this check again.', { requestedProject, currentProject: currentRoot });
    return status('connected', 'The Desktop is reachable and currently shows this project.', { requestedProject, currentProject: currentRoot });
  } catch (error) {
    if (error.protocol) return status('protocol_error', `Desktop response could not be verified: ${error.message}`, { requestedProject });
    return status('desktop_unavailable', 'The local Desktop endpoint is unavailable. If the Desktop is open, check again; this result does not prove the app is absent.', { requestedProject });
  }
}

function parseArgs(argv) {
  const index = argv.indexOf('--project');
  if (index < 0) return {};
  if (!argv[index + 1] || argv[index + 1].startsWith('--')) throw new Error('--project requires a directory path.');
  return { project: argv[index + 1] };
}

if (process.argv[1] && await realpath(path.resolve(process.argv[1])).catch(() => '') === await realpath(fileURLToPath(import.meta.url))) {
  try {
    const result = await checkConnection(parseArgs(process.argv.slice(2)));
    process.stdout.write(`${JSON.stringify(result)}\n`);
    process.exitCode = result.status === 'connected' ? 0 : 1;
  } catch (error) {
    process.stdout.write(`${JSON.stringify(status('invalid_project', error.message))}\n`);
    process.exitCode = 1;
  }
}
