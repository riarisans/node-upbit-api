import { WSBase, authHeader } from "./client.js";

// 개인 체결/주문 체결 등 (문서의 private 채널 명세에 맞춰 확장)
export async function subscribePrivate(keys: { accessKey: string; secretKey: string }, topics: Array<any>) {
    const ws = new WSBase();
    await ws.connect(authHeader(keys));
    ws.send({ ticket: "any" });
    for (const t of topics) ws.send(t);
    ws.send({ format: "DEFAULT" });
    return ws;
}
