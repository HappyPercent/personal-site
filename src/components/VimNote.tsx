"use client";

import { useState } from "react";
import { useEggs } from "@/components/Eggs";
import { joke } from "@/content/jokes";
import styles from "./VimNote.module.css";

export function VimNote() {
  const { find } = useEggs();
  const [clicks, setClicks] = useState(0);
  return (
    <button
      type="button"
      className={`mono ${styles.note}`}
      onClick={() => {
        const n = clicks + 1;
        setClicks(n);
        if (n >= 2) find("vim");
      }}
    >
      {`// ${joke("vim")}`}
    </button>
  );
}
