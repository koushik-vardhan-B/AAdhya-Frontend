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

// ⚠️ CHANGE THIS to your deployed backend URL or PC's local IP for device testing
// Find your IP: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux) → IPv4 Address
const API_BASE_URL = "https://koushik-vardhan1-aadhya-backend.hf.space"; // ← Replace with your Render URL or local IP


import * as FileSystem from 'expo-file-system/legacy';

// ---------------------------------------------------------------------------
// Types matching backend response
// ---------------------------------------------------------------------------
export interface PredictResponse {
    message: string;
    is_fraud: boolean;
    scam_probability: number; // 0 to 100
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
    imageUri: string;
}

export interface ScanDetail {
    id: string;
    message: string;
    language: string;
    result: Record<string, any>;
    created_at: string;
}

export interface CommunityReport {
    id: string;
    message: string;
    fraud_type: string;
    risk_level: string;
    created_at: string;
}

export interface KeywordItem {
    keyword: string;
    count: number;
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
// Helper — parse FastAPI error detail (can be string, list, or object)
// ---------------------------------------------------------------------------
function parseErrorDetail(errorData: any, fallback: string): string {
    if (!errorData) return fallback;
    const detail = errorData.detail;
    if (!detail) return fallback;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ");
    if (typeof detail === "object") return JSON.stringify(detail);
    return fallback;
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
        throw new Error(parseErrorDetail(errorData, `Server error (${response.status})`));
    }

    return await response.json();
}

// ---------------------------------------------------------------------------
// 📸 POST /api/predict-image — Analyze screenshot for fraud (OCR + detection)
// Uses XMLHttpRequest instead of fetch — fixes React Native FormData file upload bug
// where fetch serializes the {uri, name, type} object as a string instead of a file
// ---------------------------------------------------------------------------

export async function analyzeImage(
    imageUri: string,
    language: string = "en"
): Promise<ImagePredictResponse> {

    const formData = new FormData();
    formData.append("file", {
        uri: imageUri,
        name: "image.jpg",
        type: "image/jpeg",
    } as any); // ← XHR handles {uri,name,type} correctly unlike fetch

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE_URL}/api/predict-image?language=${language}`);
        xhr.timeout = 60000;

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                let detail = `Server error (${xhr.status})`;
                try {
                    const err = JSON.parse(xhr.responseText);
                    detail = parseErrorDetail(err, detail);
                } catch {}
                reject(new Error(detail));
            }
        };
        xhr.onerror = () =>
            reject(new Error("Cannot connect to server at " + API_BASE_URL));
        xhr.ontimeout = () =>
            reject(new Error("Request timed out. Check if backend is running."));

        xhr.send(formData);
    });
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
        throw new Error(parseErrorDetail(errorData, `Failed to save scan (${response.status})`));
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
        throw new Error(parseErrorDetail(errorData, `Translation failed (${response.status})`));
    }

    return await response.json();
}

// ---------------------------------------------------------------------------
// 🌐 GET /api/languages — Get supported languages
// ---------------------------------------------------------------------------
export async function getLanguages(): Promise<LanguageOption[]> {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/api/languages`, {}, 10000);

        if (!response.ok) {
            throw new Error(`Failed to fetch languages (${response.status})`);
        }

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