/**
 * API Service Layer — Connects frontend to the FastAPI backend
 * All backend calls go through this file.
 */

// ⚠️ CHANGE THIS to your PC's IP address for device testing
// Find your IP: Run `ipconfig` in PowerShell and look for IPv4 Address
const API_BASE_URL = "http://192.168.1.105:8000";  // ← Replace with your IP

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

export interface LanguageOption {
    code: string;
    name: string;
}

// ---------------------------------------------------------------------------
// Main API Functions
// ---------------------------------------------------------------------------

/**
 * Analyze a message for fraud using the backend ML pipeline.
 * Calls POST /api/predict
 */
export async function analyzeMessage(
    message: string,
    language: string = "en"
): Promise<PredictResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
        const response = await fetch(`${API_BASE_URL}/api/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, language }),
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.detail || `Server error (${response.status})`
            );
        }

        return await response.json();
    } catch (error: any) {
        if (error.name === "AbortError") {
            throw new Error("Request timed out. Please check if the backend server is running.");
        }
        if (error.message?.includes("Network request failed") || error.message?.includes("Failed to fetch")) {
            throw new Error(
                "Cannot connect to the server. Make sure the backend is running at " + API_BASE_URL
            );
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Get list of supported languages.
 * Calls GET /api/languages
 */
export async function getLanguages(): Promise<LanguageOption[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/languages`);
        if (!response.ok) throw new Error("Failed to fetch languages");
        const data = await response.json();
        return data.languages;
    } catch {
        // Return defaults if API is unreachable
        return [
            { code: "en", name: "English" },
            { code: "te", name: "Telugu" },
            { code: "hi", name: "Hindi" },
        ];
    }
}

/**
 * Health check — test if backend is reachable.
 * Calls GET /health
 */
export async function healthCheck(): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(`${API_BASE_URL}/health`, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response.ok;
    } catch {
        return false;
    }
}
