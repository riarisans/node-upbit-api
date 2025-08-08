import WebSocket from "ws"; // Node 20은 global WebSocket도 OK(환경에 맞게)
import { signJWT } from "../core/auth.js";

export class WSBase {
    private ws?: WebSocket;
    private pingTimer?: NodeJS.Timeout;

    constructor(private url = "wss://api.upbit.com/websocket/v1") {}

    connect(headers?: Record<string, string>) {
        return new Promise<void>((resolve, reject) => {
            this.ws = new WebSocket(this.url, { headers });
            this.ws.on("open", () => {
                // 서버 ping/pong 지원, 필요시 애플리케이션 레벨 ping도 가능
                resolve();
            });
            this.ws.on("error", reject);
        });
    }

    send(obj: any) {
        this.ws?.send(Array.isArray(obj) ? JSON.stringify(obj) : JSON.stringify([obj]));
    }
    onMessage(fn: (msg: any) => void) {
        this.ws?.on("message", (data) => {
            try {
                fn(JSON.parse(data.toString()));
            } catch {
                /* noop */
            }
        });
    }
    close() {
        this.ws?.close();
    }
}

export function authHeader(keys: { accessKey: string; secretKey: string }) {
    const token = signJWT({ accessKey: keys.accessKey, secretKey: keys.secretKey });
    return { Authorization: `Bearer ${token}` };
}
