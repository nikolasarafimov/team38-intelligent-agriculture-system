export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const ML_API_BASE_URL =
    import.meta.env.VITE_ML_API_BASE_URL || "http://localhost:8000";

export const DEMO_USER_ID =
    Number(import.meta.env.VITE_DEMO_USER_ID) || 1;