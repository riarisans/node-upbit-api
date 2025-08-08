import { Http } from "../core/http.js";
import { signJWT } from "../core/auth.js";
import type { Order, PlaceOrderReq } from "../types.rest.js";

export class OrdersAPI {
    constructor(private http: Http, private keys?: { accessKey: string; secretKey: string }) {}

    private auth(query?: Record<string, any>) {
        if (!this.keys) throw new Error("accessKey/secretKey required");
        return { Authorization: `Bearer ${signJWT({ ...this.keys, query })}` };
    }

    placeOrder(req: PlaceOrderReq) {
        const headers = this.auth(req);
        return this.http.post("/v1/orders", req, { headers }) as Promise<Order>;
    }

    // 취소 후 신규 (SMP 타입 바꿔서 새주문 등) - 최신 스펙 참고
    cancelAndNew(req: PlaceOrderReq & { uuid: string; new_smp_type?: PlaceOrderReq["smp_type"] }) {
        const headers = this.auth(req);
        return this.http.post("/v1/orders/cancel_and_new", req, { headers }) as Promise<Order>;
    }

    getOrder(params: { uuid?: string; identifier?: string }) {
        const headers = this.auth(params);
        return this.http.get("/v1/order", { headers, query: params }) as Promise<Order>;
    }

    cancelOrder(params: { uuid?: string; identifier?: string }) {
        const headers = this.auth(params);
        return this.http.delete("/v1/order", { headers, query: params }) as Promise<Order>;
    }

    getOrders(params: {
        market?: string;
        state?: string;
        page?: number;
        limit?: number;
        order_by?: "asc" | "desc";
        uuids?: string[];
        identifiers?: string[];
    }) {
        const headers = this.auth(params);
        const q: Record<string, any> = { ...params };
        if (params.uuids) q.uuids = params.uuids;
        if (params.identifiers) q.identifiers = params.identifiers;
        return this.http.get("/v1/orders", { headers, query: q }) as Promise<Order[]>;
    }
}
