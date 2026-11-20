import json, datetime, calendar, html
Y, M = 2026, 11
TODAY = datetime.date(2026, 11, 20)
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

OVERRIDES = {10:('few',3),11:('few',3),15:('open',None),5:('few',1),6:('few',1),8:('few',3),12:('few',2),18:('few',2),21:('few',3),22:('few',3),24:('few',2),25:('closed',None),28:('few',2),29:('few',2)}

# セルに添える注記 (日 -> 文言)
NOTES = {
    20: '11:00〜16:10\n19:00〜',
    21: '9:00〜(70分)\n12:30〜16:40\n19:30〜',
    22: '9:00〜11:40\n14:00〜',
    23: '9:00〜18:10',
    24: '20:00〜',
    26: '12:00〜21:10',
    27: '9:00〜13:10\n16:00〜',
    28: '9:00〜16:40',
    29: '9:00〜10:40\n13:00〜18:10',
}

def status(d):
    if d < TODAY: return ('past', None)
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
    pastrow = all(x.month != M or x < TODAY for x in w)
    for d in w:
        if d.month != M:
            cells.append(f'<div class="cell blank{" pr" if pastrow else ""}"></div>'); continue
        st, rem = status(d)
        summary[d.isoformat()] = (st, rem)
        cls = ['cell']
        if d.weekday() == 6: cls.append('sun')
        if d.weekday() == 5: cls.append('sat')
        if d in HOLIDAYS: cls.append('sun')
        if d == TODAY: cls.append('today')
        if d.day in NOTES: cls.append('hasnote')
        if pastrow: cls.append('pr')
        lab, ccls = '', ''
        if st == 'open': lab, ccls = '', 'c-open'
        elif st == 'few': lab, ccls = f'残り{rem}枠', f'c-few{rem}'
        elif st == 'full': lab, ccls = '満', 'c-full'
        elif st == 'closed': lab, ccls = '', 'c-closed'
        if ccls: cls.append(ccls)
        note = f'<div class="n">{NOTES[d.day].replace(chr(10), "<br>")}</div>' if d.day in NOTES and st != 'past' else ''
        cl = '<div class="cl">休</div>' if st == 'closed' else ''
        cells.append(f'<div class="{" ".join(cls)}"><div class="top"><div class="d">{d.day}</div><div class="lab">{lab}</div></div>{cl}{note}</div>')

page = f'''<!doctype html><html lang="ja"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:1080px;height:1350px;background:#F9F9F8;font-family:'Noto Sans JP','Hiragino Sans',sans-serif;color:#333;padding:72px 56px}}
h1{{font-family:'Playfair Display',serif;font-weight:400;font-size:84px;color:#557A64;letter-spacing:6px;text-align:center}}
.sub{{text-align:center;color:#6A6D6B;font-size:30px;letter-spacing:4px;margin:10px 0 44px}}
.grid{{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));background:#fff;border:2px solid #E8E8E8;border-radius:12px;overflow:hidden}}
.dow{{text-align:center;padding:16px 0;font-size:26px;color:#6A6D6B;background:#F1F4F2;font-family:'Playfair Display',serif;letter-spacing:2px}}
.dow.sun{{color:#C25B5B}}.dow.sat{{color:#4F7FB8}}
.cell{{min-height:190px;border-top:1px solid #E8E8E8;border-left:1px solid #E8E8E8;padding:8px 4px;text-align:center}}
.cell:nth-child(7n+8){{border-left:none}}
.cell.blank{{background:#FBFBFA}}
.top{{display:flex;align-items:center;justify-content:space-between;gap:4px;height:42px;padding:0 4px 0 6px}}
.d{{min-width:40px;height:40px;line-height:40px;font-size:27px;font-weight:500;text-align:center;color:#444}}
.sun .d{{color:#C25B5B}}.sat .d{{color:#4F7FB8}}
.today .d{{background:#557A64;color:#fff;border-radius:999px}}
.lab{{font-size:18px;font-weight:700;white-space:nowrap;letter-spacing:0}}
.cell.pr{{min-height:0;height:84px}}
.n{{margin-top:14px;font-size:20px;line-height:1.35;font-weight:500;color:#333;letter-spacing:0;white-space:nowrap;text-align:left;padding-left:6px}}
.c-open{{background:#DCEBDF}} .c-open .lab{{color:#3F6A50}}
.c-few3{{background:#F1F0C9}} .c-few3 .lab{{color:#6F6A12}}
.c-few2{{background:#FBE2B5}} .c-few2 .lab{{color:#8F5300}}
.c-few1{{background:#F8C7AE}} .c-few1 .lab{{color:#A6360F}}
.c-full{{background:#F4CDD2}} .c-full .lab{{color:#B23A48}}
.c-closed{{background:#ECECEC}}
.cl{{margin-top:14px;text-align:center;font-size:40px;font-weight:700;color:#8A8A8A}}
.note{{margin-top:44px;text-align:center;color:#6A6D6B;font-size:24px;line-height:1.9}}
.upd{{text-align:center;color:#6A6D6B;font-size:24px;margin-top:8px}}
</style></head><body>
<h1>{Y} / {M:02d}</h1>
<div class="sub">営業日・空き状況</div>
<div class="grid">
{''.join(f'<div class="dow{" sun" if i==0 else " sat" if i==6 else ""}">{n}</div>' for i,n in enumerate(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]))}
{''.join(cells)}
</div>
<div class="note">営業時間 9:00〜最終受付22:00（日曜は最終施術終了18:10）<br>ご予約は公式LINEまたはInstagramのDMから承っております</div>
<div class="upd">{TODAY.month}/{TODAY.day} 更新</div>
</body></html>'''
open('calendar.html','w').write(page)
for k,v in summary.items(): print(k, v)
