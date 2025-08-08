export type HttpOptions = {
    baseURL: string;
    retries?: number;
    timeoutMs?: number;
    baseHeaders?: Record<string, string>;
};

export class Http {
    constructor(private opt: HttpOptions) {}

    private async call(path: string, init: RequestInit & { query?: Record<string, any> } = {}) {
        const url = new URL(path, this.opt.baseURL);
        if (init.query) {
            for (const [k, v] of Object.entries(init.query)) {
                if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
            }
        }
        const retries = this.opt.retries ?? 2;
        const timeoutMs = this.opt.timeoutMs ?? 10000;

        let lastErr: any;
        for (let attempt = 0; attempt <= retries; attempt++) {
            const ac = new AbortController();
            const to = setTimeout(() => ac.abort(), timeoutMs);
            try {
                const res = await fetch(url, {
                    ...init,
                    headers: { ...(this.opt.baseHeaders || {}), ...(init.headers || {}) },
                    signal: ac.signal,
                });
                clearTimeout(to);

                if (res.ok) {
                    const ct = res.headers.get("content-type") || "";
                    return ct.includes("application/json") ? res.json() : res.text();
                }
                if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
                    // 간단 백오프
                    await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
                    continue;
                }
                const body = await res.text().catch(() => "");
                throw new Error(`HTTP ${res.status} ${res.statusText} - ${body}`);
            } catch (e) {
                clearTimeout(to);
                lastErr = e;
                if (attempt === retries) break;
                await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
            }
        }
        throw lastErr;
    }

    get(path: string, init?: { headers?: Record<string, string>; query?: Record<string, any> }) {
        return this.call(path, { method: "GET", ...init });
    }
    post(path: string, body?: any, init?: { headers?: Record<string, string> }) {
        return this.call(path, {
            method: "POST",
            headers: { "content-type": "application/json", ...(init?.headers || {}) },
            body: body ? JSON.stringify(body) : undefined,
        });
    }
    delete(path: string, init?: { headers?: Record<string, string>; query?: Record<string, any> }) {
        return this.call(path, { method: "DELETE", ...init });
    }
}
