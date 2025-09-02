import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: ["/auth/register"], // 이 경로만 잠금
};

export function middleware(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const realm = 'Basic realm="Secure Area"';

    // 인증정보 없으면 팝업 띄우게 401과 WWW-Authenticate 반환
    if (!authHeader?.startsWith("Basic ")) {
        return new NextResponse("Auth required", {
            status: 401,
            headers: { "WWW-Authenticate": realm },
        });
    }

    // "Basic base64(user:pass)" 파싱
    const base64 = authHeader.replace("Basic ", "");
    let decoded = "";
    try {
        decoded = atob(base64); // Web API (Edge 런타임에서도 사용 가능)
    } catch {
        return new NextResponse("Invalid auth header", {
            status: 400,
        });
    }

    const [user, pass] = decoded.split(":");
    const ok =
        user === process.env.BASIC_AUTH_USER &&
        pass === process.env.BASIC_AUTH_PASS;

    if (!ok) {
        // 틀리면 다시 팝업
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: { "WWW-Authenticate": realm },
        });
    }

    // 통과
    return NextResponse.next();
}
