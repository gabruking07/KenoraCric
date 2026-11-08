import { createApiClient } from "@kenoracric/api-client";
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
export const api = createApiClient({ baseUrl, getToken: () => localStorage.getItem("kc_token") });
export const socketUrl = import.meta.env.VITE_SOCKET_URL || api.socketUrl;
//# sourceMappingURL=api.js.map