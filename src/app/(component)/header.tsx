"use client";

import {
    getAuth,
    onAuthStateChanged,
    User,
    signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, app } from "@/config/firebase-config";

export default function HeaderComponent() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [checking, setChecking] = useState(true);

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

    const handleLogout = async () => {
        try {
            const auth = getAuth(app);
            await signOut(auth);
            alert("로그아웃 완료");
            // 홈으로 이동 (선택)
            window.location.href = "/";
        } catch (err) {
            console.error(err);
            alert("로그아웃 실패");
        }
    };
    return (
        <div className="flex justify-between pb-5 w-full">
            <button
                onClick={() => {
                    router.push("/");
                }}
                className="text-xl font-semibold"
            >
                차단차단
            </button>
            <div className="flex gap-3">
                <button
                    onClick={() => {
                        router.push("/auth/register");
                    }}
                >
                    차량등록
                </button>
                {user && (
                    <button onClick={handleLogout}>
                        로그아웃
                    </button>
                )}
            </div>
        </div>
    );
}
