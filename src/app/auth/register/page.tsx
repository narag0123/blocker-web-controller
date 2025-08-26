"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase-config";
import { onAuthStateChanged, User } from "firebase/auth";
import { createWhitelist } from "@/api/api_register";

const KOREAN_PLATE_RE = /^\d{2,3}[가-힣]\d{4}$/; // 예: 12가3456

export default function RegisterPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [checking, setChecking] = useState(true);

    const [plate, setPlate] = useState("");
    const [owner, setOwner] = useState("");
    const [msg, setMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // ✅ 가드: 로그인 안 되어 있으면 /auth로 보냄
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (!u) {
                router.replace("/auth/login");
            } else {
                setUser(u);
            }
            setChecking(false);
        });
        return () => unsub();
    }, [router]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const p = plate.trim();
        const o = owner.trim();

        if (!KOREAN_PLATE_RE.test(p)) {
            alert(
                "차량번호 형식이 올바르지 않습니다. 예: 12가3456"
            );
            return;
        }

        setLoading(true);
        setMsg(null); // (선택) 기존 메시지 UI 안 쓸 거면 제거해도 됨
        try {
            const res = await createWhitelist({
                plate: p,
                owner: o || undefined,
            });

            if (res.ok) {
                alert(`등록 완료: ${res.plate ?? p}`);
                // 홈으로 이동
                router.replace("/");
                return; // 아래 finally로 내려가지 않고 종료
            } else {
                alert(
                    `등록 실패: ${res.error ?? "unknown"}`
                );
                // 현재 페이지 새로고침 (App Router)
                router.refresh(); // 또는: window.location.reload();
                return;
            }
        } catch (err: any) {
            alert(
                `요청 실패: ${err?.message ?? "unknown"}`
            );
            router.refresh(); // 또는: window.location.reload();
            return;
        } finally {
            setLoading(false);
        }
    };

    if (checking)
        return <div className="p-6">확인 중...</div>;
    if (!user) return null; // 리다이렉트 중

    return (
        <div className=" w-full space-y-4">
            <h1 className="text-xl font-semibold">
                차량 등록
            </h1>
            <div className="text-sm text-gray-600">
                로그인 사용자:{" "}
                {user.displayName ?? user.email ?? user.uid}
            </div>

            <form onSubmit={submit} className="space-y-3">
                <div>
                    <label className="block text-sm mb-1">
                        차량번호(띄어쓰기X)
                    </label>
                    <input
                        className="border rounded px-3 py-2 w-full text-black"
                        value={plate}
                        onChange={(e) =>
                            setPlate(e.target.value)
                        }
                        placeholder="예: 12가3456"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">
                        소유자(선택)
                    </label>
                    <input
                        className="border rounded px-3 py-2 w-full text-black"
                        value={owner}
                        onChange={(e) =>
                            setOwner(e.target.value)
                        }
                        placeholder="예: 홍길동"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? "등록 중..." : "등록"}
                </button>
                {msg && (
                    <p className="text-sm mt-2">{msg}</p>
                )}
            </form>
        </div>
    );
}
