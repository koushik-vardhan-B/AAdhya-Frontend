import { Translations } from './en';

export const hi: Translations = {
    // Landing / Index
    landing: {
        subtitle: 'आपका डिजिटल सुरक्षा साथी',
        getStarted: 'शुरू करें ....',
        pillScamDetection: 'धोखाधड़ी पहचान',
        pillRiskScore: 'जोखिम स्कोर',
        pillPreventionTips: 'रोकथाम सुझाव',
    },

    // Login
    login: {
        welcomeBack: 'वापसी पर स्वागत',
        signInSubtitle: 'अपने खाते में साइन इन करें',
        emailLabel: 'ईमेल',
        emailPlaceholder: 'अपना ईमेल दर्ज करें',
        passwordLabel: 'पासवर्ड',
        passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
        forgotPassword: 'पासवर्ड भूल गए?',
        signIn: 'साइन इन',
        continueWithGoogle: 'Google से जारी रखें',
        newHere: 'नए हैं? ',
        createAccount: 'खाता बनाएं',
        fillAllFields: 'कृपया ईमेल और पासवर्ड दोनों दर्ज करें।',
    },

    // Signup
    signup: {
        joinTitle: 'रक्षणा AI से जुड़ें',
        tagline: 'डिजिटल सुरक्षा की अपनी यात्रा शुरू करें',
        createAccount: 'खाता बनाएं',
        fullNameLabel: 'पूरा नाम',
        fullNamePlaceholder: 'अपना पूरा नाम दर्ज करें',
        emailLabel: 'ईमेल',
        emailPlaceholder: 'अपना ईमेल दर्ज करें',
        passwordLabel: 'पासवर्ड',
        passwordPlaceholder: 'पासवर्ड बनाएं',
        confirmPasswordLabel: 'पासवर्ड की पुष्टि',
        confirmPasswordPlaceholder: 'अपने पासवर्ड की पुष्टि करें',
        createAccountBtn: 'खाता बनाएं',
        signUpWithGoogle: 'Google से साइन अप करें',
        alreadyHaveAccount: 'पहले से खाता है? ',
        signIn: 'साइन इन',
        fillAllFields: 'कृपया सभी फ़ील्ड भरें।',
        passwordsMismatch: 'पासवर्ड मेल नहीं खाते।',
        accountCreated: 'खाता बनाया गया! सत्यापन के लिए अपना ईमेल जांचें, फिर साइन इन करें।',
    },

    // Home
    home: {
        appName: 'रक्षणा AI',
        headerSub: 'डिजिटल सुरक्षा गार्ड',
        sectionLabel: 'संदिग्ध संदेश की जांच करें',
        sectionDesc: 'नीचे कोई भी SMS, WhatsApp संदेश, या लिंक पेस्ट करें',
        textAreaPlaceholder: "यहां संदेश पेस्ट करें...\n\n(जैसे 'आपने Rs 25,00,000 जीते! क्लिक करें...')",
        analyzingTitle: 'धोखाधड़ी पैटर्न की जांच हो रही है...',
        analyzingSub: 'कीवर्ड जांच · जोखिम स्कोरिंग · धोखाधड़ी प्रकार पहचान',
        checkNow: 'अभी जांचें',
        tipsTitle: 'त्वरित सुरक्षा सुझाव',
        tipOtp: 'अपना OTP किसी के साथ साझा न करें',
        tipLinks: 'अज्ञात लिंक पर क्लिक न करें',
        tipBank: 'बैंक कभी SMS से PIN नहीं मांगते',
        tipJob: 'कोई भी असली नौकरी अग्रिम भुगतान नहीं मांगती',
        pasteMessage: 'कृपया सत्यापित करने के लिए एक संदेश पेस्ट करें।',
    },

    // Result
    result: {
        analysisComplete: 'विश्लेषण पूर्ण',
        fraudTypeDetected: 'धोखाधड़ी प्रकार पहचाना गया',
        suspiciousWords: 'संदिग्ध शब्द मिले:',
        whyThisResult: 'यह परिणाम क्यों?',
        preventionTips: 'रोकथाम सुझाव',
        checkAnother: 'दूसरा संदेश जांचें',
        backToHome: 'होम पर वापस',
        lotteryScam: 'लॉटरी धोखाधड़ी',
        jobScam: 'नौकरी धोखाधड़ी',
        upiBankFraud: 'UPI / बैंक धोखाधड़ी',
        phishingAttempt: 'फ़िशिंग प्रयास',
        normalMessage: 'सामान्य संदेश',
        lotteryExplanation: 'इसमें लॉटरी/पुरस्कार कीवर्ड हैं जो पीड़ितों को व्यक्तिगत या वित्तीय जानकारी साझा करने के लिए लुभाने में उपयोग किए जाते हैं।',
        jobExplanation: 'नौकरी/वेतन कीवर्ड का उपयोग करता है जो नकली नौकरी प्रस्तावों के पैटर्न से मेल खाते हैं।',
        upiExplanation: 'UPI/बैंकिंग/KYC शब्दों का संदर्भ देता है जो वित्तीय धोखाधड़ी में आमतौर पर उपयोग किए जाते हैं।',
        phishingExplanation: 'इसमें संदिग्ध लिंक या क्लिक संकेत हैं — लॉगिन क्रेडेंशियल चुराने की एक सामान्य फ़िशिंग तकनीक।',
        safeExplanation: 'कोई संदिग्ध पैटर्न या धोखाधड़ी-संबंधित कीवर्ड नहीं मिले।',
        lotteryTips: [
            'संदेश में किसी भी लिंक पर क्लिक न करें।',
            'कोई OTP या UPI PIN साझा न करें।',
            'कोई भी वैध लॉटरी अग्रिम शुल्क नहीं मांगती।',
            'संदेश तुरंत हटा दें।',
            'यदि पैसे खो गए, तो साइबर अपराध हेल्पलाइन 1930 पर कॉल करें।',
        ],
        jobTips: [
            'असली कंपनियां नौकरी देने के लिए कभी पैसे नहीं मांगतीं।',
            'कोई पंजीकरण या प्रसंस्करण शुल्क न दें।',
            'कंपनी का नाम आधिकारिक वेबसाइटों पर सत्यापित करें।',
            'इस नंबर की रिपोर्ट साइबर अपराध हेल्पलाइन 1930 पर करें।',
        ],
        upiTips: [
            'बैंक कभी SMS से UPI PIN या OTP नहीं मांगते।',
            'SMS के किसी लिंक पर PIN दर्ज न करें।',
            'KYC अपडेट के लिए अपनी नजदीकी बैंक शाखा जाएं।',
            'यदि पैसे कटे, तो बैंक + हेल्पलाइन 1930 पर कॉल करें।',
        ],
        phishingTips: [
            'अज्ञात या छोटे लिंक पर क्लिक न करें।',
            'आधिकारिक ग्राहक सेवा से प्रेषक सत्यापित करें।',
            'यदि गलती से क्लिक किया, तो तुरंत पासवर्ड बदलें।',
        ],
        safeTips: [
            'संदेश सुरक्षित लगता है, लेकिन हमेशा सतर्क रहें।',
            'अजनबियों के साथ आधार, PAN या बैंक जानकारी साझा न करें।',
        ],
    },

    // Analyze
    analyze: {
        title: 'क्या आपको कोई संदिग्ध संदेश मिला?',
        subtitle: 'यह जांचने के लिए कि यह सुरक्षित है या धोखाधड़ी, नीचे SMS, WhatsApp संदेश या लिंक पेस्ट करें।',
        placeholder: "अपना संदेश यहां पेस्ट करें... (जैसे 'आपने Rs 25,00,000 की लॉटरी जीती! यहां क्लिक करें...')",
        analyzing: 'जोखिम का विश्लेषण और धोखाधड़ी की खोज हो रही है...',
        checkNow: 'अभी जांचें',
        tipsTitle: 'सुरक्षा सुझाव',
        tip1: 'अपना OTP किसी के साथ भी साझा न करें।',
        tip2: 'अज्ञात लिंक पर क्लिक न करें।',
        tip3: 'बैंक कभी पैसे जमा करने के लिए PIN नहीं मांगते।',
        pasteMessage: 'कृपया सत्यापित करने के लिए एक संदेश पेस्ट करें।',
    },

    // Components
    riskMeter: {
        scamProbability: 'धोखाधड़ी संभावना',
        safe: 'सुरक्षित',
        suspicious: 'संदिग्ध',
        highRisk: 'उच्च जोखिम',
    },

    helpline: {
        title: 'राष्ट्रीय साइबर अपराध हेल्पलाइन',
        subtitle: 'धोखाधड़ी की तुरंत रिपोर्ट करें — कॉल मुफ्त',
    },

    // Layout
    layout: {
        welcome: 'स्वागत',
        signIn: 'साइन इन',
        beSafe: 'हमारे साथ सुरक्षित रहें',
        analysisResult: 'विश्लेषण परिणाम',
        createAccount: 'खाता बनाएं',
    },
};
