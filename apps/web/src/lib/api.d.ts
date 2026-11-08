export declare const api: {
    baseUrl: string;
    socketUrl: string;
    request: <T>(path: string, init?: RequestInit, token?: string) => Promise<T>;
    auth: {
        register: (input: import("@kenoracric/contracts").RegisterInput) => Promise<{
            user: import("@kenoracric/contracts").AuthResponse["user"];
        }>;
        login: (input: import("@kenoracric/contracts").LoginInput) => Promise<import("@kenoracric/contracts").AuthResponse>;
    };
    matches: {
        list: () => Promise<import("@kenoracric/contracts").MatchRecord[]>;
        get: (id: string) => Promise<import("@kenoracric/contracts").MatchRecord>;
        create: (input: import("@kenoracric/contracts").CreateMatchInput, token?: string) => Promise<import("@kenoracric/contracts").MatchRecord>;
    };
    scoring: {
        submit: (matchId: string, event: import("@kenoracric/contracts").ScoreSubmission, token?: string) => Promise<import("@kenoracric/contracts").MatchRecord>;
    };
};
export declare const socketUrl: any;
