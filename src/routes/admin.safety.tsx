import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Eye,
  UserCheck,
  Trash2,
  Save,
  Inbox,
  Filter,
  Users,
  Search,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { useChats, findPerson, meMember } from "@/lib/mock";
import { getSafetyEvents, updateSafetyEvent, clearSafetyEvent, getUserSafetyEventCount, type SafetyEvent } from "@/lib/safety";
import { Avatar } from "@/components/misaq/bits";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/safety")({ component: AdminSafety });

function AdminSafety() {
  const [events, setEvents] = useState<SafetyEvent[]>([]);
  const [chats] = useChats();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("Pending");

  // Modals state
  const [activeAuditChat, setActiveAuditChat] = useState<SafetyEvent | null>(null);
  const [activeProfileView, setActiveProfileView] = useState<SafetyEvent | null>(null);
  const [profileTab, setProfileTab] = useState<"sender" | "recipient">("sender");

  // Textarea note state
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  // Reload safety events
  const loadEvents = () => {
    setEvents(getSafetyEvents());
  };

  useEffect(() => {
    loadEvents();
    window.addEventListener("misaq_safety_events_updated", loadEvents);
    return () => {
      window.removeEventListener("misaq_safety_events_updated", loadEvents);
    };
  }, []);

  const handleSaveNotes = (id: string) => {
    const noteText = editingNotes[id] ?? "";
    updateSafetyEvent(id, { internalNotes: noteText });
    toast.success("Internal notes updated successfully.");
  };

  const handleMarkReviewed = (id: string) => {
    updateSafetyEvent(id, { reviewStatus: "Reviewed" });
    toast.success("Event marked as Reviewed.");
  };

  const handleClearEvent = (id: string) => {
    clearSafetyEvent(id);
    toast.info("Safety event cleared from queue.");
  };

  // Helper to fetch details of users in safety event
  const getProfilesForEvent = (event: SafetyEvent) => {
    const chat = chats.find((c) => c.id === event.chatId);
    
    // Sender of the blocked message
    const sender = event.userId === "me" ? meMember : findPerson(event.userId);
    
    // Recipient of the blocked message
    const recipientId = chat ? (chat.personId === event.userId ? "me" : chat.personId) : "f-aisha-0";
    const recipient = recipientId === "me" ? meMember : findPerson(recipientId);

    return { sender, recipient };
  };

  // Helper to calculate total count of safety triggers per account
  const getUserViolations = (userId: string) => {
    return getUserSafetyEventCount(userId);
  };

  // Filter and sort events
  const filteredEvents = events
    .filter((e) => {
      // 1. Search
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        e.userName.toLowerCase().includes(query) ||
        e.blockedMessage.toLowerCase().includes(query) ||
        e.reasonCategory.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // 2. Status Filter
      if (statusFilter !== "All" && e.reviewStatus !== statusFilter) return false;

      // 3. Severity Filter
      if (severityFilter !== "All" && e.severityLevel !== severityFilter) return false;

      return true;
    })
    .sort((a, b) => {
      // Sort by priority (total violation count for the account)
      const countA = getUserViolations(a.userId);
      const countB = getUserViolations(b.userId);
      
      // Higher violation count comes first (increased review priority)
      if (countA !== countB) {
        return countB - countA;
      }
      // Then sort by newest time
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

  return (
    <div className="p-4 pb-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-base font-bold text-primary flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-destructive" /> Community Safety Queue
        </h1>
        <span className="text-[11px] font-semibold bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
          {filteredEvents.length} Active Events
        </span>
      </div>

      {/* Filters Card */}
      <div className="rounded-2xl border border-border bg-card p-3 space-y-2.5 shadow-sm">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-2.5 py-1.5">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user name, message, category..."
            className="min-w-0 flex-1 bg-transparent text-xs outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] text-muted-foreground font-semibold uppercase block mb-1">Status</label>
            <div className="flex gap-1">
              {["Pending", "Reviewed", "All"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "flex-1 py-1 rounded-lg font-medium border border-border text-[10px] transition-colors cursor-pointer",
                    statusFilter === status
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface text-muted-foreground hover:bg-muted/30"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-muted-foreground font-semibold uppercase block mb-1">Severity</label>
            <div className="flex gap-1">
              {["All", "High", "Medium", "Low"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={cn(
                    "flex-1 py-1 rounded-lg font-medium border border-border text-[10px] transition-colors cursor-pointer",
                    severityFilter === sev
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface text-muted-foreground hover:bg-muted/30"
                  )}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center text-muted-foreground bg-card rounded-3xl border border-border animate-fade-in">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Inbox className="h-6 w-6 text-muted-foreground/60" />
          </div>
          <p className="text-sm font-medium">All clear! No pending safety review items.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredEvents.map((e) => {
            const violationCount = getUserViolations(e.userId);
            const isHighPriority = violationCount >= 2;
            const { sender } = getProfilesForEvent(e);

            return (
              <div
                key={e.id}
                className={cn(
                  "rounded-2xl border bg-card p-4 space-y-3 transition-all animate-fade-in shadow-soft",
                  isHighPriority ? "border-destructive/35 bg-destructive/5" : "border-border"
                )}
              >
                {/* Event header info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar person={sender} size={32} />
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-foreground leading-tight">{e.userName}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">
                        {e.userRole} · ID: {e.userId}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                        e.severityLevel === "High"
                          ? "bg-destructive/15 text-destructive"
                          : e.severityLevel === "Medium"
                            ? "bg-gold/20 text-[color:var(--color-gold-foreground)]"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {e.severityLevel}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      {new Date(e.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                {/* Priority alert banner */}
                {isHighPriority && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-destructive/10 text-destructive text-[10px] font-semibold px-2 py-1">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>High Review Priority: {violationCount} safety events triggered by this account.</span>
                  </div>
                )}

                {/* Content Block */}
                <div className="rounded-xl border border-border/80 bg-surface px-3 py-2 space-y-1">
                  <div className="flex items-center justify-between border-b border-border/40 pb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      Category: {e.reasonCategory}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      Status: <strong className={e.reviewStatus === "Pending" ? "text-amber-600" : "text-emerald-600"}>{e.reviewStatus}</strong>
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-destructive mt-1 break-words select-all">
                    "{e.blockedMessage}"
                  </p>
                </div>

                {/* Internal notes field */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Internal Notes</label>
                  <div className="flex gap-1.5">
                    <textarea
                      value={editingNotes[e.id] ?? e.internalNotes ?? ""}
                      onChange={(evt) =>
                        setEditingNotes({
                          ...editingNotes,
                          [e.id]: evt.target.value,
                        })
                      }
                      placeholder="Add moderator action or policy notes..."
                      className="flex-1 rounded-xl border border-border bg-surface text-xs px-2.5 py-1.5 resize-none h-9 outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => handleSaveNotes(e.id)}
                      className="rounded-xl border border-border bg-card px-2.5 flex items-center justify-center hover:bg-muted/20 transition-all shrink-0 cursor-pointer"
                      aria-label="Save notes"
                    >
                      <Save className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-1">
                  <button
                    onClick={() => {
                      setActiveProfileView(e);
                      setProfileTab("sender");
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-border bg-card py-1.5 hover:bg-muted/20 transition-all cursor-pointer"
                  >
                    <Users className="h-3.5 w-3.5 text-muted-foreground" /> View Profiles
                  </button>
                  <button
                    onClick={() => setActiveAuditChat(e)}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-border bg-card py-1.5 hover:bg-muted/20 transition-all cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" /> View Chat History
                  </button>

                  {e.reviewStatus === "Pending" ? (
                    <button
                      onClick={() => handleMarkReviewed(e.id)}
                      className="col-span-1 flex items-center justify-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-600/5 text-emerald-600 py-1.5 hover:bg-emerald-600/10 transition-all cursor-pointer"
                    >
                      <UserCheck className="h-3.5 w-3.5" /> Mark Reviewed
                    </button>
                  ) : (
                    <div className="col-span-1 rounded-full bg-emerald-600/10 text-emerald-600 py-1.5 text-center text-[10px] font-bold flex items-center justify-center">
                      Reviewed ✓
                    </div>
                  )}

                  <button
                    onClick={() => handleClearEvent(e.id)}
                    className="col-span-1 flex items-center justify-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/5 text-destructive py-1.5 hover:bg-destructive/10 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Clear Event
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW CONVERSATION DIALOG */}
      <Dialog open={!!activeAuditChat} onOpenChange={(open) => !open && setActiveAuditChat(null)}>
        {activeAuditChat && (
          <DialogContent className="max-w-[420px] rounded-3xl bg-background p-6">
            <DialogHeader className="items-center text-center">
              <ShieldAlert className="h-8 w-8 text-primary mb-1" />
              <DialogTitle className="font-display text-lg text-primary">
                Chat Audit Log
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Reviewing safety context for matched couple
              </DialogDescription>
            </DialogHeader>

            <div className="mt-3 flex flex-col gap-2.5 max-h-[42vh] overflow-y-auto pr-1 border border-border rounded-2xl bg-surface p-3 text-left">
              {(() => {
                const chat = chats.find((c) => c.id === activeAuditChat.chatId);
                const { sender, recipient } = getProfilesForEvent(activeAuditChat);

                if (!chat) {
                  return <p className="text-xs text-muted-foreground text-center">No conversation history available.</p>;
                }

                // Render history
                return (
                  <>
                    {chat.messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "text-xs rounded-xl p-2.5 max-w-[85%]",
                          m.from === "me"
                            ? "bg-primary/15 text-primary self-end rounded-br-none"
                            : "bg-card text-foreground self-start rounded-bl-none border border-border"
                        )}
                      >
                        <p className="font-bold text-[8px] opacity-75 uppercase">
                          {m.from === "me" ? sender.name.split(" ")[0] : recipient.name.split(" ")[0]}
                        </p>
                        <p className="mt-0.5">{m.text}</p>
                        <p className="text-right text-[7px] opacity-60 mt-0.5">{m.time}</p>
                      </div>
                    ))}
                    {/* Add visual block highlighting the intercepted message */}
                    <div className="border-2 border-dashed border-destructive/50 bg-destructive/10 text-destructive text-xs rounded-xl p-3 self-end rounded-br-none max-w-[85%] mt-1">
                      <p className="font-bold text-[8px] uppercase tracking-wider">
                        🚨 Blocked Message ({sender.name.split(" ")[0]})
                      </p>
                      <p className="mt-1 font-semibold">"{activeAuditChat.blockedMessage}"</p>
                      <p className="text-right text-[7px] opacity-60 mt-1">
                        Category: {activeAuditChat.reasonCategory}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>

            <button
              onClick={() => setActiveAuditChat(null)}
              className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground mt-4 shadow-soft cursor-pointer"
            >
              Close Conversation Review
            </button>
          </DialogContent>
        )}
      </Dialog>

      {/* VIEW MEMBER PROFILES DIALOG */}
      <Dialog open={!!activeProfileView} onOpenChange={(open) => !open && setActiveProfileView(null)}>
        {activeProfileView && (
          <DialogContent className="max-w-[420px] rounded-3xl bg-background p-6">
            <DialogHeader className="items-center text-center">
              <Users className="h-8 w-8 text-primary mb-1" />
              <DialogTitle className="font-display text-lg text-primary">
                Member Profile Audit
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Inspect both members involved in the safety incident
              </DialogDescription>
            </DialogHeader>

            {/* Profile Selection Tabs */}
            <div className="flex border-b border-border/80 mt-2.5">
              <button
                onClick={() => setProfileTab("sender")}
                className={cn(
                  "flex-1 pb-2 text-xs font-bold border-b-2 text-center cursor-pointer transition-all",
                  profileTab === "sender"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Sender: {getProfilesForEvent(activeProfileView).sender.name.split(" ")[0]}
              </button>
              <button
                onClick={() => setProfileTab("recipient")}
                className={cn(
                  "flex-1 pb-2 text-xs font-bold border-b-2 text-center cursor-pointer transition-all",
                  profileTab === "recipient"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Recipient: {getProfilesForEvent(activeProfileView).recipient.name.split(" ")[0]}
              </button>
            </div>

            {/* Active Profile Info */}
            <div className="mt-3.5 max-h-[42vh] overflow-y-auto pr-1 text-left space-y-3.5">
              {(() => {
                const { sender, recipient } = getProfilesForEvent(activeProfileView);
                const active = profileTab === "sender" ? sender : recipient;

                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar person={active} size={50} />
                      <div>
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                          {active.name}
                          {active.verified && (
                            <span className="inline-block rounded-full bg-emerald-500/10 p-0.5 text-emerald-500">
                              ✓
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-muted-foreground capitalize">
                          {active.age} yrs · {active.city}, {active.country}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-surface border border-border/60 rounded-xl p-3">
                      <div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Profession</span>
                        <p className="font-medium text-foreground">{active.profession || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Education</span>
                        <p className="font-medium text-foreground">{active.education || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Sect</span>
                        <p className="font-medium text-foreground capitalize">{active.sect || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Income</span>
                        <p className="font-medium text-foreground">{active.monthlyIncome || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Prayer Commitment</span>
                        <p className="font-medium text-foreground">{active.prayer || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Quran Level</span>
                        <p className="font-medium text-foreground">{active.quran || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase block">Biography</span>
                      <p className="text-xs text-foreground bg-muted/40 border border-border/30 rounded-xl p-3 leading-relaxed">
                        {active.bio || "No biography provided."}
                      </p>
                    </div>

                    {active.waliName && (
                      <div className="space-y-1 border-t border-border/50 pt-2.5">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase block">Wali (Guardian) Information</span>
                        <div className="bg-surface border border-border/60 rounded-xl p-3 text-[11px] space-y-1">
                          <p>
                            <span className="text-muted-foreground">Name:</span> <strong>{active.waliName} ({active.waliRelationship})</strong>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Phone:</span> <strong>{active.waliPhone || "Not specified"}</strong>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Email:</span> <strong>{active.waliEmail || "Not specified"}</strong>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <button
              onClick={() => setActiveProfileView(null)}
              className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground mt-4 shadow-soft cursor-pointer"
            >
              Close Profile Review
            </button>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
