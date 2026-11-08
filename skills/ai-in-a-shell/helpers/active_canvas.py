#!/usr/bin/env python3
"""Resolve the active local canvas without trusting marker-supplied paths."""

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

UUID_V4 = re.compile(r'[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\Z')


def resolve(root):
    root = Path(root).resolve(strict=True)
    if not root.is_dir():
        raise ValueError('Projektpfad ist kein Verzeichnis')
    app = root / '.ai-in-a-shell'
    if app.is_symlink() or (app.exists() and not app.is_dir()):
        raise ValueError('Ungültiges Canvas-Verzeichnis')
    marker = app / 'active-canvas.json'
    if marker.is_symlink():
        raise ValueError('Canvas-Auswahl darf kein symbolischer Link sein')
    try:
        raw = marker.read_bytes()
    except FileNotFoundError:
        raw = None
    if raw is None:
        canvas = 'legacy'
    else:
        try:
            value = json.loads(raw)
        except (ValueError, UnicodeDecodeError) as exc:
            raise ValueError('Ungültige Canvas-Auswahl') from exc
        if not isinstance(value, dict) or type(value.get('version')) is not int or value['version'] != 1:
            raise ValueError('Ungültige Canvas-Auswahlversion')
        canvas = value.get('canvas')
        if not isinstance(canvas, str) or not (canvas == 'legacy' or UUID_V4.fullmatch(canvas)):
            raise ValueError('Ungültige Canvas-ID')
    directory = app if canvas == 'legacy' else app / 'canvases'
    if directory.is_symlink() or (directory.exists() and not directory.is_dir()):
        raise ValueError('Ungültiges Canvas-Verzeichnis')
    path = directory / ('canvas.json' if canvas == 'legacy' else canvas + '.json')
    if path.is_symlink() or (path.exists() and not path.is_file()):
        raise ValueError('Canvas ist keine reguläre Datei')
    if raw is not None and not path.is_file():
        raise ValueError('Ausgewählter Canvas fehlt')
    fingerprint = hashlib.sha256(str(root).encode() + b'\0' + (b'absent' if raw is None else b'present\0' + raw)).hexdigest()
    return {'canvas': canvas, 'path': str(path), 'token': fingerprint}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', required=True, help='Projektverzeichnis')
    parser.add_argument('--expect-token', help='zuvor ausgegebenes Auswahl-Token vor dem Schreiben prüfen')
    args = parser.parse_args()
    try:
        selected = resolve(args.root)
        if args.expect_token is not None and args.expect_token != selected['token']:
            raise ValueError('Canvas-Auswahl hat sich geändert; Schreiben abgebrochen')
    except (OSError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        return 1
    print(json.dumps(selected, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())
