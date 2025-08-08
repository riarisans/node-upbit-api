import { createHmac, createHash, randomUUID } from "node:crypto";

function b64url(s: Buffer | string) {
    return Buffer.from(s).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function signJWT({
    accessKey,
    secretKey,
    query,
}: {
    accessKey: string;
    secretKey: string;
    query?: Record<string, any>;
}) {
    const header = { alg: "HS256", typ: "JWT" };
    const payload: Record<string, any> = { access_key: accessKey, nonce: randomUUID() };

    if (query && Object.keys(query).length) {
        // 키 오름차순 → URLSearchParams → SHA512(hex)
        const qs = new URLSearchParams();
        Object.keys(query)
            .sort()
            .forEach((k) => {
                const v = query[k];
                if (v !== undefined && v !== null) qs.append(k, String(v));
            });
        const query_hash = createHash("sha512").update(qs.toString(), "utf8").digest("hex");
        payload.query_hash = query_hash;
        payload.query_hash_alg = "SHA512";
    }

    const token = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
    const sig = createHmac("sha256", secretKey).update(token).digest("base64url");
    return `${token}.${sig}`;
}
