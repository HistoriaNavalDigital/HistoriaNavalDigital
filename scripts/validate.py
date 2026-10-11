"""Validate the static archive before publication (standard library only)."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, re, sys

ROOT = Path(__file__).resolve().parents[1]
errors = []
def check(condition, message):
    if not condition: errors.append(message)
def read(name):
    try: return json.loads((ROOT / 'assets/data' / name).read_text())
    except Exception as exc: errors.append(f'{name}: {exc}'); return []

data = {p.stem: read(p.name) for p in (ROOT / 'assets/data').glob('*.json')}
for name, rows in data.items():
    check(isinstance(rows, list), f'{name}: debe ser una lista')
    ids = [r['id'] for r in rows if 'id' in r]
    check(len(ids) == len(set(ids)), f'{name}: IDs duplicados')
    for row in rows:
        for key in ['image', 'imageDetail']:
            if row.get(key): check((ROOT / row[key]).is_file(), f'{name}: imagen ausente {row[key]}')
        for source in row.get('sources', []):
            check(bool(source.get('title')), f'{name}: referencia sin título')
            if source.get('url'): check(source['url'].startswith('https://'), f'{name}: URL de fuente inválida')
ships = data.get('ships', [])
ship_ids = {s['id'] for s in ships}
era_ids = {s['id'] for s in data.get('eras', [])}
nation_ids = {s['id'] for s in data.get('nations', [])}
conflict_ids = {s['id'] for s in data.get('conflicts', [])}
for s in ships:
    check(all(e in era_ids for e in s.get('eraIds',[s['era']])), f'{s["id"]}: era secundaria desconocida')
    for key in ['id','name','summary','description','nation','nationName','type','typeName','status','statusName','era','specs','tags','serviceHistory','location','sources']:
        check(key in s, f'{s["id"]}: falta {key}')
    check(s['era'] in era_ids, f'{s["id"]}: era desconocida')
    check(s['nation'] in nation_ids, f'{s["id"]}: nación desconocida')
    check(all(c in conflict_ids for c in s['conflicts']), f'{s["id"]}: conflicto desconocido')
    for date in [s.get('commissioned'),s.get('decommissioned'),*[e.get('date') for e in s['serviceHistory']]]:
        check(not date or bool(re.fullmatch(r'\d{4}(?:-\d{2}(?:-\d{2})?|-\d{4})?',date)),f'{s["id"]}: fecha inválida {date}')
for m in data.get('multimedia', []):
    check(m.get('shipId') is None or m['shipId'] in ship_ids, f'{m["id"]}: buque desconocido')
    check(m.get('era') in era_ids, f'{m["id"]}: era desconocida')
    check(bool(m.get('credit')),f'{m["id"]}: falta procedencia de imagen')
for place in data.get('places', []):
    check(bool(place.get('sources')), f'{place["id"]}: falta fuente de localización')
    check(-90 <= place['map']['lat'] <= 90 and -180 <= place['map']['lng'] <= 180, f'{place["id"]}: coordenadas inválidas')
for b in data.get('battles', []):
    check(b['conflict'] in conflict_ids, f'{b["id"]}: conflicto desconocido')
    check(all(s in ship_ids for s in b['shipIds']), f'{b["id"]}: buque desconocido')
    if b.get('map'):
        check(-90 <= b['map']['lat'] <= 90 and -180 <= b['map']['lng'] <= 180, f'{b["id"]}: coordenadas inválidas')
for tech in data.get('technology', []):
    check(all(s in ship_ids for s in tech.get('shipIds',[])), f'{tech["id"]}: ejemplo desconocido')
    if tech.get('diagramAlt'): check((ROOT / f'assets/images/diagrams/{tech["id"]}.svg').exists(), f'{tech["id"]}: esquema ausente')


class_ids={c['id'] for c in data.get('classes',[])}
battle_ids={b['id'] for b in data.get('battles',[])}
tech_ids={t['id'] for t in data.get('technology',[])}
for c in data.get('classes',[]):
    check(all(s in ship_ids for s in c['shipIds']), f'{c["id"]}: unidad desconocida')
for s in ships:
    check(s.get('class') in class_ids, f'{s["id"]}: clase desconocida')
    check(all(k in s['specs'] for g in s.get('specGroups',[]) for k in g['keys']),f'{s["id"]}: característica agrupada desconocida')
for c in data.get('collections',[]):
    check(all(s in ship_ids for s in c['shipIds']), f'{c["id"]}: buque desconocido')
    check(all(b in battle_ids for b in c['battleIds']), f'{c["id"]}: acontecimiento desconocido')
    check(all(t in tech_ids for t in c['technologyIds']), f'{c["id"]}: tecnología desconocida')

class Links(HTMLParser):
    def __init__(self, path): super().__init__(); self.path = path
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ['href','src']:
            ref=attrs.get(key,''); url=urlsplit(ref)
            if not ref or url.scheme or url.netloc or ref.startswith('#'): continue
            file=(self.path.parent / unquote(url.path)).resolve()
            check(file.is_relative_to(ROOT) and file.exists(), f'{self.path.name}: recurso ausente {ref}')
for path in ROOT.rglob('*.html'):
    text=path.read_text(); Links(path).feed(text)
    check('lang="es"' in text,f'{path.name}: idioma ausente')
    check('features.js' in text,f'{path.name}: utilidades de interfaz ausentes')
for path in (ROOT/'assets/css').glob('*.css'):
    for ref in re.findall(r'@import\s+["\']([^"\']+)',path.read_text()):
        check((path.parent/ref).exists(),f'{path.name}: CSS importado ausente {ref}')
for name in ['ships','eras','nations','conflicts']:
    if name != 'ships':
        for row in data.get(name,[]):
            actual=sum(row['id'] in (s['conflicts'] if name=='conflicts' else (s.get('eraIds',[s['era']]) if name=='eras' else [s['nation']])) for s in ships)
            check(row.get('shipCount',actual)==actual,f'{name}/{row["id"]}: contador desactualizado')
if errors:
    print('\n'.join(errors)); sys.exit(1)
print(f'Validación correcta: {len(list(ROOT.glob("*.html")))} páginas, {len(ships)} buques, imágenes y relaciones internas.')
