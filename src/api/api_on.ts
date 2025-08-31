export type GateCmdResponse = {
    ok: boolean;
    warn?: string;
    error?: string;
};

export async function sendOpen(): Promise<GateCmdResponse> {
    const res = await fetch("/api/gate/cmd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ON" }),
        cache: "no-store",
    }).catch(
        (e) =>
            ({
                ok: false,
                status: 0,
                json: async () => ({
                    error: e?.message || "network_error",
                }),
            } as any)
    );

    let data: any = null;
    try {
        data = await (res as any).json?.();
    } catch {}

    if (!res || !("ok" in res) || !res.ok) {
        return {
            ok: false,
            error:
                (data && (data.error || data.message)) ||
                `http_${(res as any)?.status || 0}`,
        };
    }
    return {
        ok: !!data?.ok,
        warn: data?.warn,
        error: data?.error,
    };
}
