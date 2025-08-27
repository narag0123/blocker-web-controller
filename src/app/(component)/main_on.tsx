"use client";

import {
    motion,
    MotionConfig,
    useAnimationControls,
    Variants,
} from "framer-motion";
import { useRef, useState } from "react";
import { sendOpen } from "@/api/api_on";

export default function MainOn() {
    const controls = useAnimationControls();
    const busy = useRef(false);
    const [angle, setAngle] = useState(0); // 회전 각도 상태
    const [loading, setLoading] = useState(false);

    const buttonVariants: Variants = {
        rest: {
            boxShadow: "0px 4px 20px rgba(255,255,255,0.8)",
        },
        tap: {
            boxShadow: "0px 0px 60px rgba(255,255,255,0.8)",
        },
    };

    const textVariants: Variants = {
        rest: { scale: 1 },
        tap: { scale: 1.2 },
    };

    const handleClick = async () => {
        if (busy.current || loading) return;
        busy.current = true;
        setLoading(true);

        // 1) UI 애니메이션
        setAngle((prev) => prev + 360);
        try {
            await controls.start("tap");
            await controls.start("rest");
        } catch {
            // no-op
        }

        // 2) 서버에 OPEN 신호 전송
        try {
            const res = await sendOpen();
            if (res.ok) {
                const warnText = res.warn
                    ? `\n(주의: ${res.warn})`
                    : "";
            } else {
                alert(
                    `게이트 OPEN 실패: ${
                        res.error || "unknown"
                    }`
                );
            }
        } catch (e: any) {
            alert(`요청 오류: ${e?.message || "unknown"}`);
        } finally {
            setLoading(false);
            busy.current = false;
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-16">
            <MotionConfig
                transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                }}
            >
                <motion.div
                    className="relative w-full aspect-square"
                    initial="rest"
                    animate={controls}
                    onClick={handleClick}
                >
                    <motion.button
                        variants={buttonVariants}
                        // ✅ 회전은 state 기반으로 animate
                        animate={{ rotate: angle }}
                        transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.9, 1],
                        }}
                        className="
                        w-full h-full rounded-full
                        border border-white flex items-center justify-center
                        bg-gradient-to-b from-black to-[#1e1e1e]
                        text-xl font-bold
                        "
                    />

                    <motion.p
                        variants={textVariants}
                        className="
                        pointer-events-none
                        absolute inset-0 flex items-center justify-center
                        text-white font-bold
                        "
                    >
                        OPEN
                    </motion.p>
                </motion.div>
            </MotionConfig>
        </div>
    );
}
