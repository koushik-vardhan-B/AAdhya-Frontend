export const en = {
    // Landing / Index
    landing: {
        subtitle: 'Your Digital Safety Companion',
        getStarted: 'Get Started ....',
        pillScamDetection: 'Scam Detection',
        pillRiskScore: 'Risk Score',
        pillPreventionTips: 'Prevention Tips',
    },

    // Login
    login: {
        welcomeBack: 'Welcome Back',
        signInSubtitle: 'Sign in to your account',
        emailLabel: 'Email',
        emailPlaceholder: 'Enter your email',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        forgotPassword: 'Forgot Password?',
        signIn: 'Sign In',
        continueWithGoogle: 'Continue with Google',
        newHere: 'New here? ',
        createAccount: 'Create Account',
        fillAllFields: 'Please enter both email and password.',
    },

    // Signup
    signup: {
        joinTitle: 'Join Rakshana AI',
        tagline: 'Start your journey to digital safety',
        createAccount: 'Create Account',
        fullNameLabel: 'Full Name',
        fullNamePlaceholder: 'Enter your full name',
        emailLabel: 'Email',
        emailPlaceholder: 'Enter your email',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Create a password',
        confirmPasswordLabel: 'Confirm Password',
        confirmPasswordPlaceholder: 'Confirm your password',
        createAccountBtn: 'Create Account',
        signUpWithGoogle: 'Sign up with Google',
        alreadyHaveAccount: 'Already have an account? ',
        signIn: 'Sign In',
        fillAllFields: 'Please fill in all fields.',
        passwordsMismatch: 'Passwords do not match.',
        accountCreated: 'Account created! Check your email to verify, then sign in.',
    },

    // Home
    home: {
        appName: 'Rakshana AI',
        headerSub: 'Digital Safety Guard',
        sectionLabel: 'Check a Suspicious Message',
        sectionDesc: 'Paste any SMS, WhatsApp message, or link below',
        textAreaPlaceholder: "Paste message here...\n\n(e.g. 'You won Rs 25,00,000! Click to claim...')",
        analyzingTitle: 'Analyzing for scam patterns...',
        analyzingSub: 'Checking keywords · Scoring risk · Detecting fraud type',
        checkNow: 'Check Now',
        tipsTitle: 'Quick Safety Tips',
        tipOtp: 'Never share your OTP with anyone',
        tipLinks: 'Do not click on unknown links',
        tipBank: 'Banks never ask for your PIN via SMS',
        tipJob: 'No real job requires an upfront payment',
        pasteMessage: 'Please paste a message to verify.',
    },

    // Result
    result: {
        analysisComplete: 'Analysis Complete',
        fraudTypeDetected: 'Fraud Type Detected',
        suspiciousWords: 'Suspicious words found:',
        whyThisResult: 'Why this result?',
        preventionTips: 'Prevention Tips',
        checkAnother: 'Check Another Message',
        backToHome: 'Back to Home',
        // Fraud types
        lotteryScam: 'Lottery Scam',
        jobScam: 'Job Scam',
        upiBankFraud: 'UPI / Bank Fraud',
        phishingAttempt: 'Phishing Attempt',
        normalMessage: 'Normal Message',
        // Explanations
        lotteryExplanation: 'Contains lottery/prize keywords commonly used to lure victims into sharing personal or financial information.',
        jobExplanation: 'Uses job/salary keywords matching patterns of fake job offers designed to extract money or personal data.',
        upiExplanation: 'References UPI/banking/KYC terms commonly used in financial fraud to trick users into revealing credentials.',
        phishingExplanation: 'Contains suspicious links or click prompts — a common phishing technique to steal login credentials or install malware.',
        safeExplanation: 'No suspicious patterns or scam-related keywords were detected.',
        // Prevention tips
        lotteryTips: [
            'DO NOT click any links in the message.',
            'DO NOT share any OTP or UPI PIN.',
            'No legitimate lottery asks for advance fees.',
            'Delete the message immediately.',
            'If you lost money, call Cybercrime Helpline 1930.',
        ],
        jobTips: [
            'Real companies never ask for money to offer a job.',
            'DO NOT pay any registration or processing fee.',
            'Verify the company name on official websites.',
            'Report this number to Cybercrime Helpline 1930.',
        ],
        upiTips: [
            'Banks NEVER ask for your UPI PIN or OTP via SMS.',
            'DO NOT enter your PIN on any link from SMS.',
            'Visit your nearest bank branch for KYC updates.',
            'If money was debited, call your bank + Helpline 1930.',
        ],
        phishingTips: [
            'DO NOT click on unknown or shortened links.',
            'Verify sender via official customer care (search online, not from SMS).',
            'If you clicked accidentally, change your passwords immediately.',
        ],
        safeTips: [
            'Message seems safe, but always stay alert.',
            'Never share Aadhaar, PAN, or bank info with strangers.',
        ],
    },

    // Analyze
    analyze: {
        title: 'Did you receive a suspicious message?',
        subtitle: 'Paste the SMS, WhatsApp message, or link below to check if it\'s safe or a scam.',
        placeholder: "Paste your message here... (e.g. 'You won a lottery of Rs 25,00,000! Click here to claim...')",
        analyzing: 'Analyzing risk and searching for scams...',
        checkNow: 'Check Now',
        tipsTitle: 'Safety Tips',
        tip1: 'Never share your OTP with anyone.',
        tip2: 'Do not click on unknown links.',
        tip3: 'Banks never ask for your PIN to deposit money.',
        pasteMessage: 'Please paste a message to verify.',
    },

    // Components
    riskMeter: {
        scamProbability: 'Scam Probability',
        safe: 'Safe',
        suspicious: 'Suspicious',
        highRisk: 'High Risk',
    },

    helpline: {
        title: 'National Cybercrime Helpline',
        subtitle: 'Report fraud immediately — free to call',
    },

    // Layout
    layout: {
        welcome: 'Welcome',
        signIn: 'Sign In',
        beSafe: 'Be safe with us',
        analysisResult: 'Analysis Result',
        createAccount: 'Create Account',
    },
};

export type Translations = typeof en;
