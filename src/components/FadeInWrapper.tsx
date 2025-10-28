"use client";
import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";

const FadeInWrapper = ({
  children,
  duration = 500,
  delay = 0,
}: {
  children: React.ReactNode;
  duration: number;
  delay: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const initialY = 20;

  useEffect(() => {
    // コンポーネントがマウントされた後、指定された遅延時間後に表示状態をtrueにする
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    // クリーンアップ関数: コンポーネントがアンマウントされる際にタイマーをクリア
    return () => clearTimeout(timer);
  }, [delay]); // delayが変更された場合に再実行

  return (
    <Box
      style={{
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : initialY}px)`,
      }}
    >
      {children}
    </Box>
  );
};

export default FadeInWrapper;
