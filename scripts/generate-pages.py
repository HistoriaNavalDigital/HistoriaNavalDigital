"""Generate indexable ship pages and sitemap from the archive (no dependencies)."""
import html,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SITE='https://historianavaldigital.github.io/HistoriaNavalDigital/'
ships=json.loads((ROOT/'assets/data/ships.json').read_text())
template=(ROOT/'buque.html').read_text()
(ROOT/'buques').mkdir(exist_ok=True)
for ship in ships:
    escape=html.escape
    text=template.replace('content=""','content="../"',1).replace('<body>','<body data-ship-id="'+ship['id']+'">')
    text=text.replace('href="assets/','href="../assets/').replace('src="assets/','src="../assets/')
    title=ship['name']+' — HistoriaNavalDigital'
    text=re.sub(r'<title>.*?</title>','<title>'+escape(title)+'</title>',text)
    for key,value in [('name="description"',ship['summary']),('property="og:title"',title),('property="og:description"',ship['summary']),('property="og:image"',SITE+ship['image'])]:
        text=re.sub(r'(<meta '+key+r' content=")[^"]*',lambda m:m[1]+escape(value,quote=True),text)
    text=text.replace('</head>','<link rel="canonical" href="'+SITE+'buques/'+ship['id']+'.html">\n</head>')
    article='<article><h1>'+escape(ship['name'])+'</h1><p>'+escape(ship['summary'])+'</p><img src="../'+ship['image']+'" alt="'+escape(ship['name'])+'">'
    article+=''.join('<section><h2>'+escape(s['title'])+'</h2><p>'+escape(s['text'])+'</p></section>' for s in ship.get('historySections',[]))
    article+='<section><h2>Documentación</h2><p><a href="../fuentes.html#buque-'+escape(ship['id'])+'">Consultar fuentes y bibliografía</a></p></section><p><a href="../buques.html">Explorar catálogo</a></p></article>'
    text=text.replace('<div id="ship-content"></div>','<div id="ship-content">'+article+'</div>')
    (ROOT/'buques'/f'{ship["id"]}.html').write_text(text)
files=[p.relative_to(ROOT).as_posix() for p in ROOT.glob('*.html') if p.name not in ['buque.html','batalla.html','clase.html','coleccion.html','favoritos.html','comparar.html','buscar.html']]
files += ['buques/'+s['id']+'.html' for s in ships]
(ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join('<url><loc>'+SITE+f+'</loc></url>\n' for f in files)+'</urlset>\n')
print(f'Generadas {len(ships)} fichas permanentes y sitemap.')
