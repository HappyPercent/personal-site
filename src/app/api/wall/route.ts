import { addNote, countNotes, listNotes } from "@/lib/wall-store";
import { checkNote, NOTE_COOLDOWN_MS } from "@/lib/wall-rules";

export const dynamic = "force-dynamic";

const lastPost = new Map<string, number>();

function clientId(req: Request): string {
  return req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
}

export async function GET() {
  return Response.json({ notes: listNotes(), total: countNotes() });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { text?: unknown } | null;
  const check = checkNote(body?.text);
  if (!check.ok) return Response.json({ error: check.error }, { status: 400 });

  const id = clientId(req);
  const now = Date.now();
  const wait = (lastPost.get(id) ?? 0) + NOTE_COOLDOWN_MS - now;
  if (wait > 0) {
    return Response.json(
      { error: `One note at a time. Try again in ${Math.ceil(wait / 1000)}s.` },
      { status: 429, headers: { "Retry-After": String(Math.ceil(wait / 1000)) } },
    );
  }
  lastPost.set(id, now);
  if (lastPost.size > 5000) for (const [k, t] of lastPost) if (now - t > NOTE_COOLDOWN_MS) lastPost.delete(k);

  return Response.json({ note: addNote(check.text), total: countNotes() }, { status: 201 });
}
