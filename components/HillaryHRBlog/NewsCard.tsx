"use client";

import { useState } from "react";
import { NewsItem, URGENCY_CONFIG } from "@/lib/types";
import { ProvinceBadge } from "./ProvinceBadge";

export function NewsCard({
  item,
  isBookmarked,
  onBookmark,
}: {
  item: NewsItem;
  isBookmarked: boolean;
  onBookmark: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const urgency = URGENCY_CONFIG[item.urgency];

  return (
    <article
      style={{
        background: "#fff",
        border: "1px solid #e8e6e1",
        borderRadius: "4px",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        cursor: "default",
        position: "relative",
        borderLeft: `3px solid ${urgency.color}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 20px rgba(0,0,0,0.08)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#888",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "var(--font-roboto)",
            }}
          >
            {item.sourceShort}
          </span>
          <span style={{ color: "#ccc", fontSize: "10px" }}>·</span>
          <span
            style={{
              fontSize: "10px",
              color: "#aaa",
              fontFamily: "var(--font-roboto)",
            }}
          >
            {item.date}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "4px",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {item.provinces.map((p) => (
            <ProvinceBadge key={p} province={p} />
          ))}
        </div>
      </div>

      {/* Headline */}
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            color: "inherit",
            cursor: "pointer",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#c0392b";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#1a1a1a";
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: "16px",
              fontWeight: 600,
              color: "#1a1a1a",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {item.headline}
          </h3>
        </a>
      ) : (
        <h3
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: "16px",
            fontWeight: 600,
            color: "#1a1a1a",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {item.headline}
        </h3>
      )}

      {/* Summary */}
      <p
        style={{
          fontFamily: "var(--font-roboto)",
          fontSize: "13px",
          color: "#555",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {item.summary}
      </p>

      {/* Editor note */}
      {item.editorNote && (
        <div
          style={{
            background: "#fafaf8",
            border: "1px solid #e8e6e1",
            borderRadius: "3px",
            padding: "10px 12px",
            display: expanded ? "block" : "none",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: "12.5px",
              color: "#444",
              fontStyle: "italic",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            <span
              style={{
                fontStyle: "normal",
                fontWeight: 700,
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#888",
                marginRight: "6px",
                fontFamily: "var(--font-roboto)",
              }}
            >
              Editor:
            </span>
            {item.editorNote}
          </p>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "8px",
          borderTop: "1px solid #f0ede8",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: "3px",
              backgroundColor: urgency.bg,
              color: urgency.color,
              fontFamily: "var(--font-roboto)",
              letterSpacing: "0.04em",
            }}
          >
            {urgency.label}
          </span>
          <span
            style={{
              fontSize: "10px",
              color: "#aaa",
              background: "#f3f2ef",
              padding: "3px 8px",
              borderRadius: "3px",
              fontFamily: "var(--font-roboto)",
            }}
          >
            {item.topic}
          </span>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "10px",
                color: "#888",
                textDecoration: "none",
                padding: "3px 8px",
                border: "1px solid #e0ded8",
                borderRadius: "3px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "var(--font-roboto)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#f3f2ef";
                (e.currentTarget as HTMLElement).style.borderColor = "#d0cec8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLElement).style.borderColor = "#e0ded8";
              }}
            >
              Read article
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          )}
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {item.editorNote && (
            <button
              onClick={() => setExpanded((v) => !v)}
              style={{
                fontSize: "11px",
                color: "#888",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 4px",
                fontFamily: "var(--font-roboto)",
                textDecoration: "underline",
                textDecorationColor: "#ccc",
              }}
            >
              {expanded ? "Hide note" : "My take →"}
            </button>
          )}
          <button
            onClick={onBookmark}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: isBookmarked ? "#c0392b" : "#ccc",
              transition: "color 0.15s",
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
