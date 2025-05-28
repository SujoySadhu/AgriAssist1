import useUserData from "../plugin/useUserData";

export const API_BASE_URL = "http://127.0.0.1:8000/api/v1/";
export const SERVER_URL = "http://127.0.0.1:8000";
export const CLIENT_URL = "http://localhost:5173";
export const PAYPAL_CLIENT_ID = "test";
export const CURRENCY_SIGN = "$";
export const userId = useUserData()?.user_id;
export const teacherId = useUserData()?.teacher_id;
console.log(teacherId);
