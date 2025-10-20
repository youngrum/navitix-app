"use client";

import React, { useEffect, useState } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { usePathname, useRouter } from "next/navigation";
import theme from "@/styles/theme";
import { Grow } from "@mui/material";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [inProp, setInProp] = useState(false);

  useEffect(() => {
    setInProp(true);
  }, []);

  // パスから BottomNavigation の value を決定するヘルパー
  const getValueFromPath = (p: string | null | undefined) => {
    if (!p || p === "/") return "home";
    // 必要に応じて startsWith で判定（/movies, /movie/123 などに対応）
    if (p.startsWith("/theater")) return "theater";
    if (p.startsWith("/movies") || p.startsWith("/movie")) return "movies";
    if (p.startsWith("/tickets")) return "tickets";
    if (p.startsWith("/profile") || p.startsWith("/account")) return "account";
    return ""; // 該当なし
  };

  const mapValueToPath = (v: string) => {
    switch (v) {
      case "home":
        return "/";
      case "theater":
        return "/theater";
      case "tickets":
        return "/tickets";
      case "account":
        return "/profile";
      default:
        return "/";
    }
  };

  const value = getValueFromPath(pathname);

  return (
    <Grow in={inProp}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          const path = mapValueToPath(String(newValue));
          // 同じパスの場合は何もしない（余計な遷移抑制）
          if (path !== pathname) {
            router.push(path);
          }
        }}
        sx={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          zIndex: 100,
          boxShadow: 8,
        }}
      >
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<HomeIcon />}
          sx={{ "&.Mui-selected": { color: theme.palette.secondary.main } }}
        />

        <BottomNavigationAction
          label="Theater"
          value="theater"
          icon={<SearchIcon />}
          sx={{ "&.Mui-selected": { color: theme.palette.secondary.main } }}
        />

        <BottomNavigationAction
          label="tickets"
          value="tickets"
          icon={<ConfirmationNumberIcon />}
          sx={{ "&.Mui-selected": { color: theme.palette.secondary.main } }}
        />

        <BottomNavigationAction
          label="Account"
          value="account"
          icon={<AccountCircleIcon />}
          sx={{ "&.Mui-selected": { color: theme.palette.secondary.main } }}
        />
      </BottomNavigation>
    </Grow>
  );
}
