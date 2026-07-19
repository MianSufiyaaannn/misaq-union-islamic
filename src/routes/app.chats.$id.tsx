import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useChats,
  findPerson,
  useMe,
  type ChatMessage,
  switchRole,
  useNotifications,
  getMatchId,
  getBlockedMatches,
  setMatchBlocked,
} from "@/lib/mock";
import { Avatar } from "@/components/misaq/bits";
import { validateMessageContent, addSafetyEvent } from "@/lib/safety";
import { TopBar } from "@/components/misaq/top-bar";
import {
  Phone,
  Video,
  Plus,
  Smile,
  Mic,
  Send,
  Play,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  Sparkles,
  MessageCircleWarning,
  Lock,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/misaq/providers";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/app/chats/$id")({ component: Thread });

function Thread() {
  const { id } = Route.useParams();
  const t = useT();
  const [chats, updateChats] = useChats();
  const [me, updateMe] = useMe();
  const [notifications, updateNotifications] = useNotifications();
  const [showControls, setShowControls] = useState(false);
  const [devModeEnabled, setDevModeEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("misaq_dev_mode") === "true";
    }
    return false;
  });

  useEffect(() => {
    const handleDevModeChange = () => {
      setDevModeEnabled(localStorage.getItem("misaq_dev_mode") === "true");
    };
    window.addEventListener("misaq_dev_mode_change", handleDevModeChange);
    return () => window.removeEventListener("misaq_dev_mode_change", handleDevModeChange);
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [blockedMatches, setBlockedMatchesState] = useState<Record<string, boolean>>(() =>
    getBlockedMatches(),
  );

  // Find current thread in reactive state
  const chatIndex = chats.findIndex((c) => c.id === id);
  const chat = chats[chatIndex] || chats[0];
  const p = findPerson(chat.personId);
  const matchId = chat.matchId || getMatchId("me", chat.personId);

  const isManuallyBlocked = !!blockedMatches[matchId] || !!chat.blocked;

  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages, chat?.typing]);

  // Calculate elapsed days
  const chatStartDate = chat.chatStartDate ? new Date(chat.chatStartDate) : new Date();
  const elapsedOffset = chat.elapsedDaysOffset || 0;
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const startTime = chatStartDate.getTime();

  // Simulated current time with offset
  const simulatedNowTime = Date.now() + elapsedOffset * 24 * 60 * 60 * 1000;
  const diff = simulatedNowTime - startTime;
  const remainingMs = Math.max(0, sevenDaysMs - diff);

  const remainingDays = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const remainingHours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const isChatExpired = remainingMs <= 0;

  // matrimonial workflow parameters
  const isMatchCouple = true; // Every chat represents a matched couple
  const currentStatus = chat.finalProposalStatus || "none";
  const isPremiumUnlocked = currentStatus === "purchased";
  const isChatUnlocked = isPremiumUnlocked;

  // Chat can have only one status: ACTIVE, BLOCKED, REJECTED, CLOSED
  // Priority: REJECTED > BLOCKED > ACTIVE
  const getThreadStatus = (): "ACTIVE" | "BLOCKED" | "REJECTED" | "CLOSED" => {
    const isRejected =
      chat.finalProposalStatus === "rejected" || chat.finalProposalStatus === "wali_rejected";
    if (isRejected) return "REJECTED";

    if (isManuallyBlocked) return "BLOCKED";

    if (isChatExpired && !isPremiumUnlocked) return "CLOSED";

    return "ACTIVE";
  };

  const threadStatus = getThreadStatus();

  const showFinalProposalButton =
    me.gender === "male" &&
    !!matchId &&
    chat !== undefined &&
    currentStatus === "none" &&
    threadStatus !== "REJECTED" &&
    threadStatus !== "BLOCKED";

  const showUpgradePremiumButton =
    me.gender === "male" &&
    currentStatus === "wali_approved" &&
    !isPremiumUnlocked &&
    threadStatus !== "REJECTED" &&
    threadStatus !== "BLOCKED";

  const showBrideActions =
    me.gender === "female" &&
    currentStatus === "sent" &&
    threadStatus !== "REJECTED" &&
    threadStatus !== "BLOCKED";

  // Debug Matrimonial State
  console.log("Matrimonial State Debug:", {
    meGender: me.gender,
    meId: me.id,
    matchId,
    chatId: chat?.id,
    personId: chat?.personId,
    finalProposalStatus: chat?.finalProposalStatus,
    showFinalProposalButton,
    showUpgradePremiumButton,
    showBrideActions,
    isPremiumUnlocked,
    threadStatus,
  });

  const handleBlockConfirm = () => {
    setMatchBlocked(matchId, true);
    setBlockedMatchesState(getBlockedMatches());
    updateChats(chats.map((c) => (c.id === chat.id ? { ...c, blocked: true } : c)));
    toast.success(`${p.name} has been blocked.`);
    setShowBlockConfirm(false);
  };

  const handleUnblock = () => {
    const isRejected =
      chat.finalProposalStatus === "rejected" || chat.finalProposalStatus === "wali_rejected";
    if (isRejected) {
      toast.error(
        "Cannot unblock: The proposal has been rejected and this conversation is closed.",
      );
      return;
    }
    setMatchBlocked(matchId, false);
    setBlockedMatchesState(getBlockedMatches());
    updateChats(chats.map((c) => (c.id === chat.id ? { ...c, blocked: false } : c)));
    toast.success(`${p.name} has been unblocked.`);
  };

  const updateOffset = (delta: number) => {
    const nextOffset = Math.max(0, elapsedOffset + delta);
    updateChats(chats.map((c) => (c.id === chat.id ? { ...c, elapsedDaysOffset: nextOffset } : c)));
    toast.info(`Simulated time advanced by: ${nextOffset} days elapsed.`);
  };

  const simulateAccept = () => {
    const sysMsg: ChatMessage = {
      id: `sys_accept_${Date.now()}`,
      from: "them",
      text: "🟢 Aisha Rahman has accepted your Final Proposal! The request has been sent to her Wali (Abdullah Rahman) for review.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    updateChats(
      chats.map((c) => {
        if (c.id === chat.id) {
          return {
            ...c,
            finalProposalStatus: "accepted",
            messages: [...c.messages, sysMsg],
          };
        }
        return c;
      }),
    );
    toast.success("Simulation: Match accepted final proposal. Forwarded to Wali.");
  };

  const simulateReject = () => {
    const sysMsg: ChatMessage = {
      id: `sys_reject_${Date.now()}`,
      from: "them",
      text: "🔴 Aisha Rahman has declined the Final Proposal. Matrimonial workflow closed.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    updateChats(
      chats.map((c) => {
        if (c.id === chat.id) {
          return {
            ...c,
            finalProposalStatus: "rejected",
            messages: [...c.messages, sysMsg],
          };
        }
        return c;
      }),
    );
    toast.error("Simulation: Match declined final proposal.");
  };

  const resetWorkflow = () => {
    setMatchBlocked(matchId, false);
    setBlockedMatchesState(getBlockedMatches());
    updateChats(
      chats.map((c) => {
        if (c.id === chat.id) {
          return {
            ...c,
            elapsedDaysOffset: 0,
            finalProposalStatus: "none",
            blocked: false,
            messages: c.messages.filter(
              (m) => !m.id.startsWith("sys_") && !m.id.includes("blocked"),
            ),
          };
        }
        return c;
      }),
    );
    toast.info("Matrimonial simulation workflow reset.");
  };

  const sendFinalProposal = () => {
    const sysMsg: ChatMessage = {
      id: `sys_sent_${Date.now()}`,
      from: "me",
      text: "💍 Ahmed Raza has sent a Final Proposal. Waiting for response from Aisha...",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    updateChats(
      chats.map((c) => {
        if (c.id === chat.id) {
          return {
            ...c,
            finalProposalStatus: "sent",
            messages: [...c.messages, sysMsg],
          };
        }
        return c;
      }),
    );

    // Send proposal notification to Bride (Aisha)
    const newNotif = {
      id: `n_fp_sent_${Date.now()}`,
      bucket: "today" as const,
      kind: "proposal" as const,
      personId: "me",
      title: "Final Matrimonial Proposal",
      desc: "Ahmed Raza has sent you a Final Proposal. Click to review.",
      time: "Just now",
      read: false,
    };
    updateNotifications([newNotif, ...notifications]);

    toast.success("Final Proposal successfully sent to Aisha!");
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    // Perform community guideline validation
    const safetyValidation = validateMessageContent(text);
    if (!safetyValidation.isValid) {
      addSafetyEvent({
        userId: me.id,
        userName: me.name,
        userRole: me.gender === "male" ? "Groom" : "Bride",
        matchId: matchId || "",
        chatId: chat.id,
        time: new Date().toISOString(),
        blockedMessage: text.trim(),
        reasonCategory: safetyValidation.category || "Community Guidelines Violation",
        reviewStatus: "Pending",
        severityLevel: safetyValidation.severity,
      });

      const warnMsg: ChatMessage = {
        id: `sys_warn_safety_${Date.now()}`,
        from: "them",
        text: `Your message could not be delivered because it does not follow Misaq Community Guidelines.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      updateChats(
        chats.map((c) => {
          if (c.id === chat.id) {
            return {
              ...c,
              messages: [...c.messages, warnMsg],
            };
          }
          return c;
        }),
      );

      // Note: We deliberately do NOT run setText("") to allow the user to edit and resend the message.
      toast.error("Message blocked: does not follow community guidelines.");
      return;
    }

    // Rule: Text chat ends after 7 days
    if (isChatExpired && !isChatUnlocked && isMatchCouple) {
      toast.error(
        "7-day initial communication period has expired. Please send a Final Proposal to continue.",
      );
      return;
    }

    // Rule: Pre-Premium Contact Sharing Blocker (regex checks)
    if (!isChatUnlocked && isMatchCouple) {
      const lowerText = text.toLowerCase();

      const hasDigit = /\d/.test(lowerText);
      const hasAt = lowerText.includes("@");
      const hasDotCom = lowerText.includes(".com");
      const hasDotNet = lowerText.includes(".net");
      const hasDotOrg = lowerText.includes(".org");
      const hasWww = lowerText.includes("www");
      const hasHttp = lowerText.includes("http") || lowerText.includes("https");

      const blockedKeywords = [
        "facebook",
        "fb",
        "instagram",
        "insta",
        "snapchat",
        "snap",
        "tiktok",
        "twitter",
        "telegram",
        "discord",
        "linkedin",
        "youtube",
        "whatsapp",
        "wa.me",
        "phone",
        "email",
        "mobile",
        "number",
        "contact",
        "cnic",
        "address",
        "street",
        "house",
        "block",
        "bahria",
        "dha",
      ];
      const hasBlockedKeyword = blockedKeywords.some((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "i");
        return regex.test(lowerText);
      });

      const linkRegex = /(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\b/gi;
      const hasLink = linkRegex.test(lowerText);

      if (
        hasDigit ||
        hasAt ||
        hasDotCom ||
        hasDotNet ||
        hasDotOrg ||
        hasWww ||
        hasHttp ||
        hasBlockedKeyword ||
        hasLink
      ) {
        const warningText =
          "For your privacy and safety, sharing numbers or contact information is not allowed until Premium is unlocked.";

        const warnMsg: ChatMessage = {
          id: `sys_warn_${Date.now()}`,
          from: "them",
          text: `⚠️ Privacy Protection: ${warningText}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        updateChats(
          chats.map((c) => {
            if (c.id === chat.id) {
              return {
                ...c,
                messages: [...c.messages, warnMsg],
              };
            }
            return c;
          }),
        );
        setText("");
        toast.warning("Message blocked: Sharing numbers or contact information is not allowed.");
        return;
      }
    }

    const myMessage: ChatMessage = {
      id: `m_me_${Date.now()}`,
      from: "me",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };

    const updatedMessages = [...chat.messages, myMessage];
    updateChats(
      chats.map((c) => {
        if (c.id === chat.id) {
          return {
            ...c,
            lastAt: "Now",
            messages: updatedMessages,
          };
        }
        return c;
      }),
    );
    setText("");

    // Simulate reply
    setTimeout(() => {
      updateChats((prevChats) =>
        prevChats.map((c) => (c.id === chat.id ? { ...c, typing: true } : c)),
      );
    }, 1200);

    setTimeout(() => {
      const replyText = isChatUnlocked
        ? `Jazak Allah khair. My phone number is ${p.phone || "+92 321 4455667"} and email is ${p.email || "aisha.rahman@gmail.com"}. Let's coordinate with our Walis!`
        : `Jazak Allah khair. I will forward this message to my Wali, Ismail Siddiqui, so we can coordinate in shaa Allah.`;

      const replyMessage: ChatMessage = {
        id: `m_them_${Date.now()}`,
        from: "them",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      updateChats((prevChats) =>
        prevChats.map((c) => {
          if (c.id === chat.id) {
            return {
              ...c,
              typing: false,
              lastAt: "Now",
              messages: [...c.messages, replyMessage],
            };
          }
          return c;
        }),
      );

      toast.info(`New message from ${p.name.split(" ")[0]}`, {
        description: replyText.slice(0, 45) + "...",
      });
    }, 3500);
  };

  const handleMediaAction = (type: "call" | "attach" | "mic") => {
    if (isMatchCouple && !isChatUnlocked) {
      if (type === "call") {
        toast.error(
          "Calling Unavailable: Audio & video calls are locked. Complete the Wali-approved Misaq Premium upgrade to call your match.",
        );
      } else if (type === "attach") {
        toast.error(
          "Sharing Blocked: Image & document sharing is disabled during the initial 7-day communication phase.",
        );
      } else {
        toast.error(
          "Recording Disabled: Voice notes are locked during the initial 7-day communication phase.",
        );
      }
      return;
    }

    if (type === "call") {
      toast.success("Simulation: Calling match... Call connected with Wali audit visibility.");
    } else if (type === "attach") {
      toast.success("Simulation: Image successfully sent to chat.");
    } else {
      toast.success("Simulation: Voice note successfully recorded & sent.");
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gradient-cream">
      <TopBar
        title={
          <div className="flex items-center gap-2">
            <span className="truncate">{p.name}</span>
            {(threadStatus === "REJECTED" || threadStatus === "BLOCKED") && (
              <span className="shrink-0 rounded-full bg-destructive/15 px-2.5 py-0.5 text-[10px] font-bold text-destructive uppercase tracking-wider">
                Blocked
              </span>
            )}
          </div>
        }
        subtitle={t("chats.online")}
        right={
          <div className="flex items-center gap-2">
            {showFinalProposalButton && (
              <button
                type="button"
                onClick={sendFinalProposal}
                className="flex h-9 items-center gap-1.5 rounded-full bg-gradient-gold px-3 text-xs font-bold text-[color:var(--color-gold-foreground)] shadow-soft cursor-pointer hover:brightness-105 transition-all shrink-0"
              >
                💍 Final Proposal
              </button>
            )}

            {showUpgradePremiumButton && (
              <Link
                to="/app/premium"
                search={{ chatId: chat.id }}
                className="flex h-9 items-center gap-1.5 rounded-full bg-gradient-gold px-3 text-xs font-bold text-[color:var(--color-gold-foreground)] shadow-soft cursor-pointer hover:brightness-105 transition-all shrink-0 text-center"
              >
                👑 Upgrade Premium
              </Link>
            )}

            {showBrideActions && (
              <div className="flex gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    updateChats(
                      chats.map((c) =>
                        c.id === chat.id ? { ...c, finalProposalStatus: "accepted" } : c,
                      ),
                    );
                    const groomNotif = {
                      id: `n_fp_accepted_groom_${Date.now()}`,
                      bucket: "today" as const,
                      kind: "wali" as const,
                      title: "Final Proposal Accepted",
                      desc: "Aisha has accepted your Final Proposal! It has been forwarded to her Wali.",
                      time: "Just now",
                      read: false,
                    };
                    const waliNotif = {
                      id: `n_fp_accepted_wali_${Date.now()}`,
                      bucket: "today" as const,
                      kind: "wali" as const,
                      title: "Matrimonial Approval Required",
                      desc: "Aisha accepted Ahmed Raza's proposal. Your guardian approval is requested.",
                      time: "Just now",
                      read: false,
                    };
                    updateNotifications([groomNotif, waliNotif, ...notifications]);
                    toast.success("Proposal accepted! Forwarded to your Wali.");
                  }}
                  className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft cursor-pointer"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateChats(
                      chats.map((c) =>
                        c.id === chat.id ? { ...c, finalProposalStatus: "rejected" } : c,
                      ),
                    );
                    const groomNotif = {
                      id: `n_fp_rejected_groom_${Date.now()}`,
                      bucket: "today" as const,
                      kind: "proposal" as const,
                      title: "Final Proposal Declined",
                      desc: "Aisha declined your Final Proposal. Matrimonial workflow closed.",
                      time: "Just now",
                      read: false,
                    };
                    updateNotifications([groomNotif, ...notifications]);
                    toast.error("Proposal declined.");
                  }}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-destructive cursor-pointer"
                >
                  Reject
                </button>
              </div>
            )}

            <button
              onClick={() => {
                if (threadStatus === "REJECTED" || threadStatus === "BLOCKED") {
                  toast.error("Call Disabled: This conversation has been closed.");
                  return;
                }
                handleMediaAction("call");
              }}
              disabled={threadStatus === "REJECTED" || threadStatus === "BLOCKED"}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors cursor-pointer",
                threadStatus === "REJECTED" || threadStatus === "BLOCKED"
                  ? "bg-muted/40 text-muted-foreground/30 opacity-40 cursor-not-allowed"
                  : isChatUnlocked
                    ? "bg-muted text-foreground"
                    : "bg-muted/50 text-muted-foreground opacity-60",
              )}
              aria-label="voice call"
            >
              <Phone className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                if (threadStatus === "REJECTED" || threadStatus === "BLOCKED") {
                  toast.error("Call Disabled: This conversation has been closed.");
                  return;
                }
                handleMediaAction("call");
              }}
              disabled={threadStatus === "REJECTED" || threadStatus === "BLOCKED"}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors cursor-pointer",
                threadStatus === "REJECTED" || threadStatus === "BLOCKED"
                  ? "bg-primary/30 text-primary-foreground/30 opacity-40 cursor-not-allowed"
                  : isChatUnlocked
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/50 text-primary-foreground opacity-60",
              )}
              aria-label="video call"
            >
              <Video className="h-4 w-4" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer"
                  aria-label="More options"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-popover border border-border rounded-xl shadow-md p-1 min-w-[120px] z-50"
              >
                {isManuallyBlocked ? (
                  threadStatus !== "REJECTED" ? (
                    <DropdownMenuItem
                      onClick={handleUnblock}
                      className="text-primary font-medium px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-accent focus:bg-accent outline-none"
                    >
                      Unblock User
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      disabled
                      className="text-muted-foreground px-3 py-2 text-xs rounded-lg cursor-not-allowed opacity-50"
                    >
                      Unblock User (Rejected)
                    </DropdownMenuItem>
                  )
                ) : (
                  <DropdownMenuItem
                    onClick={() => setShowBlockConfirm(true)}
                    className="text-destructive font-medium px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 outline-none"
                  >
                    Block User
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {/* Matrimonial Collapsible Simulator controls */}
      {mounted && devModeEnabled && isMatchCouple && (
        <div className="bg-surface border-b border-border px-4 py-2">
          <button
            onClick={() => setShowControls(!showControls)}
            className="text-[10px] font-semibold text-primary flex items-center gap-1.5 cursor-pointer hover:underline"
          >
            <Wrench className="h-3.5 w-3.5 text-gold" /> Test Controls / Matrimonial Workflow
            Simulator
          </button>
          {showControls && (
            <div className="mt-2 grid grid-cols-2 gap-3 text-xs border border-dashed border-border rounded-2xl p-4 bg-card animate-fade-in text-left">
              <div>
                <p className="font-semibold text-muted-foreground">
                  Elapsed Offset: {elapsedOffset} days
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <button
                    onClick={() => updateOffset(1)}
                    className="bg-primary/10 text-primary px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer"
                  >
                    +1 Day
                  </button>
                  <button
                    onClick={() => updateOffset(-1)}
                    className="bg-muted px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer"
                  >
                    -1 Day
                  </button>
                  <button
                    onClick={() => {
                      updateChats(
                        chats.map((c) => (c.id === chat.id ? { ...c, elapsedDaysOffset: 7 } : c)),
                      );
                      toast.info("Simulated time advanced to 7 days (communication expired).");
                    }}
                    className="bg-destructive/15 text-destructive px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Fast-Forward 7 Days
                  </button>
                </div>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Proposal Status:</p>
                <p className="font-bold text-primary capitalize mt-0.5">
                  {chat.finalProposalStatus || "none"}
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-2 mt-1 border-t border-border pt-2.5">
                <button
                  onClick={simulateAccept}
                  className="bg-gold/15 text-[color:var(--color-gold-foreground)] px-2.5 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer"
                >
                  Simulate Aisha Accept FP
                </button>
                <button
                  onClick={simulateReject}
                  className="bg-destructive/10 text-destructive px-2.5 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer"
                >
                  Simulate Aisha Reject FP
                </button>
                <button
                  onClick={resetWorkflow}
                  className="col-span-2 bg-muted/60 text-muted-foreground px-2.5 py-1.5 rounded-xl text-[10px] font-semibold cursor-pointer text-center"
                >
                  Reset Matrimonial Simulation
                </button>
              </div>
              <div className="col-span-2 mt-2 border-t border-border pt-2">
                <p className="font-semibold text-[10px] text-muted-foreground mb-1">
                  Switch View for Testing (Simulator):
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      switchRole("boy");
                      toast.success("Switched view to Groom (Ahmed Raza)");
                    }}
                    className={cn(
                      "px-2 py-1.5 rounded-xl text-[10px] font-semibold cursor-pointer text-center",
                      me.gender === "male"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                    )}
                  >
                    Groom (Ahmed)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      switchRole("girl");
                      toast.success("Switched view to Bride (Aisha Rahman)");
                    }}
                    className={cn(
                      "px-2 py-1.5 rounded-xl text-[10px] font-semibold cursor-pointer text-center",
                      me.gender === "female"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                    )}
                  >
                    Bride (Aisha)
                  </button>
                  <Link
                    to="/wali"
                    className="px-2 py-1.5 rounded-xl text-[10px] font-semibold bg-muted text-foreground text-center cursor-pointer flex items-center justify-center"
                  >
                    Wali (Guardian)
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Workflow timer banner */}
      {mounted && isMatchCouple && (
        <div
          className={cn(
            "mx-4 mt-3 flex items-center gap-2 rounded-2xl border p-3 text-[11px] font-medium leading-normal animate-fade-in",
            isChatUnlocked
              ? "border-gold/30 bg-gold/10 text-[color:var(--color-gold-foreground)]"
              : isChatExpired
                ? "border-destructive/30 bg-destructive/5 text-destructive"
                : "border-primary/20 bg-primary/5 text-primary",
          )}
        >
          {isChatUnlocked ? (
            <>
              <Sparkles className="h-4 w-4 shrink-0 text-gold" />
              <p className="min-w-0">
                ✨ Premium Subscription Active. Direct call access, media uploads, and full details
                exchange are now unlocked.
              </p>
            </>
          ) : isChatExpired ? (
            <>
              <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
              <p className="min-w-0">
                ⏳ Communication Expired. The initial 7-day chat period has ended. You must send a
                Final Proposal to continue.
              </p>
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
              <p className="min-w-0">
                🔒 Initial Text Phase: {remainingDays}d {remainingHours}h remaining. Voice/video
                calling, media sharing, and contact details are restricted.
              </p>
            </>
          )}
        </div>
      )}

      {/* Messages View */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 px-4 py-4">
        <div className="flex justify-center">
          <span className="rounded-full bg-muted px-3 py-1 text-[10px] text-muted-foreground">
            {t("chats.startOfDay")}
          </span>
        </div>

        {chat.messages.map((m) => {
          const isWarn = m.id.startsWith("sys_warn_");
          const isSystem = m.id.startsWith("sys_");
          if (isSystem) {
            return (
              <div
                key={m.id}
                className={cn(
                  "mx-auto max-w-[90%] rounded-2xl p-3 text-center text-xs shadow-soft animate-fade-in",
                  isWarn
                    ? "bg-destructive/10 text-destructive border border-destructive/20"
                    : "bg-primary/5 text-primary border border-primary/10",
                )}
              >
                {m.text}
              </div>
            );
          }
          return (
            <div
              key={m.id}
              className={cn(
                "flex items-end gap-2 animate-fade-in",
                m.from === "me" ? "flex-row-reverse" : "",
              )}
            >
              {m.from === "them" && <Avatar person={p} size={28} />}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-soft",
                  m.from === "me"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-card text-foreground",
                )}
                dir="auto"
              >
                {m.text && <p>{m.text}</p>}
                {m.voice && (
                  <div className="flex items-center gap-2">
                    <button
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        m.from === "me" ? "bg-primary-foreground/20" : "bg-primary/10",
                      )}
                      aria-label={t("chats.voice")}
                    >
                      <Play className="h-3 w-3" />
                    </button>
                    <div className="flex items-end gap-0.5">
                      {Array.from({ length: 22 }).map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            "w-0.5 rounded-full",
                            m.from === "me" ? "bg-primary-foreground/70" : "bg-primary/60",
                          )}
                          style={{ height: 4 + Math.abs(Math.sin(i)) * 14 }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] opacity-70">
                      0:{String(m.voice.seconds).padStart(2, "0")}
                    </span>
                  </div>
                )}
                <p className="mt-1 text-right text-[9px] opacity-60">
                  {m.time}
                  {m.from === "me" && m.read ? " · ✓✓" : m.from === "me" ? " · ✓" : ""}
                </p>
              </div>
            </div>
          );
        })}

        {chat.typing && (
          <div className="flex items-end gap-2">
            <Avatar person={p} size={28} />
            <div className="rounded-2xl rounded-bl-md bg-card px-4 py-3 shadow-soft">
              <div className="flex gap-1">
                <span
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
                  style={{ animationDelay: "120ms" }}
                />
                <span
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
                  style={{ animationDelay: "240ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Form or Blocked Banners */}
      {threadStatus === "REJECTED" ? (
        <div className="sticky bottom-0 border-t border-border bg-destructive/5 px-4 py-6 text-center text-sm font-semibold text-destructive backdrop-blur mt-auto flex flex-col items-center justify-center gap-1.5 animate-fade-in">
          <Lock className="h-4 w-4 text-destructive" />
          <span>This proposal has been rejected. This conversation has been closed.</span>
        </div>
      ) : threadStatus === "BLOCKED" ? (
        <div className="sticky bottom-0 border-t border-border bg-muted/80 px-4 py-6 text-center text-sm font-semibold text-muted-foreground backdrop-blur mt-auto flex flex-col items-center justify-center gap-1.5 animate-fade-in">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span>Blocked by You</span>
        </div>
      ) : (
        <form
          onSubmit={handleSend}
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          className="sticky bottom-0 border-t border-border bg-background/95 px-3 pt-3 pb-3 backdrop-blur mt-auto shrink-0"
        >
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleMediaAction("attach")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted cursor-pointer"
              aria-label="attach"
            >
              <Plus className="h-4 w-4" />
            </button>
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-surface px-3 py-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  isChatExpired && !isChatUnlocked && isMatchCouple
                    ? "Communication ended. Propose to continue."
                    : t("chats.messagePlaceholder")
                }
                disabled={isChatExpired && !isChatUnlocked && isMatchCouple}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none disabled:opacity-50"
                dir="auto"
              />
              <Smile className="h-4 w-4 shrink-0 text-muted-foreground cursor-pointer" />
            </div>
            <button
              type="button"
              onClick={() => handleMediaAction("mic")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground cursor-pointer"
              aria-label={t("chats.voice")}
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              type="submit"
              disabled={isChatExpired && !isChatUnlocked && isMatchCouple}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-gold text-[color:var(--color-gold-foreground)] cursor-pointer disabled:opacity-50"
              aria-label="send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      <AlertDialog open={showBlockConfirm} onOpenChange={setShowBlockConfirm}>
        <AlertDialogContent className="max-w-[90%] sm:max-w-md rounded-3xl bg-background border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-lg text-foreground text-center sm:text-left">
              Block Member
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground text-center sm:text-left">
              Are you sure you want to block this member?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2 mt-4 justify-center sm:justify-end">
            <AlertDialogCancel className="flex-1 sm:flex-initial rounded-full border border-border py-2 text-xs font-semibold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlockConfirm}
              className="flex-1 sm:flex-initial rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 py-2 text-xs font-semibold"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
