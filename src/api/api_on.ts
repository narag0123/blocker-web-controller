// src/api/api_on.ts
export type GateCmdResponse = {
    ok: boolean;
    warn?: string;
    error?: string;
};

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") ||
    "http://localhost:8080";

/**
 * 게이트 OPEN 요청 (모바일용: action만 전송)
 * 서버: POST /gate/cmd  { action: "ON" }
 */
export async function sendOpen(): Promise<GateCmdResponse> {
    const url = `${API_BASE}/gate/cmd`;

    let res: Response;
    try {
        res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // NOTE: 서버에서 쿠키·세션을 쓰지 않으니 credentials 생략
            body: JSON.stringify({ action: "ON" }),
            cache: "no-store",
        });
    } catch (e: any) {
        // 네트워크 오류
        return {
            ok: false,
            error: e?.message || "network_error",
        };
    }

    // 응답 본문 파싱
    let data: any = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    // 2xx 이외 상태 처리
    if (!res.ok) {
        return {
            ok: false,
            error:
                (data && (data.error || data.message)) ||
                `http_${res.status}`,
        };
    }

    // 서버가 {ok:true, warn?:string} 형태로 응답한다는 가정
    return {
        ok: !!data?.ok,
        warn: data?.warn,
        error: data?.error,
    };
}
