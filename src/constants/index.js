// ─── Colors ───────────────────────────────────────────────
export const COLORS = {
  // Backgrounds
  bg:         '#FEF9F0',
  surface:    '#FFFFFF',
  surface2:   '#FFF8EE',
  dark:       '#1A0A00',
  dark2:      '#2D1200',

  // Brand
  primary:    '#F97316',   // saffron orange
  primary2:   '#DC2626',   // deep red

  // Risk
  danger:     '#DC2626',
  dangerBg:   '#FEF2F2',
  dangerBorder:'#FECACA',
  warn:       '#D97706',
  warnBg:     '#FFFBEB',
  warnBorder: '#FDE68A',
  safe:       '#16A34A',
  safeBg:     '#F0FDF4',
  safeBorder: '#BBF7D0',

  // Text
  text:       '#1C1917',
  textMid:    '#44403C',
  muted:      '#78716C',
  dim:        '#A8A29E',

  // Info
  info:       '#2563EB',
  accent2:    '#7C3AED',
};

// ─── Typography sizes ─────────────────────────────────────
export const FONTS = {
  xs:   10,
  sm:   12,
  md:   14,
  lg:   16,
  xl:   20,
  xxl:  26,
  xxxl: 34,
};

// ─── Bilingual text strings ───────────────────────────────
export const TEXT = {
  appName:       { te: 'ఫ్రాడ్‌షీల్డ్', en: 'FraudShield.AI' },
  tagline:       { te: 'మీ డిజిటల్ భద్రత మా బాధ్యత 🛡️', en: 'Your Digital Safety is Our Responsibility' },
  helpline:      { te: 'సైబర్ క్రైమ్ హెల్ప్‌లైన్', en: 'Cyber Crime Helpline' },
  checkBtn:      { te: '🔍 మెసేజ్ చెక్ చేయండి', en: 'Check a Message' },
  learnBtn:      { te: '📚 మోసాల గురించి తెలుసుకోండి', en: 'Learn About Scams' },
  tabAnalyze:    { te: '🔍 తనిఖీ', en: 'Analyze' },
  tabAware:      { te: '📚 అవగాహన', en: 'Awareness' },
  tabHistory:    { te: '📋 చరిత్ర', en: 'History' },
  pastePlaceholder: { te: 'మీ అనుమానాస్పద SMS ఇక్కడ పేస్ట్ చేయండి...', en: 'Paste your suspicious SMS here...' },
  analyzeBtn:    { te: '⚡ ప్రమాదం తనిఖీ చేయండి', en: 'Analyze Threat' },
  scanning:      { te: 'AI విశ్లేషిస్తోంది…', en: 'AI Analyzing...' },
  highRisk:      { te: '⚠️ అధిక ప్రమాదం!', en: 'HIGH RISK' },
  suspicious:    { te: '🔶 అనుమానాస్పదం!', en: 'SUSPICIOUS' },
  safeResult:    { te: '✅ సురక్షితం!', en: 'SAFE' },
  redFlags:      { te: '🚩 ప్రమాద సంకేతాలు', en: 'Red Flags' },
  keywords:      { te: '⚠️ అనుమానిత పదాలు', en: 'Suspicious Keywords' },
  safetyTips:    { te: '🛡️ మీరు ఏమి చేయాలి?', en: 'What Should You Do?' },
  youAreSafe:    { te: 'మీరు సురక్షితంగా ఉన్నారు!', en: "You're Safe!" },
  scamsCaught:   { te: 'మోసాలు పట్టుకున్నాం', en: 'Scams Caught' },
  safeMessages:  { te: 'సురక్షిత మెసేజ్‌లు', en: 'Safe Messages' },
  totalChecked:  { te: 'మొత్తం తనిఖీలు', en: 'Total Checked' },
  recentChecks:  { te: 'తాజా తనిఖీలు', en: 'Recent Checks' },
};

// ─── Sample messages ──────────────────────────────────────
export const SAMPLES = [
  { label: { te: 'లాటరీ మోసం', en: 'Lottery Scam' }, msg: "Congratulations! You've won Rs 5,00,000 in KBC lottery! Send Rs 500 processing fee to UPI: fraud@ybl to claim your prize. Call 9876543210" },
  { label: { te: 'SBI KYC మోసం', en: 'SBI KYC Fraud' }, msg: "Dear customer, your SBI account will be blocked. Update KYC immediately. Click: bit.ly/sbi-kyc-update and enter OTP" },
  { label: { te: 'అమెజాన్ (సురక్షితం)', en: 'Amazon (Safe)' }, msg: "Hi, your Amazon order #1234 has been shipped. Expected delivery: March 6. Track at amazon.in/track" },
  { label: { te: 'ఉద్యోగ మోసం', en: 'Job Scam' }, msg: "URGENT: Work from home job! Earn Rs 50,000/month. No experience needed. Pay Rs 2000 registration fee. WhatsApp: 9999999999" },
];

export const FRAUD_TYPES = {
  'UPI Fraud':     { icon: '💸', color: COLORS.danger,  te: 'UPI మోసం' },
  'Job Scam':      { icon: '💼', color: COLORS.accent2, te: 'నకిలీ ఉద్యోగం' },
  'Lottery Scam':  { icon: '🎰', color: COLORS.warn,    te: 'లాటరీ మోసం' },
  'Phishing':      { icon: '🎣', color: COLORS.info,    te: 'ఫిషింగ్' },
  'Impersonation': { icon: '🎭', color: COLORS.accent2, te: 'నకిలీ వ్యక్తి' },
  'Other':         { icon: '⚠️', color: COLORS.warn,    te: 'ఇతర మోసం' },
  'None':          { icon: '✅', color: COLORS.safe,    te: 'మోసం కాదు' },
};
