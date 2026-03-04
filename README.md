# 🛡️ FraudShield.AI — Mobile App

> AI-Based Fraud Risk Detection & Digital Awareness System for Rural India  
> Telugu + English Bilingual · React Native (Expo) · Claude AI Powered

---

## 📱 Screens

| Screen | Telugu | Purpose |
|--------|--------|---------|
| `SplashScreen` | స్ప్లాష్ | App launch, onboarding |
| `HomeScreen` | హోమ్ | Tab navigator host |
| `AnalyzeScreen` | తనిఖీ | Message input + AI analysis result |
| `AwarenessScreen` | అవగాహన | Fraud education (accordion cards) |
| `HistoryScreen` | చరిత్ర | Past analyses + stats dashboard |

---

## 🗂️ Project Structure

```
FraudShieldApp/
├── App.js
├── package.json
└── src/
    ├── constants/
    │   └── index.js          # Colors, fonts, text strings (Telugu+English), sample messages
    ├── services/
    │   └── fraudAnalysis.js  # Claude API integration
    ├── components/
    │   └── index.js          # Reusable: BiText, RiskBadge, ScoreGauge, TipItem, HelplineBar...
    ├── navigation/
    │   └── AppNavigator.js   # Stack navigator (Splash → Home)
    └── screens/
        ├── SplashScreen.js
        ├── HomeScreen.js
        ├── AnalyzeScreen.js
        ├── AwarenessScreen.js
        └── HistoryScreen.js
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Android Studio / Xcode (for device testing)

### Install
```bash
npm install
```

### Run
```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

---

## 🔑 API Key Setup

The app calls the Anthropic Claude API. Add your key in `src/services/fraudAnalysis.js`:

```js
// The API key is handled by the proxy — no key needed in claude.ai
// For standalone deployment, add to your .env:
ANTHROPIC_API_KEY=your_key_here
```

For production, use a backend proxy to protect your API key.

---

## 🎨 Design System

### Colors
| Token | Value | Use |
|-------|-------|-----|
| `primary` | `#F97316` | Saffron orange — brand |
| `danger` | `#DC2626` | High risk |
| `warn` | `#D97706` | Suspicious |
| `safe` | `#16A34A` | Safe |
| `dark` | `#1A0A00` | App bar, helpline bar |

### Fonts
- **Baloo 2** — Headlines, buttons, labels (Telugu-friendly)
- **Hind Guntur** — Telugu body text (native script)
- **DM Sans** — English body text, captions

---

## ✅ Features Implemented

- [x] SMS / message risk analysis via Claude AI
- [x] Scam probability score (0–100)
- [x] Risk classification: Safe / Suspicious / High Risk
- [x] Fraud type detection: UPI, Job, Lottery, Phishing, Impersonation
- [x] Suspicious keyword highlighting
- [x] Preventive guidance & safety tips
- [x] Cybercrime helpline 1930 displayed prominently
- [x] Telugu + English bilingual UI
- [x] Analysis history with stats dashboard
- [x] Fraud awareness education (expandable cards)
- [x] Sample messages for demo

---

## 🆘 Emergency Helplines

| సేవ | నంబర్ |
|-----|-------|
| సైబర్ క్రైమ్ హెల్ప్‌లైన్ | **1930** |
| పోలీస్ అత్యవసర | **100** |
| మహిళా హెల్ప్‌లైన్ | **181** |
| NPCI UPI వివాదాలు | **1800-120-1740** |

---

## 🏆 Hackathon Notes

Built for: AI-Based Fraud Risk Detection & Digital Awareness System  
Target users: Rural citizens of Andhra Pradesh / Telangana  
Language: Telugu-first bilingual interface  
AI: Claude Sonnet (Anthropic) via REST API
