import { Http } from "../core/http.js";
import { PublicAPI } from "./public.js";
import { AccountsAPI } from "./accounts.js";
import { OrdersAPI } from "./orders.js";
import { DepositsAPI } from "./deposits.js";
import { WithdrawalsAPI } from "./withdrawals.js";

export class RestClient {
    public readonly public: PublicAPI;
    public readonly accounts: AccountsAPI;
    public readonly orders: OrdersAPI;
    public readonly deposits: DepositsAPI;
    public readonly withdrawals: WithdrawalsAPI;

    constructor(opt: {
        baseURL?: string;
        retries?: number;
        timeoutMs?: number;
        keys?: { accessKey: string; secretKey: string };
    }) {
        const http = new Http({
            baseURL: opt.baseURL ?? "https://api.upbit.com",
            retries: opt.retries,
            timeoutMs: opt.timeoutMs,
        });
        this.public = new PublicAPI(http);
        this.accounts = new AccountsAPI(http, opt.keys);
        this.orders = new OrdersAPI(http, opt.keys);
        this.deposits = new DepositsAPI(http, opt.keys);
        this.withdrawals = new WithdrawalsAPI(http, opt.keys);
    }
}
