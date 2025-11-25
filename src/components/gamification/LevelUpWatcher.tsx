"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { useMyGamification } from "@/hooks/use-my-gamification";
import { getLevelForPoints, LevelConfig } from "@/lib/levels";
import { LevelUpModal } from "@/components/gamification/levelUpModal";

export function LevelUpWatcher() {
  const { userId } = useAuth();
  const { totalPoints } = useMyGamification();

  const [open, setOpen] = useState(false);
  const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);

  const prevLevelRef = useRef<number | null>(null);
  const initializedRef = useRef(false);

  const { level } = getLevelForPoints(totalPoints);

  useEffect(() => {
    if (!userId) return;

    const currentLevel = level.level;

    if (!initializedRef.current) {
      initializedRef.current = true;
      prevLevelRef.current = currentLevel;
      return;
    }

    const prevLevel = prevLevelRef.current;

    if (prevLevel != null && currentLevel > prevLevel) {
      setLevelConfig(level);
      setOpen(true);
    }

    prevLevelRef.current = currentLevel;
  }, [userId, level]);

  if (!userId || !levelConfig) return null;

  return (
    <LevelUpModal
      level={levelConfig}
      open={open}
      onClose={(o) => {
        setOpen(o);
        if (!o) setLevelConfig(null);
      }}
    />
  );
}
