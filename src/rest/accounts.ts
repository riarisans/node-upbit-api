import { Http } from "../core/http.js";
import { signJWT } from "../core/auth.js";
import type { Balance } from "../types.rest.js";

export class AccountsAPI {
    constructor(private http: Http, private keys?: { accessKey: string; secretKey: string }) {}

    private authHeaders(query?: Record<string, any>) {
        if (!this.keys) throw new Error("accessKey/secretKey required");
        const token = signJWT({ accessKey: this.keys.accessKey, secretKey: this.keys.secretKey, query });
        return { Authorization: `Bearer ${token}` };
    }

    getBalances() {
        const headers = this.authHeaders();
        return this.http.get("/v1/accounts", { headers }) as Promise<Balance[]>;
    }
}
