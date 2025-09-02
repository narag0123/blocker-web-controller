"use client";

import { auth } from "@/config/firebase-config";
import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
} from "firebase/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const router = useRouter();

    useEffect(() => {
        // 이미 로그인 상태면 자동 이동
        const unsub = onAuthStateChanged(auth, (u) => {
            if (u) router.replace("/");
        });
        return () => unsub();
    }, [router]);

    const signIn = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        // router.replace("/auth/register"); // 로그인 직후 이동
        router.replace("/");
    };

    return (
        <div className="w-full p-6 flex flex-col justify-center gap-10">
            <h1 className="text-xl font-semibold w-full text-center">
                로그인
            </h1>
            <div className="flex justify-center p-5 border-white border-[1px] rounded-md">
                <button
                    className="bg-black text-white rounded"
                    onClick={signIn}
                >
                    Google로 로그인
                </button>
            </div>
        </div>
    );
}
