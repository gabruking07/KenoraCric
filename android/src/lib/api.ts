import {createApiClient} from "@kenoracric/api-client";

const baseUrl=process.env.EXPO_PUBLIC_API_URL||"http://localhost:5000/api/v1";
export const api=createApiClient({baseUrl});
