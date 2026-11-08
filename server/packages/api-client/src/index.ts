import type {AuthResponse,CreateMatchInput,LoginInput,MatchRecord,RegisterInput,ScoreDelivery,ScoreSubmission} from "@kenoracric/contracts";
export type {AuthResponse,CreateMatchInput,LoginInput,MatchRecord,RegisterInput,ScoreDelivery,ScoreSubmission} from "@kenoracric/contracts";

export type ApiClientOptions={baseUrl:string;getToken?:()=>string|null};
export class ApiError extends Error{
  constructor(message:string,public readonly status:number,public readonly details?:unknown){super(message);this.name="ApiError";}
}

export function createApiClient({baseUrl,getToken}:ApiClientOptions){
  const root=baseUrl.replace(/\/+$/,"");
  async function request<T>(path:string,init:RequestInit={},token?:string):Promise<T>{
    const accessToken=token??getToken?.()??undefined;
    const headers=new Headers(init.headers);
    headers.set("content-type","application/json");
    if(accessToken)headers.set("authorization","Bearer "+accessToken);
    const response=await fetch(root+path,{...init,headers});
    const body=await response.json().catch(()=>null);
    if(!response.ok){const message=typeof body?.error==="string"?body.error:body?.error?.message??response.statusText;throw new ApiError(String(message),response.status,body);}
    return body as T;
  }
  return {
    baseUrl:root,
    socketUrl:root.replace(/\/api\/v1\/?$/, ""),
    request,
    auth:{
      register:(input:RegisterInput)=>request<{user:AuthResponse["user"]}>("/auth/register",{method:"POST",body:JSON.stringify(input)}),
      login:(input:LoginInput)=>request<AuthResponse>("/auth/login",{method:"POST",body:JSON.stringify(input)}),
    },
    matches:{
      list:()=>request<MatchRecord[]>("/matches"),
      get:(id:string)=>request<MatchRecord>(`/matches/${encodeURIComponent(id)}`),
      create:(input:CreateMatchInput,token?:string)=>request<MatchRecord>("/matches",{method:"POST",body:JSON.stringify(input)},token),
    },
    scoring:{
      submit:(matchId:string,event:ScoreSubmission,token?:string)=>request<MatchRecord>(`/matches/${encodeURIComponent(matchId)}/events`,{method:"POST",body:JSON.stringify(event)},token),
    },
  };
}

export type KenoraCricApi=ReturnType<typeof createApiClient>;
