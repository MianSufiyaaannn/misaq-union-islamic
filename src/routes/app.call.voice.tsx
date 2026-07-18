import { createFileRoute, useRouter } from "@tanstack/react-router";
import { people } from "@/lib/mock";
import { Avatar } from "@/components/misaq/bits";
import { MicOff, Volume2, PhoneOff, Video } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/app/call/voice")({ component: VoiceCall });

function VoiceCall() {
  const router = useRouter();
  const t = useT();
  const p = people[0];
  return (
    <div className="flex min-h-full flex-col bg-gradient-royal text-white">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
          {t("call.voice")} · {t("chats.online")}
        </p>
        <div className="relative">
          <span className="absolute inset-0 rounded-full animate-pulse-ring" />
          <Avatar person={p} size={160} />
        </div>
        <div>
          <h1 className="font-display text-3xl">{p.name}</h1>
          <p className="mt-1 text-sm text-white/70">{t("call.connecting")} · 02:14</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 px-6 pb-12">
        <CallBtn icon={<MicOff className="h-5 w-5" />} label={t("call.mute")} />
        <CallBtn icon={<Volume2 className="h-5 w-5" />} label={t("call.speaker")} active />
        <CallBtn icon={<Video className="h-5 w-5" />} label={t("call.video")} />
        <button onClick={() => router.history.back()} className="flex flex-col items-center gap-2">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-luxury">
            <PhoneOff className="h-5 w-5" />
          </span>
          <span className="text-[10px]">{t("call.end")}</span>
        </button>
      </div>
    </div>
  );
}
function CallBtn({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button className="flex flex-col items-center gap-2">
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-full ${active ? "bg-white text-primary" : "bg-white/10 text-white"}`}
      >
        {icon}
      </span>
      <span className="text-[10px]">{label}</span>
    </button>
  );
}
