// app/api/gate/cmd/route.ts
export const dynamic = "force-dynamic"; // 캐시 방지(선택)

export async function POST(req: Request) {
    const body = await req.json();

    // ✅ 서버 사이드 환경변수만 사용 (노출 방지)
    const base = process.env.BACKEND_BASE?.replace(
        /\/+$/,
        ""
    );
    if (!base) throw new Error("BACKEND_BASE not set");

    const r = await fetch(`${base}/gate/cmd`, {
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
        // (선택) Next.js 캐시 완전 비활성
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
