/**
 * API Service Layer — Connects frontend to the FastAPI backend
 * All backend calls go through this file.
 * 
 * Backend endpoints covered:
 *   POST /api/predict         → analyzeMessage()
 *   POST /api/predict-image   → analyzeImage()
 *   GET  /api/stats           → getStats()
 *   POST /api/scans           → saveScan()
 *   GET  /api/scans           → getScans()
 *   GET  /api/scans/:id       → getScanById()
 *   GET  /api/community       → getCommunityFeed()
 *   GET  /api/keywords        → getTopKeywords()
 *   POST /api/translate       → translateText()
 *   GET  /api/languages       → getLanguages()
 *   GET  /health              → healthCheck()
 */

// ⚠️ CHANGE THIS to your PC's IP address for device testing
// Find your IP: Run `ipconfig` in PowerShell and look for IPv4 Address
const API_BASE_URL = "http://localhost:8000";  // ← Replace with your IP

// ---------------------------------------------------------------------------
// Types matching backend response
// ---------------------------------------------------------------------------
export interface PredictResponse {
    message: string;
    is_fraud: boolean;
    scam_probability: number;        // 0 to 100
    risk_level: "Safe" | "Suspicious" | "High Risk";
    fraud_type: string | null;
    suspicious_keywords: string[];
    explanation: string;
    prevention_tips: string[];
    helpline: string | null;
    url_analysis: {
        urls_found: string[];
        url_risk_score: number;
        url_warnings: string[];
    } | null;
    detected_language?: string;
    processing_time?: {
        total_ms: number;
        layer1_ms: number;
        layer2_ms: number;
    };
    // Translation fields (when language != "en")
    explanation_original?: string;
    prevention_tips_original?: string[];
    translated_to?: string;
}

export interface ImagePredictResponse extends PredictResponse {
    extracted_text: string;
    ocr_confidence: number;
    ocr_lines: string[];
    error?: string;
    processing_time?: {
        total_ms: number;
        ocr_ms: number;
        layer1_ms: number;
        layer2_ms: number;
    };
}

export interface StatsResponse {
    total_scans: number;
    fraud_detected: number;
    safe_messages: number;
    fraud_rate: number;
    top_scam_patterns: { pattern: string; count: number }[];
    system_status: string;
    models_loaded: {
        layer1: string;
        layer2: string;
    };
}

export interface ScanItem {
    id: string;
    created_at: string;
    message_preview: string;
    scam_probability: number;
    risk_level: string;
    fraud_type: string | null;
    language: string;
}

export interface ScanDetail extends ScanItem {
    full_message: string;
    suspicious_keywords: string[];
    explanation: string;
    prevention_tips: string[];
}

export interface CommunityReport {
    id: string;
    created_at: string;
    fraud_type: string;
    risk_level: string;
    message_preview: string;
}

export interface KeywordItem {
    keyword: string;
    fraud_type: string;
    frequency: number;
}

export interface TranslateResponse {
    original: string;
    translated: string;
    language: string;
    language_code: string;
}

export interface LanguageOption {
    code: string;
    name: string;
}

// ---------------------------------------------------------------------------
// Helper — fetch with timeout
// ---------------------------------------------------------------------------
async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs: number = 30000
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        return response;
    } catch (error: any) {
        if (error.name === "AbortError") {
            throw new Error("Request timed out. Please check if the backend server is running.");
        }
        if (
            error.message?.includes("Network request failed") ||
            error.message?.includes("Failed to fetch")
        ) {
            throw new Error(
                "Cannot connect to the server. Make sure the backend is running at " + API_BASE_URL
            );
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

// ---------------------------------------------------------------------------
// 🔍 POST /api/predict — Analyze text message for fraud
// ---------------------------------------------------------------------------
export async function analyzeMessage(
    message: string,
    language: string = "en"
): Promise<PredictResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, language }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Server error (${response.status})`);
    }

    return await response.json();
}

// ---------------------------------------------------------------------------
// 📸 POST /api/predict-image — Analyze screenshot for fraud (OCR + detection)
// ---------------------------------------------------------------------------
export async function analyzeImage(
    imageUri: string,
    language: string = "en"
): Promise<ImagePredictResponse> {
    const formData = new FormData();

    try {
        // Fetch the local file/blob from the URI (Works for Web & Native)
        const fileResponse = await fetch(imageUri);
        const blob = await fileResponse.blob();

        // Append the blob to FormData
        formData.append("file", blob, "screenshot.jpg");

    } catch (error) {
        throw new Error("Failed to process image file. Please try again.");
    }

    const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/predict-image?language=${language}`,
        {
            method: "POST",
            body: formData,
            // Don't set Content-Type — fetch sets it with boundary for FormData
        },
        60000 // 60s timeout for OCR
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Server error (${response.status})`);
    }

    return await response.json();
}

// ---------------------------------------------------------------------------
// 📊 GET /api/stats — Real-time detection statistics
// ---------------------------------------------------------------------------
export async function getStats(): Promise<StatsResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/stats`, {}, 10000);

    if (!response.ok) {
        throw new Error(`Failed to fetch stats (${response.status})`);
    }

    return await response.json();
}

// ---------------------------------------------------------------------------
// 📋 POST /api/scans — Save a scan result
// ---------------------------------------------------------------------------
export async function saveScan(
    message: string,
    result: Record<string, any>,
    language: string = "en"
): Promise<{ status: string }> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/scans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, language, result }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Failed to save scan (${response.status})`);
    }

    return await response.json();
}

// ---------------------------------------------------------------------------
// 📋 GET /api/scans — Get recent scan history
// ---------------------------------------------------------------------------
export async function getScans(limit: number = 20): Promise<ScanItem[]> {
    const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/scans?limit=${limit}`,
        {},
        10000
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch scans (${response.status})`);
    }

    return await response.json();
}

// ---------------------------------------------------------------------------
// 📋 GET /api/scans/:id — Get a specific scan by ID
// ---------------------------------------------------------------------------
export async function getScanById(scanId: string): Promise<ScanDetail> {
    const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/scans/${scanId}`,
        {},
        10000
    );

    if (!response.ok) {
        if (response.status === 404) throw new Error("Scan not found");
        throw new Error(`Failed to fetch scan (${response.status})`);
    }

    return await response.json();
}

// ---------------------------------------------------------------------------
// 🌐 GET /api/community — Community feed of reported scams
// ---------------------------------------------------------------------------
export async function getCommunityFeed(
    limit: number = 20,
    fraudType?: string
): Promise<CommunityReport[]> {
    let url = `${API_BASE_URL}/api/community?limit=${limit}`;
    if (fraudType) {
        url += `&fraud_type=${encodeURIComponent(fraudType)}`;
    }

    const response = await fetchWithTimeout(url, {}, 10000);

    if (!response.ok) {
        throw new Error(`Failed to fetch community feed (${response.status})`);
    }

    return await response.json();
}

// ---------------------------------------------------------------------------
// 🔑 GET /api/keywords — Top flagged keywords
// ---------------------------------------------------------------------------
export async function getTopKeywords(limit: number = 10): Promise<KeywordItem[]> {
    const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/keywords?limit=${limit}`,
        {},
        10000
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch keywords (${response.status})`);
    }

    return await response.json();
}

// ---------------------------------------------------------------------------
// 🌐 POST /api/translate — Translate text to regional languages
// ---------------------------------------------------------------------------
export async function translateText(
    text: string,
    targetLanguage: string
): Promise<TranslateResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target_language: targetLanguage }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Translation failed (${response.status})`);
    }

    return await response.json();
}

// ---------------------------------------------------------------------------
// 🌐 GET /api/languages — Supported languages list
// ---------------------------------------------------------------------------
export async function getLanguages(): Promise<LanguageOption[]> {
    try {
        const response = await fetchWithTimeout(
            `${API_BASE_URL}/api/languages`,
            {},
            5000
        );
        if (!response.ok) throw new Error("Failed to fetch languages");
        const data = await response.json();
        return data.languages;
    } catch {
        // Return defaults if API is unreachable
        return [
            { code: "en", name: "English" },
            { code: "te", name: "Telugu" },
            { code: "hi", name: "Hindi" },
            { code: "ta", name: "Tamil" },
            { code: "kn", name: "Kannada" },
            { code: "bn", name: "Bengali" },
            { code: "mr", name: "Marathi" },
        ];
    }
}

// ---------------------------------------------------------------------------
// ❤️ GET /health — Backend health check
// ---------------------------------------------------------------------------
export async function healthCheck(): Promise<boolean> {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 5000);
        return response.ok;
    } catch {
        return false;
    }
}
