// 予約ミニアプリ(/booking)の文言。HPトップ(ja.ts / en.ts)とは別ファイルで管理する
import type { Lang } from './LanguageContext';

export const bookingJa = {
  htmlLang: 'ja',
  yenSuffix: '円',
  longDate: (y: number, m: number, d: number, wd: string) => `${y}年${m}月${d}日（${wd}）`,
  dateTime: (date: string, start: string, end: string) => `${date}\u3000${start}〜${end}`,

  steps: { menu: 'メニュー', datetime: '日時選択', confirm: '予約内容確認', complete: 'ご予約完了' },

  menuSelect: {
    header: 'メニュー',
    subtitle: 'ご希望のメニューをお選びください',
    loading: '読み込み中...',
    chooseDuration: '施術時間を選択',
    visitTitle: 'ご来店について',
    visitNote: 'ご予約時間の5分前からご来店可能です。早く着きそうな場合はLINEでご確認おねがいします',
    cancelTitle: 'キャンセルについて',
    cancelFree: '前日23時まで：無料',
    cancelFull: '当日キャンセル：全額',
    selected: '選択中',
    pickMenu: 'メニューを選択してください',
    next: '次へ\u3000→',
    rangeSeparator: ' 〜 ',
  },
  menuNames: {
    oil: 'オイルマッサージ',
    seitai: '整体',
    training: 'パーソナルトレーニング',
    training_early: '早朝パーソナル(6時〜9時スタート)',
    oil_first: '初回オイルマッサージ(1000円OFF)',
    seitai_first: '初回整体(1000円OFF)',
    training_first: '初回パーソナルトレーニング(2000円OFF)',
  } as Record<string, string>,
  menuDesc: {
    oil: '全身のコリや疲れを癒すオイルトリートメント',
    seitai: '骨格・姿勢を整える本格整体ケア',
    oil_first: '初めての方限定のオイルトリートメント',
    seitai_first: '初めてのお客様限定！骨格・姿勢を整える本格整体ケア',
    training_first: '初めてのお客様限定のパーソナルトレーニング',
  } as Record<string, string>,
  duration: (n: number, apiLabel?: string) => apiLabel ?? `${n}分`,

  datetime: {
    prevWeek: '前の一週間',
    nextWeek: '次の一週間',
    dateHeader: '日時',
    loading: '読み込み中...',
    selected: '選択中',
    pick: '日時を選択してください',
    back: '戻る',
    next: '次へ\u3000→',
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
    monthLabel: (y: number, m1: number, m2: number) => (
      m1 === m2
        ? `${y}年${String(m1).padStart(2, '0')}月`
        : `${y}年${String(m1).padStart(2, '0')}月〜${String(m2).padStart(2, '0')}月`
    ),
    selectedValue: (m: number, d: number, wd: string, time: string) => `${m}/${d}（${wd}）${time}〜`,
  },

  confirm: {
    header: 'ご予約内容の確認',
    trialBadge: '✨ 初回体験セッション — 初回限定価格でご利用いただけます！',
    cardTitle: 'ご予約内容',
    date: '日付',
    menu: 'メニュー',
    menuLine: (name: string, duration: string) => `${name}\u3000${duration}`,
    total: '合計（消費税込）',
    first: '初回',
    payOnsite: '（現地決済）',
    trainingTitle: '⏳ トレーニング予約について',
    trainingBefore: 'こちらは',
    trainingStrong: '仮予約',
    trainingAfter: 'です。トレーナーがレンタルジムの空きを確認後、前日22時までにLINEでご連絡します。確定後にジムの場所をお知らせします。',
    commentTitle: 'その他ご要望',
    commentLines: ['ご予約時間の5分前からご来店可能です。', 'その他ご要望がありましたらコメントをご入力ください。', '※コメントへの返信は行っておりません。'],
    commentPlaceholder: 'コメントを入力（任意）',
    policyTitle: '⚠️ キャンセルポリシー',
    policyFreeBefore: '前日23時まで：',
    policyFreeStrong: '無料',
    policyFullBefore: '当日キャンセル：',
    policyFullStrong: '料金の100%をいただきます',
    sending: '送信中...',
    submitTraining: '仮予約を申し込む\u3000→',
    submit: 'この内容で予約する\u3000→',
    edit: '修正する',
  },

  complete: {
    pendingHeader: '仮予約受付',
    pendingTitle: '仮予約を受け付けました',
    trialSession: '初回体験セッション',
    defaultTraining: 'パーソナルトレーニング',
    cardTitle: 'ご予約内容',
    date: '日付',
    menu: 'メニュー',
    price: '料金（消費税込）',
    first: '初回 ',
    payOnsite: '（現地決済）',
    nextTitle: '📋 次のステップ',
    step1: '① トレーナーがレンタルジムの空きを確認します',
    step2Before: '② ',
    step2Strong: '前日22時まで',
    step2After: 'にLINEで確定通知をお送りします',
    step3: '③ 確定後にジムの場所をご案内します📍',
    backTop: 'トップに戻る',
    header: 'ご予約完了',
    confirmed: 'ご予約が確定しました',
    seeYou: 'またのご来店を心よりお待ちしております',
    bookingNo: '予約番号',
    total: '合計（消費税込）',
    visitTitle: 'ご来店について',
    visitLines: ['ご予約時間の5分前からご来店可能です。', 'ご不明な点はLINEよりお気軽にお問い合わせください。'],
    newBooking: '新しく予約する\u3000→',
    viewHistory: '予約確認ページへ',
  },

  history: {
    header: '予約履歴',
    loading: '読み込み中...',
    empty: '予約履歴はありません',
    newBooking: '新規予約',
    current: '現在の予約',
    heading: (y: number, m: number, d: number, wd: string, time: string) => `${y}年${m}月${d}日（${wd} ${time}）`,
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
    timeRange: (start: string, end: string) => `${start} ～ ${end}`,
    pending: '確定待ち',
    confirmed: '確定',
    menu: 'メニュー',
    duration: '時間',
    goals: '目標',
    trainingPending: 'トレーナーが確認次第、確定通知をお送りします',
    trainingConfirmed: 'キャンセルはLINEにてトレーナーにご連絡ください',
    changeCancel: '予約の変更・キャンセル',
    pastDeadlineLines: ['※前日23時を過ぎているため、キャンセルできません。', 'LINEにてご連絡ください。'],
    confirmCancel: '本当にこの予約をキャンセルしてもよろしいですか？',
  },

  err: {
    unknown: 'エラーが発生しました',
    slotTaken: 'この時間は埋まってしまいました',
    bookingFailed: '予約に失敗しました',
    connection: 'サーバーへの接続に失敗しました。しばらく待ってから再度お試しください。',
    notInLine: 'LINEアプリ内から開いてください（LIFF未初期化）',
    liff: (msg: string) => `LINE連携エラー: ${msg} — LINEアプリから開き直してください`,
    availabilityFailed: '利用可能時間の取得に失敗しました',
    cancelFailed: 'キャンセルに失敗しました',
  },

  // LINEのトークに自動送信する予約内容 (先頭の【予約完了】はボットが無視するための目印)
  chatMessage: (a: { menuName: string; duration: string; m: number; d: number; wd: string; time: string; endTime: string; name: string }) =>
    `【予約完了】\n${a.menuName}（${a.duration}）\n${a.m}月${a.d}日（${a.wd}）${a.time}〜${a.endTime}\n${a.name}`,
};

export type BookingDict = typeof bookingJa;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const EN_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const bookingEn: BookingDict = {
  htmlLang: 'en',
  yenSuffix: '',
  longDate: (y: number, m: number, d: number, wd: string) => `${wd}, ${MONTHS[m - 1]} ${d}, ${y}`,
  dateTime: (date: string, start: string, end: string) => `${date}  ${start} - ${end}`,

  steps: { menu: 'Menu', datetime: 'Date & Time', confirm: 'Confirm', complete: 'Done' },

  menuSelect: {
    header: 'Menu',
    subtitle: 'Please choose a menu',
    loading: 'Loading...',
    chooseDuration: 'Choose a duration',
    visitTitle: 'Before your visit',
    visitNote: 'You can arrive from 5 minutes before your booking time. If you expect to arrive earlier, please check with us on LINE.',
    cancelTitle: 'Cancellation',
    cancelFree: 'Until 11 PM the day before: free',
    cancelFull: 'Same-day cancellation: full charge',
    selected: 'Selected',
    pickMenu: 'Please select a menu',
    next: 'Next  →',
    rangeSeparator: ' - ',
  },
  menuNames: {
    oil: 'Oil Massage',
    seitai: 'Seitai (Body Alignment)',
    training: 'Personal Training',
    training_early: 'Early Morning Personal Training (starts 6-9 AM)',
    oil_first: 'First-time Oil Massage (¥1,000 OFF)',
    seitai_first: 'First-time Seitai (¥1,000 OFF)',
    training_first: 'First-time Personal Training (¥2,000 OFF)',
  },
  menuDesc: {
    oil: 'Oil treatment to ease stiffness and fatigue throughout the body',
    seitai: 'Authentic seitai care to align your frame and posture',
    oil_first: 'Oil treatment for first-time guests only',
    seitai_first: 'First-time guests only! Authentic seitai care to align your frame and posture',
    training_first: 'Personal training for first-time guests only',
  },
  duration: (n: number) => `${n} min`,

  datetime: {
    prevWeek: 'Previous week',
    nextWeek: 'Next week',
    dateHeader: 'Date',
    loading: 'Loading...',
    selected: 'Selected',
    pick: 'Please select a date and time',
    back: 'Back',
    next: 'Next  →',
    weekdays: EN_WEEKDAYS,
    monthLabel: (y: number, m1: number, m2: number) => (
      m1 === m2 ? `${MONTHS[m1 - 1]} ${y}` : `${MONTHS[m1 - 1]} - ${MONTHS[m2 - 1]} ${y}`
    ),
    selectedValue: (m: number, d: number, wd: string, time: string) => `${wd}, ${m}/${d}  ${time}-`,
  },

  confirm: {
    header: 'Confirm Your Booking',
    trialBadge: '✨ First-time session — the special first-visit price applies!',
    cardTitle: 'Booking Details',
    date: 'Date',
    menu: 'Menu',
    menuLine: (name: string, duration: string) => `${name}  ${duration}`,
    total: 'Total (tax included)',
    first: 'First visit ',
    payOnsite: '(pay at the salon)',
    trainingTitle: '⏳ About training reservations',
    trainingBefore: 'This is a ',
    trainingStrong: 'provisional booking',
    trainingAfter: '. The trainer will check rental gym availability and contact you via LINE by 10 PM the day before. Once confirmed, we will let you know the gym location.',
    commentTitle: 'Special Requests',
    commentLines: ['You can arrive from 5 minutes before your booking time.', 'If you have any other requests, please enter them below.', '* We do not reply to comments.'],
    commentPlaceholder: 'Enter a comment (optional)',
    policyTitle: '⚠️ Cancellation Policy',
    policyFreeBefore: 'Until 11 PM the day before: ',
    policyFreeStrong: 'Free',
    policyFullBefore: 'Same-day cancellation: ',
    policyFullStrong: '100% of the fee is charged',
    sending: 'Sending...',
    submitTraining: 'Request booking  →',
    submit: 'Book now  →',
    edit: 'Edit',
  },

  complete: {
    pendingHeader: 'Request Received',
    pendingTitle: 'Reservation request received',
    trialSession: 'First-time session',
    defaultTraining: 'Personal Training',
    cardTitle: 'Booking Details',
    date: 'Date',
    menu: 'Menu',
    price: 'Price (tax included)',
    first: 'First visit ',
    payOnsite: '(pay at the salon)',
    nextTitle: '📋 Next steps',
    step1: '① The trainer checks rental gym availability',
    step2Before: '② We will send a confirmation on LINE ',
    step2Strong: 'by 10 PM the day before',
    step2After: '',
    step3: '③ Once confirmed, we will tell you where the gym is 📍',
    backTop: 'Back to top',
    header: 'Booking Complete',
    confirmed: 'Your booking is confirmed',
    seeYou: 'We look forward to seeing you',
    bookingNo: 'Booking No.',
    total: 'Total (tax included)',
    visitTitle: 'Before your visit',
    visitLines: ['You can arrive from 5 minutes before your booking time.', 'If you have any questions, feel free to contact us on LINE.'],
    newBooking: 'Book again  →',
    viewHistory: 'View my bookings',
  },

  history: {
    header: 'My Bookings',
    loading: 'Loading...',
    empty: 'You have no bookings',
    newBooking: 'New booking',
    current: 'Current bookings',
    heading: (y: number, m: number, d: number, wd: string, time: string) => `${MONTHS[m - 1]} ${d}, ${y} (${wd} ${time})`,
    weekdays: EN_WEEKDAYS,
    timeRange: (start: string, end: string) => `${start} - ${end}`,
    pending: 'Pending',
    confirmed: 'Confirmed',
    menu: 'Menu',
    duration: 'Duration',
    goals: 'Goals',
    trainingPending: 'The trainer will send a confirmation once they have checked availability',
    trainingConfirmed: 'To cancel, please contact the trainer via LINE',
    changeCancel: 'Change / cancel booking',
    pastDeadlineLines: ['* Cancellation is no longer possible because it is past 11 PM the day before.', 'Please contact us on LINE.'],
    confirmCancel: 'Are you sure you want to cancel this booking?',
  },

  err: {
    unknown: 'An error occurred',
    slotTaken: 'Sorry, that time has just been taken',
    bookingFailed: 'Failed to create your booking',
    connection: 'Could not connect to the server. Please wait a moment and try again.',
    notInLine: 'Please open this page from the LINE app (LIFF is not initialized)',
    liff: (msg: string) => `LINE connection error: ${msg} - please reopen from the LINE app`,
    availabilityFailed: 'Failed to load available times',
    cancelFailed: 'Failed to cancel',
  },

  // 先頭行はボット側で無視する目印 (bookingFlow.js の「✅ Booking complete」)
  chatMessage: (a) =>
    `✅ Booking complete\n${a.menuName} (${a.duration})\n${a.wd}, ${MONTHS[a.m - 1]} ${a.d} ${a.time}-${a.endTime}\n${a.name}`,
};

export const BOOKING_DICTS: Record<Lang, BookingDict> = { ja: bookingJa, en: bookingEn };

// シートに保存されている日本語のメニュー名 → メニューID (履歴画面で英語表示に直すため)
const JA_NAME_TO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(bookingJa.menuNames).map(([id, name]) => [name, id])
);

// シートに保存されている日本語の目標 → 英語
const GOAL_EN: Record<string, string> = {
  '筋肉をつけて身体大きくしたい': 'Build muscle and get bigger',
  '腹筋を割りたい': 'Get visible abs',
  '健康的に痩せたい': 'Lose weight in a healthy way',
  '健康的な身体になりたい': 'Become healthier',
  '運動不足を解消したい': 'Get more active',
};

/** メニューIDから表示名を返す。英語は辞書、日本語はAPI/シートの名前をそのまま使う */
export function localizedMenuName(dict: BookingDict, id: string | undefined, fallback: string): string {
  if (dict.htmlLang === 'ja') return fallback;
  return (id && dict.menuNames[id]) || fallback;
}

/** シートの日本語メニュー名から表示名を返す (英語のとき辞書に無ければそのまま) */
export function localizedMenuNameFromSheet(dict: BookingDict, sheetName: string): string {
  if (dict.htmlLang === 'ja') return sheetName;
  const id = JA_NAME_TO_ID[sheetName];
  return id ? dict.menuNames[id] : sheetName;
}

/** シートの目標文字列 (日本語) を英語に置換する。未登録の自由入力はそのまま */
export function localizedGoals(dict: BookingDict, goals: string): string {
  if (dict.htmlLang === 'ja') return goals;
  return Object.entries(GOAL_EN)
    .reduce((acc, [ja, en]) => acc.split(ja).join(en), goals)
    .replace(/、/g, ', ');
}
