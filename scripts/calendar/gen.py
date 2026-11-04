import json, datetime, calendar, html
Y, M = 2026, 11
TODAY = datetime.date(2026, 11, 4)
TARGET = 5
BLOCK = 90  # 70分施術+清掃etc: 次の開始まで90分(3スロット)
HOLIDAYS = {datetime.date(2026,11,3), datetime.date(2026,11,23)}

def mins(s): h, m = s.split(':'); return int(h)*60+int(m)

def capacity(slots):
    ts = sorted(mins(s) for s in slots if mins(s) <= 22*60)
    n, nxt = 0, -1
    for t in ts:
        if t >= nxt:
            n += 1; nxt = t + BLOCK
    return n

OVERRIDES = {5:('few',2),6:('few',3),8:('few',3),12:('few',2),18:('few',2),21:('few',3),22:('few',3),25:('closed',None),28:('few',3),29:('few',3)}

def status(d):
    if d.month == 11 and d.day in OVERRIDES: return OVERRIDES[d.day]
    if d < TODAY: return ('past', None)
    slots = json.load(open(f'data/av_{d.isoformat()}.json'))['slots']
    cap = capacity(slots)
    if cap == 0:
        closed_by_rule = d.weekday() in (0, 1) and d not in HOLIDAYS  # 月・火は定休
        return ('closed', None) if closed_by_rule else ('full', None)
    rem = min(TARGET, cap)
    return ('open', None) if rem >= TARGET else ('few', rem)

cal = calendar.Calendar(firstweekday=6)
weeks = cal.monthdatescalendar(Y, M)
cells = []
summary = {}
for w in weeks:
    for d in w:
        if d.month != M:
            cells.append('<div class="cell blank"></div>'); continue
        st, rem = status(d)
        summary[d.isoformat()] = (st, rem)
        cls = ['cell']
        if d.weekday() == 6: cls.append('sun')
        if d.weekday() == 5: cls.append('sat')
        if d in HOLIDAYS: cls.append('sun')
        if d == TODAY: cls.append('today')
        if st == 'open': badge = '<div class="b open">空きあり</div>'
        elif st == 'few': badge = f'<div class="b few">残り<b>{rem}</b>枠</div>'
        elif st == 'full': badge = '<div class="b full">満</div>'
        elif st == 'closed': badge = '<div class="b closed">休</div>'
        else: badge = ''
        cells.append(f'<div class="{" ".join(cls)}"><div class="d">{d.day}</div>{badge}</div>')

page = f'''<!doctype html><html lang="ja"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:1080px;height:1350px;background:#F9F9F8;font-family:'Noto Sans JP','Hiragino Sans',sans-serif;color:#333;padding:72px 56px}}
h1{{font-family:'Playfair Display',serif;font-weight:400;font-size:84px;color:#557A64;letter-spacing:6px;text-align:center}}
.sub{{text-align:center;color:#6A6D6B;font-size:30px;letter-spacing:4px;margin:10px 0 44px}}
.grid{{display:grid;grid-template-columns:repeat(7,1fr);background:#fff;border:2px solid #E8E8E8;border-radius:12px;overflow:hidden}}
.dow{{text-align:center;padding:16px 0;font-size:26px;color:#6A6D6B;background:#F1F4F2;font-family:'Playfair Display',serif;letter-spacing:2px}}
.dow.sun{{color:#C25B5B}}.dow.sat{{color:#4F7FB8}}
.cell{{height:150px;border-top:1px solid #E8E8E8;border-left:1px solid #E8E8E8;padding:8px 4px;text-align:center}}
.cell:nth-child(7n+8){{border-left:none}}
.cell.blank{{background:#FBFBFA}}
.d{{height:42px;line-height:42px;font-size:28px;font-weight:500;text-align:left;padding-left:8px;color:#444}}
.sun .d{{color:#C25B5B}}.sat .d{{color:#4F7FB8}}
.today .d{{display:inline-block;background:#557A64;color:#fff;border-radius:999px;min-width:42px;text-align:center;padding:0 6px;margin-left:4px;float:left}}
.b{{margin:14px auto 0;font-weight:700;font-size:25px;line-height:1.1;border-radius:999px;height:52px;display:flex;align-items:center;justify-content:center;width:112px;clear:both;white-space:nowrap}}
.today .b{{margin-top:14px}}
.b.open{{background:#E3EEE7;color:#3F6A50}}
.b.few{{background:#FCE9C8;color:#9A5B00}}
.b.few b{{font-size:30px;margin:0 1px}}
.b.full{{background:#F6D5D8;color:#B23A48;font-size:30px}}
.b.closed{{background:#ECECEC;color:#8A8A8A;font-size:26px}}
.legend{{display:flex;justify-content:center;gap:22px;margin:36px 0 22px;font-size:24px;color:#555}}
.legend span{{display:flex;align-items:center;gap:8px}}
.legend i{{width:22px;height:22px;border-radius:50%;display:inline-block}}
.note{{text-align:center;color:#6A6D6B;font-size:24px;line-height:1.9}}
.upd{{text-align:center;color:#6A6D6B;font-size:24px;margin-top:8px}}
</style></head><body>
<h1>{Y} / {M:02d}</h1>
<div class="sub">営業日・空き状況</div>
<div class="grid">
{''.join(f'<div class="dow{" sun" if i==0 else " sat" if i==6 else ""}">{n}</div>' for i,n in enumerate(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]))}
{''.join(cells)}
</div>
<div class="legend">
<span><i style="background:#E3EEE7"></i>空きあり</span>
<span><i style="background:#FCE9C8"></i>残り◯枠</span>
<span><i style="background:#F6D5D8"></i>満</span>
<span><i style="background:#ECECEC"></i>休</span>
</div>
<div class="note">営業時間 9:00〜最終受付22:00（日曜は最終施術終了18:10）<br>ご予約は公式LINEまたはInstagramのDMから承っております</div>
<div class="upd">{TODAY.month}/{TODAY.day} 更新</div>
</body></html>'''
open('calendar.html','w').write(page)
for k,v in summary.items(): print(k, v)
