import { Http } from "../core/http.js";
import { signJWT } from "../core/auth.js";
import type { Deposit, WalletAddress } from "../types.rest.js";

export class DepositsAPI {
    constructor(private http: Http, private keys?: { accessKey: string; secretKey: string }) {}
    private auth(query?: Record<string, any>) {
        if (!this.keys) throw new Error("accessKey/secretKey required");
        return { Authorization: `Bearer ${signJWT({ ...this.keys, query })}` };
    }

    getDepositList(params?: { currency?: string; page?: number; limit?: number; state?: string }) {
        const headers = this.auth(params);
        return this.http.get("/v1/deposits", { headers, query: params }) as Promise<Deposit[]>;
    }

    getDeposit(params: { uuid?: string; txid?: string; currency?: string }) {
        const headers = this.auth(params);
        return this.http.get("/v1/deposit", { headers, query: params }) as Promise<Deposit>;
    }

    getDepositAddresses() {
        const headers = this.auth();
        return this.http.get("/v1/deposits/coin_addresses", { headers }) as Promise<WalletAddress[]>;
    }

    getDepositAddress(params: { currency: string }) {
        const headers = this.auth(params);
        return this.http.get("/v1/deposits/coin_address", { headers, query: params }) as Promise<WalletAddress>;
    }

    // 주소 발급 요청(비동기 이슈 주의)
    createDepositAddress(params: { currency: string }) {
        const headers = this.auth(params);
        return this.http.post("/v1/deposits/generate_coin_address", params, { headers }) as Promise<WalletAddress>;
    }
}
