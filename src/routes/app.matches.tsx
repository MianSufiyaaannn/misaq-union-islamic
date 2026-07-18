import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  useProposals,
  useChats,
  usePeople,
  useMe,
  type Person,
  type ChatThread,
  getMatchId,
} from "@/lib/mock";
import { Avatar, CompatibilityRing, VerifiedBadge } from "@/components/misaq/bits";
import { cn } from "@/lib/utils";
import { useT } from "@/components/misaq/providers";
import { Inbox, Search, X, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/matches")({ component: Matches });

type TabKey = "received" | "sent" | "accepted" | "saved";

function Matches() {
  const t = useT();
  const [me] = useMe();
  const [tab, setTab] = useState<TabKey>("received");
  const [proposals, updateProposals] = useProposals();
  const [chats, updateChats] = useChats();
  const [peopleList] = usePeople();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const b = localStorage.getItem("misaq_bookmarks");
      return b ? JSON.parse(b) : [];
    }
    return [];
  });

  const savedPeople = useMemo(() => {
    return peopleList.filter((p) => bookmarks.includes(p.id));
  }, [peopleList, bookmarks]);

  const list =
    tab === "received"
      ? proposals.received
      : tab === "sent"
        ? proposals.sent
        : tab === "accepted"
          ? proposals.accepted
          : savedPeople;

  const filteredList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return list;
    return list.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(query);
      const cityMatch = p.city.toLowerCase().includes(query);
      const profMatch = p.profession.toLowerCase().includes(query);
      const usernameMatch =
        p.id.toLowerCase().includes(query) ||
        p.name.toLowerCase().replace(/\s+/g, "").includes(query);
      return nameMatch || cityMatch || profMatch || usernameMatch;
    });
  }, [list, searchQuery]);

  if (me.verificationStatus !== "Verified") {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-background px-8 text-center py-16 space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldAlert className="h-8 w-8 animate-pulse" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="font-display text-xl font-bold text-foreground">Verification Required</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {me.verificationStatus === "Rejected"
              ? `Your profile verification was rejected. Reason: ${me.rejectionReason || "Blurry documents"}. Please go to Profile > Update Documents to resubmit.`
              : "Your profile is currently under verification. Proposals and matching features will be unlocked as soon as your account is approved."}
          </p>
        </div>
        {me.verificationStatus === "Rejected" && (
          <Link
            to="/app/profile"
            className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-soft"
          >
            Go to Profile
          </Link>
        )}
      </div>
    );
  }

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "received", label: t("matches.received") },
    { key: "sent", label: t("matches.sent") },
    { key: "accepted", label: t("matches.accepted") },
    { key: "saved", label: "Saved Profiles" },
  ];

  const handleAccept = (person: Person) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
      loading: "Accepting proposal...",
      success: () => {
        // Remove from received, add to accepted
        const nextReceived = proposals.received.filter((x) => x.id !== person.id);
        const nextAccepted = [...proposals.accepted, person];

        updateProposals({
          ...proposals,
          received: nextReceived,
          accepted: nextAccepted,
        });

        // Check if chat thread already exists. If not, create one!
        const exists = chats.some((c) => c.personId === person.id);
        if (!exists) {
          const newChat: ChatThread = {
            id: `c_${Date.now()}`,
            matchId: getMatchId("me", person.id),
            personId: person.id,
            lastAt: "Now",
            unread: 0,
            messages: [
              {
                id: "init",
                from: "them",
                text: `Assalamu alaikum. Thank you for accepting the proposal. Let's communicate with adab.`,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                read: true,
              },
            ],
            finalProposalStatus: "none",
            elapsedDaysOffset: 0,
            chatStartDate: new Date().toISOString(),
          };
          updateChats([newChat, ...chats]);
        }
        return `Proposal from ${person.name} accepted! Chat initialized.`;
      },
      error: "Error accepting proposal.",
    });
  };

  const handleDecline = (person: Person) => {
    const nextReceived = proposals.received.filter((x) => x.id !== person.id);
    updateProposals({
      ...proposals,
      received: nextReceived,
    });
    toast.success(`Proposal from ${person.name.split(" ")[0]} declined`);
  };

  const handleCancelSent = (person: Person) => {
    const nextSent = proposals.sent.filter((x) => x.id !== person.id);
    updateProposals({
      ...proposals,
      sent: nextSent,
    });
    toast.info(`Proposal to ${person.name.split(" ")[0]} cancelled`);
  };

  const handleSendProposalFromSaved = (person: Person) => {
    const isAlreadySent = proposals.sent.some((s) => s.id === person.id);
    const isAlreadyAccepted = proposals.accepted.some((s) => s.id === person.id);
    const isAlreadyReceived = proposals.received.some((s) => s.id === person.id);

    if (isAlreadySent || isAlreadyAccepted || isAlreadyReceived) {
      toast.info(`Proposal already active for ${person.name}`);
      return;
    }

    toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
      loading: "Sending proposal with dignity...",
      success: () => {
        updateProposals({
          ...proposals,
          sent: [...proposals.sent, person],
        });
        const nextBookmarks = bookmarks.filter((id) => id !== person.id);
        setBookmarks(nextBookmarks);
        localStorage.setItem("misaq_bookmarks", JSON.stringify(nextBookmarks));
        return `Proposal sent to ${person.name.split(" ")[0]} successfully!`;
      },
      error: "Error sending proposal.",
    });
  };

  const handleRemoveSaved = (person: Person) => {
    const nextBookmarks = bookmarks.filter((id) => id !== person.id);
    setBookmarks(nextBookmarks);
    localStorage.setItem("misaq_bookmarks", JSON.stringify(nextBookmarks));
    toast.info(`Removed ${person.name.split(" ")[0]} from saved profiles`);
  };

  return (
    <div className="pb-8">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-6 pb-3 pt-14 backdrop-blur">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl">{t("matches.title")}</h1>
          <button
            onClick={() => {
              setSearchOpen(!searchOpen);
              if (searchOpen) setSearchQuery("");
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted cursor-pointer"
            aria-label="Search matches"
          >
            {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>
        </div>

        {searchOpen && (
          <div className="mt-3 animate-fade-in">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search matches by name, city, profession..."
              className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
              autoFocus
            />
          </div>
        )}

        <div className="mt-3 flex gap-1 rounded-full bg-muted p-1">
          {tabs.map((it) => (
            <button
              key={it.key}
              onClick={() => setTab(it.key)}
              className={cn(
                "flex-1 rounded-full py-2 text-xs font-medium transition-all cursor-pointer",
                tab === it.key
                  ? "bg-background text-foreground shadow-soft"
                  : "text-muted-foreground",
              )}
            >
              {it.label}
            </button>
          ))}
        </div>
      </header>
      {filteredList.length === 0 ? (
        <EmptyState
          label={searchQuery ? "No matches found matching your search query." : t("matches.empty")}
        />
      ) : (
        <div className="space-y-2 p-4">
          {filteredList.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 animate-fade-in"
            >
              <Avatar person={p} size={56} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="truncate font-display text-base leading-none">{p.name}</p>
                  {p.verified && <VerifiedBadge />}
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {p.age} • {p.city} • {p.profession}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link
                    to="/app/profile/$id"
                    params={{ id: p.id }}
                    className="rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground"
                  >
                    {t("matches.view")}
                  </Link>
                  {tab === "received" && (
                    <>
                      <button
                        onClick={() => handleAccept(p)}
                        className="rounded-full border border-border bg-primary/5 text-primary px-3 py-1 text-[11px] font-medium cursor-pointer"
                      >
                        {t("matches.accept")}
                      </button>
                      <button
                        onClick={() => handleDecline(p)}
                        className="rounded-full border border-border px-3 py-1 text-[11px] text-destructive cursor-pointer"
                      >
                        {t("matches.decline")}
                      </button>
                    </>
                  )}
                  {tab === "sent" && (
                    <button
                      onClick={() => handleCancelSent(p)}
                      className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground cursor-pointer"
                    >
                      {t("common.cancel")}
                    </button>
                  )}
                  {tab === "accepted" && (
                    <Link
                      to="/app/chats"
                      className="rounded-full border border-border px-3 py-1 text-[11px] cursor-pointer"
                    >
                      {t("matches.openChat")}
                    </Link>
                  )}
                  {tab === "saved" && (
                    <>
                      <button
                        onClick={() => handleSendProposalFromSaved(p)}
                        className="rounded-full border border-border bg-primary/5 text-primary px-3 py-1 text-[11px] font-medium cursor-pointer"
                      >
                        Send Proposal
                      </button>
                      <button
                        onClick={() => handleRemoveSaved(p)}
                        className="rounded-full border border-border px-3 py-1 text-[11px] text-destructive cursor-pointer"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
              <CompatibilityRing value={p.compatibility} size={44} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center text-muted-foreground">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-6 w-6" />
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}
