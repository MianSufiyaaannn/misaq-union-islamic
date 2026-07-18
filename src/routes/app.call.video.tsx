import { createFileRoute, useRouter } from "@tanstack/react-router";
import { people, meMember } from "@/lib/mock";
import { Avatar, PhotoBg } from "@/components/misaq/bits";
import { MicOff, VideoOff, PhoneOff, SwitchCamera, ShieldCheck } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/app/call/video")({ component: VideoCall });

function VideoCall() {
  const router = useRouter();
  const t = useT();
  const p = people[0];
  return (
    <PhotoBg person={p} className="relative flex min-h-full flex-col text-white">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative flex flex-1 flex-col p-5 pt-14">
        <div className="flex items-center gap-2 self-start rounded-full bg-black/40 px-3 py-1.5 text-[11px]">
          <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--color-gold)]" /> {t("chats.online")}
        </div>

        <div
          className="absolute end-5 top-16 h-40 w-28 overflow-hidden rounded-2xl border border-white/30 shadow-luxury"
          style={{ background: meMember.avatar }}
        >
          <div className="flex h-full items-center justify-center">
            <Avatar person={meMember} size={54} />
          </div>
        </div>

        <div className="mt-auto text-center">
          <h1 className="font-display text-3xl">{p.name}</h1>
          <p className="mt-1 text-sm text-white/80">04:38 · HD</p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-3">
          {[
            { i: MicOff, l: t("call.mute") },
            { i: VideoOff, l: t("call.video") },
            { i: SwitchCamera, l: t("call.flip") },
          ].map((b) => (
            <button key={b.l} className="flex flex-col items-center gap-2">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                <b.i className="h-5 w-5" />
              </span>
              <span className="text-[10px]">{b.l}</span>
            </button>
          ))}
          <button
            onClick={() => router.history.back()}
            className="flex flex-col items-center gap-2"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive shadow-luxury">
              <PhoneOff className="h-5 w-5" />
            </span>
            <span className="text-[10px]">{t("call.end")}</span>
          </button>
        </div>
      </div>
    </PhotoBg>
  );
}
