import type { Metadata } from "next";
import { Wall } from "@/components/Wall";
import { countNotes, listNotes } from "@/lib/wall-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The wall · Andrey Erofteev",
  description: "A live sticky-note wall. Leave a note, it appears in every open tab.",
};

export default function WallPage() {
  return <Wall initialNotes={listNotes()} initialTotal={countNotes()} />;
}
