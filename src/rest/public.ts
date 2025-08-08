import { Http } from "../core/http.js";
import type {
    Market,
    Ticker,
    Orderbook,
    CandleMinute,
    CandleDay,
    CandleWeek,
    CandleMonth,
    Trade,
} from "../types.rest.js";

export class PublicAPI {
    constructor(private http: Http) {}

    getMarkets(isDetails = false) {
        return this.http.get("/v1/market/all", { query: { isDetails } }) as Promise<Market[]>;
    }
    getTicker(markets: string | string[]) {
        const m = Array.isArray(markets) ? markets.join(",") : markets;
        return this.http.get("/v1/ticker", { query: { markets: m } }) as Promise<Ticker[]>;
    }
    getOrderbook(markets: string | string[]) {
        const m = Array.isArray(markets) ? markets.join(",") : markets;
        return this.http.get("/v1/orderbook", { query: { markets: m } }) as Promise<Orderbook[]>;
    }
    getTrades(market: string, count = 30, to?: string) {
        return this.http.get("/v1/trades/ticks", { query: { market, count, to } }) as Promise<Trade[]>;
    }

    getCandlesMinute(unit: 1 | 3 | 5 | 10 | 15 | 30 | 60 | 240, market: string, count = 200, to?: string) {
        return this.http.get(`/v1/candles/minutes/${unit}`, { query: { market, count, to } }) as Promise<
            CandleMinute[]
        >;
    }
    getCandlesDay(market: string, count = 200, to?: string) {
        return this.http.get("/v1/candles/days", { query: { market, count, to } }) as Promise<CandleDay[]>;
    }
    getCandlesWeek(market: string, count = 200, to?: string) {
        return this.http.get("/v1/candles/weeks", { query: { market, count, to } }) as Promise<CandleWeek[]>;
    }
    getCandlesMonth(market: string, count = 200, to?: string) {
        return this.http.get("/v1/candles/months", { query: { market, count, to } }) as Promise<CandleMonth[]>;
    }
}
