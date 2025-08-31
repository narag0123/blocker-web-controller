// src/api/api_register.ts
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
    let res: Response;
    try {
        res = await fetch("/api/whitelist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            cache: "no-store",
        });
    } catch (e: any) {
        return {
            ok: false,
            error: e?.message || "network_error",
        };
    }

    let data: any = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        return {
            ok: false,
            error:
                (data && (data.error || data.message)) ||
                `http_${res.status}`,
        };
    }
    return data as WhitelistCreateRes;
}
