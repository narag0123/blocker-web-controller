"use client";

import {
    motion,
    MotionConfig,
    useAnimationControls,
    Variants,
} from "framer-motion";
import { useCallback } from "react";

export default function MainOn() {
    const buttonVariants: Variants = {
        rest: {
            rotate: 0,
            boxShadow: "0px 4px 20px rgba(255,255,255,0.8)",
        },
        tap: {
            rotate: 360,
            boxShadow: "0px 0px 60px rgba(255,255,255,0.8)",
        },
    };

    const textVariants: Variants = {
        rest: { scale: 1 },
        tap: { scale: 1.2 }, // 텍스트도 회전/스케일 동기화
    };
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-10">
            <MotionConfig
                transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                }}
            >
                {/* 부모가 relative여야 p를 절대 중앙 배치 가능 */}
                <motion.div
                    className="relative w-full aspect-square"
                    initial="rest"
                    animate="rest"
                    whileTap="tap"
                >
                    <motion.button
                        variants={buttonVariants}
                        className="
                            w-full h-full rounded-full
                            border border-white flex items-center justify-center
                            bg-gradient-to-bl from-black to-slate-900
                            text-xl font-bold
                        "
                        onClick={() =>
                            console.log("clicked!")
                        }
                    />

                    {/* 버튼 위에 겹치는 텍스트 */}
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
