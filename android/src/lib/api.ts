import {createApiClient} from "@kenoracric/api-client";
import {MOBILE_API_URL} from "./api-config";

export const api=createApiClient({baseUrl:MOBILE_API_URL});
