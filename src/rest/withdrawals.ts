import { Http } from "../core/http.js";
import { signJWT } from "../core/auth.js";
import type { Withdrawal } from "../types.rest.js";

export class WithdrawalsAPI {
    constructor(private http: Http, private keys?: { accessKey: string; secretKey: string }) {}
    private auth(query?: Record<string, any>) {
        if (!this.keys) throw new Error("accessKey/secretKey required");
        return { Authorization: `Bearer ${signJWT({ ...this.keys, query })}` };
    }

    withdrawCoin(params: { currency: string; amount: string; address: string; secondary_address?: string }) {
        const headers = this.auth(params);
        return this.http.post("/v1/withdraws/coin", params, { headers }) as Promise<Withdrawal>;
    }

    withdrawKrw(params: { amount: string }) {
        const headers = this.auth(params);
        return this.http.post("/v1/withdraws/krw", params, { headers }) as Promise<Withdrawal>;
    }

    getWithdrawList(params?: { currency?: string; state?: string; page?: number; limit?: number }) {
        const headers = this.auth(params);
        return this.http.get("/v1/withdraws", { headers, query: params }) as Promise<Withdrawal[]>;
    }

    getWithdraw(params: { uuid?: string; txid?: string; currency?: string }) {
        const headers = this.auth(params);
        return this.http.get("/v1/withdraw", { headers, query: params }) as Promise<Withdrawal>;
    }
}
