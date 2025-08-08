import { RestClient } from "./rest/index.js";
import { subscribePublic } from "./ws/public.js";
import { subscribePrivate } from "./ws/private.js";
export * from "./types.rest.js";

export class UpbitClient {
    public rest: RestClient;

    constructor(opt?: {
        baseURL?: string;
        retries?: number;
        timeoutMs?: number;
        keys?: { accessKey: string; secretKey: string };
    }) {
        this.rest = new RestClient(opt ?? {});
    }

    ws = {
        subscribePublic,
        subscribePrivate,
    };
}
