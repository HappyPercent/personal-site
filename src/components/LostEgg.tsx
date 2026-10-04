"use client";

import { useEffect } from "react";
import { useEggs } from "@/components/Eggs";

export function LostEgg() {
  const { find } = useEggs();
  useEffect(() => {
    find("lost");
  }, [find]);
  return null;
}
