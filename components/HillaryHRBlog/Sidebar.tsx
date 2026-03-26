"use client";

import { useState } from "react";
import { NewsItem, PROVINCES, URGENCY_CONFIG } from "@/lib/types";
import { ProvinceBadge } from "./ProvinceBadge";

export function Sidebar({ items }: { items: NewsItem[] }) {
  const [email, setEmail] = useState("");
  const [subscribeState, setSubscribeState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubscribe = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setSubscribeState("error");
      return;
    }

    setSubscribeState("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.ok) {
        setSubscribeState("success");
        setEmail("");
      } else {
        setSubscribeState("error");
      }
    } catch {
      setSubscribeState("error");
    }
  };
  const byProvince = PROVINCES.reduce<Record<string, number>>((acc, p) => {
    acc[p] = items.filter((i) => i.provinces.includes(p)).length;
    return acc;
  }, {});

  const byUrgency = {
    high: items.filter((i) => i.urgency === "high").length,
    medium: items.filter((i) => i.urgency === "medium").length,
    low: items.filter((i) => i.urgency === "low").length,
  };

  const topProvince = Object.entries(byProvince)
    .sort((a, b) => b[1] - a[1])
    .filter(([, v]) => v > 0)
    .slice(0, 5);

  return (
    <aside
      style={{
        width: "220px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Alert summary */}
      <div>
        <h4
          style={{
            fontFamily: "var(--font-roboto)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#aaa",
            margin: "0 0 12px 0",
          }}
        >
          This Month&apos;s Alerts
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {(["high", "medium", "low"] as const).map((level) => {
            const cfg = URGENCY_CONFIG[level];
            const count = byUrgency[level];
            return (
              <div
                key={level}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 10px",
                  background: cfg.bg,
                  borderRadius: "3px",
                  border: `1px solid ${cfg.color}22`,
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: cfg.color,
                    fontWeight: 600,
                    fontFamily: "var(--font-roboto)",
                  }}
                >
                  {cfg.label}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: cfg.color,
                    fontFamily: "var(--font-newsreader)",
                  }}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Province breakdown */}
      <div>
        <h4
          style={{
            fontFamily: "var(--font-roboto)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#aaa",
            margin: "0 0 12px 0",
          }}
        >
          By Jurisdiction
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {topProvince.map(([province, count]) => (
            <div
              key={province}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ProvinceBadge province={province} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flex: 1,
                  marginLeft: "8px",
                }}
              >
                <div
                  style={{
                    height: "3px",
                    background: "#e8e6e1",
                    flex: 1,
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${items.length > 0 ? (count / items.length) * 100 : 0}%`,
                      background: "#1a1a1a",
                      borderRadius: "2px",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#888",
                    fontFamily: "var(--font-roboto)",
                    width: "12px",
                    textAlign: "right",
                  }}
                >
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div
        style={{
          background: "#fafaf8",
          border: "1px solid #e8e6e1",
          borderRadius: "4px",
          padding: "14px",
        }}
      >
        <h4
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: "13px",
            fontWeight: 600,
            color: "#1a1a1a",
            margin: "0 0 8px 0",
          }}
        >
          About This Blog
        </h4>
        <p
          style={{
            fontFamily: "var(--font-roboto)",
            fontSize: "11px",
            color: "#666",
            lineHeight: 1.65,
            margin: "0 0 8px 0",
          }}
        >
          Curated daily from 6 Canadian employment law and HR sources. AI
          summaries reviewed and annotated by{" "}
          <a
            href="https://linkedin.com/in/hillary-chukwu-"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#c0392b", textDecoration: "none" }}
          >
            Hillary Chukwu
          </a>
          {" "}— a senior HR practitioner with 10+ years of Canadian HR
          experience.
        </p>
        <p
          style={{
            fontFamily: "var(--font-roboto)",
            fontSize: "10px",
            color: "#aaa",
            margin: 0,
          }}
        >
          Updated nightly · Not legal advice
        </p>
      </div>

      {/* Subscribe CTA */}
      <div
        id="subscribe-cta"
        style={{
          border: "1.5px solid #1a1a1a",
          borderRadius: "4px",
          padding: "14px",
        }}
      >
        <h4
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: "13px",
            fontWeight: 600,
            color: "#1a1a1a",
            margin: "0 0 6px 0",
          }}
        >
          Weekly Digest
        </h4>
        <p
          style={{
            fontFamily: "var(--font-roboto)",
            fontSize: "11px",
            color: "#666",
            lineHeight: 1.6,
            margin: "0 0 10px 0",
          }}
        >
          The week&apos;s top Canadian HR updates in your inbox every Monday.
        </p>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={subscribeState === "loading"}
          aria-label="Email for newsletter"
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: "8px",
            border: "1px solid #e0ded8",
            borderRadius: "3px",
            fontSize: "12px",
            fontFamily: "var(--font-roboto)",
            outline: "none",
            background: "#fff",
            color: "#333",
            boxSizing: "border-box",
          }}
        />
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={subscribeState === "loading"}
          style={{
            width: "100%",
            background: subscribeState === "loading" ? "#888" : "#1a1a1a",
            color: "#fff",
            border: "none",
            borderRadius: "3px",
            padding: "8px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: subscribeState === "loading" ? "not-allowed" : "pointer",
            fontFamily: "var(--font-roboto)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            if (subscribeState !== "loading") {
              (e.currentTarget as HTMLElement).style.background = "#c0392b";
            }
          }}
          onMouseLeave={(e) => {
            if (subscribeState !== "loading") {
              (e.currentTarget as HTMLElement).style.background = "#1a1a1a";
            }
          }}
        >
          {subscribeState === "loading"
            ? "Sending..."
            : subscribeState === "success"
              ? "Subscribed"
              : "Subscribe →"}
        </button>
        {subscribeState === "success" && (
          <p
            style={{
              fontFamily: "var(--font-roboto)",
              fontSize: "11px",
              color: "#27ae60",
              margin: "8px 0 0 0",
            }}
          >
            Thanks! You&apos;re on the list.
          </p>
        )}
        {subscribeState === "error" && (
          <p
            style={{
              fontFamily: "var(--font-roboto)",
              fontSize: "11px",
              color: "#c0392b",
              margin: "8px 0 0 0",
            }}
          >
            Please enter a valid email and try again.
          </p>
        )}
      </div>
    </aside>
  );
}
