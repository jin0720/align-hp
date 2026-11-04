# 空き状況カレンダー画像の作り方

1. `data/av_YYYY-MM-DD.json` に予約API (`/api/availability?date=...&duration=70`) の結果を保存する
2. `gen.py` の `OVERRIDES` に手動で上書きしたい日を書く（空きあり/残り◯枠/満/休）
3. `python3 gen.py` で `calendar.html` を生成し、Chrome headless で 1080x1350 のPNGに書き出す
4. `public/images/calendar/current.png` に上書きし、`src/calendarInfo.ts` の更新日を直す
