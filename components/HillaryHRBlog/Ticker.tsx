"use client";

import { NewsItem } from "@/lib/types";

const tickerStyles = `
  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .ticker-scroll {
    animation: ticker 30s linear infinite;
    will-change: transform;
  }
  .ticker-scroll:hover {
    animation-play-state: paused;
  }
`;

export function Ticker({ items }: { items: NewsItem[] }) {
  const highPriority = items.filter((i) => i.urgency === "high");
  const tickerItems = [...highPriority, ...highPriority];

  return (
    <div
      style={{
        background: "#1a1a1a",
        color: "#fff",
        height: "32px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        gap: "0",
        position: "relative",
      }}
    >
      <div
        style={{
          background: "#c0392b",
          padding: "0 14px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "var(--font-roboto)",
            whiteSpace: "nowrap",
          }}
        >
          Action Required
        </span>
      </div>

      <div
        style={{
          overflow: "hidden",
          flex: 1,
          maskImage:
            "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
        }}
      >
        <div
          className="ticker-scroll"
          style={{
            display: "flex",
            gap: "0",
            whiteSpace: "nowrap",
          }}
        >
          {tickerItems.map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-roboto)",
                fontSize: "11px",
                color: "#ddd",
                padding: "0 24px",
                borderRight: "1px solid #333",
                display: "inline-flex",
                alignItems: "center",
                height: "32px",
              }}
            >
              <span
                style={{
                  color: "#aaa",
                  marginRight: "8px",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                [{item.provinces?.[0] ?? "Canada"}]
              </span>
              {item.headline.length > 72
                ? item.headline.slice(0, 72) + "..."
                : item.headline}
            </span>
          ))}
        </div>
      </div>

      <style>{tickerStyles}</style>
    </div>
  );
}
