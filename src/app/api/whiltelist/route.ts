// app/api/whitelist/route.ts
export const dynamic = "force-dynamic"; // 캐시 방지(선택)

export async function POST(req: Request) {
    // 클라이언트에서 받은 JSON
    const body = await req.json().catch(() => null);

    // 간단한 유효성 체크 (선택)
    if (
        !body ||
        typeof body.plate !== "string" ||
        !body.plate.trim()
    ) {
        return new Response(
            JSON.stringify({
                ok: false,
                error: "plate_required",
            }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    // 서버 환경변수 (노출 X)
    const base = process.env.BACKEND_BASE?.replace(
        /\/+$/,
        ""
    );
    if (!base) {
        return new Response(
            JSON.stringify({
                ok: false,
                error: "BACKEND_BASE not set",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    // Spring 으로 프록시
    const r = await fetch(`${base}/whitelist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(process.env.PROXY_SECRET
                ? {
                      "X-Proxy-Secret":
                          process.env.PROXY_SECRET,
                  }
                : {}),
        },
        body: JSON.stringify(body),
        // @ts-ignore
        next: { revalidate: 0 },
    });

    const text = await r.text();
    return new Response(text, {
        status: r.status,
        headers: {
            "Content-Type":
                r.headers.get("Content-Type") ??
                "application/json",
        },
    });
}
