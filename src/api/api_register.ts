export const API_BASE = process.env.NEXT_PUBLIC_API_BASE!; // 예: http://192.168.0.10:8080

export type WhitelistCreateReq = {
    plate: string;
    owner?: string;
};
export type WhitelistCreateRes = {
    ok: boolean;
    id?: number;
    plate?: string;
    error?: string;
};

export async function createWhitelist(
    body: WhitelistCreateReq
): Promise<WhitelistCreateRes> {
    const url = `${API_BASE}/whitelist`;
    const res = await fetch(`${API_BASE}/whitelist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok)
        throw new Error(
            data?.error || `HTTP ${res.status}`
        );
    return data as WhitelistCreateRes;
}
