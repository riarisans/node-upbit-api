import { WSBase } from "./client.js";

// type: "ticker" | "trade" | "orderbook"
// markets: ["KRW-BTC", ...]
// format: "SIMPLE" | "DEFAULT"
export async function subscribePublic({
    type,
    markets,
    format = "DEFAULT",
}: {
    type: "ticker" | "trade" | "orderbook";
    markets: string[];
    format?: "SIMPLE" | "DEFAULT";
}) {
    const ws = new WSBase();
    await ws.connect();
    ws.send({ ticket: "any" });
    ws.send({ type, codes: markets });
    ws.send({ format }); // 문서 포맷 규격 준수
    return ws;
}
