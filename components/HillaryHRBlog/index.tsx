"use client";

import { useState, useEffect } from "react";
import { NewsItem, TOPICS, PROVINCES } from "@/lib/types";
import { NewsCard } from "./NewsCard";
import { Ticker } from "./Ticker";
import { Sidebar } from "./Sidebar";

interface HillaryHRBlogProps {
  items: NewsItem[];
}

export default function HillaryHRBlog({ items }: HillaryHRBlogProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "urgency">("date");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("hillary_bookmarks");
    if (saved) {
      try {
        setBookmarkedIds(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("hillary_bookmarks", JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  const filtered = items
    .filter((item) => {
      if (showBookmarksOnly && !bookmarkedIds.includes(item.id)) return false;
      if (selectedTopics.length > 0 && !selectedTopics.includes(item.topic))
        return false;
      if (
        selectedProvinces.length > 0 &&
        !item.provinces.some((p) => selectedProvinces.includes(p))
      )
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !item.headline.toLowerCase().includes(q) &&
          !item.summary.toLowerCase().includes(q) &&
          !item.source.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "urgency") {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.urgency] - order[b.urgency];
      }
      return 0;
    });

  const toggleBookmark = (id: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .filter-chip {
          border: 1px solid #e0ded8;
          background: #fff;
          color: #666;
          padding: 4px 10px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          font-family: var(--font-roboto);
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .filter-chip:hover { background: #f3f2ef; color: #333; }
        .filter-chip:focus-visible {
          outline: 2px solid #c0392b;
          outline-offset: 2px;
        }
        .filter-chip.active {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .filter-chip.active.province { background: #1a3060; border-color: #1a3060; }

        @media (max-width: 900px) {
          .main-layout { flex-direction: column !important; }
          .sidebar-col { width: 100% !important; flex-direction: row !important; flex-wrap: wrap !important; }
        }
        @media (max-width: 600px) {
          .news-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Province filter nav (home page only) */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8e6e1",
        }}
      >
        <nav
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            gap: "24px",
            overflowX: "auto",
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedProvinces([])}
            style={{
              fontFamily: "var(--font-roboto)",
              fontSize: "12px",
              fontWeight: 500,
              color: selectedProvinces.length === 0 ? "#c0392b" : "#555",
              background: "none",
              border: "none",
              padding: "10px 0",
              borderBottom:
                selectedProvinces.length === 0
                  ? "2px solid #c0392b"
                  : "2px solid transparent",
              whiteSpace: "nowrap",
              transition: "color 0.15s",
              cursor: "pointer",
            }}
          >
            All Updates
          </button>
          {[
            { label: "Federal", value: "Federal" },
            { label: "Ontario", value: "ON" },
            { label: "BC", value: "BC" },
            { label: "Alberta", value: "AB" },
            { label: "Québec", value: "QC" },
          ].map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setSelectedProvinces((prev) =>
                  prev.includes(value) ? [] : [value]
                )
              }
              style={{
                fontFamily: "var(--font-roboto)",
                fontSize: "12px",
                fontWeight: 500,
                color: selectedProvinces.includes(value) ? "#c0392b" : "#555",
                background: "none",
                border: "none",
                padding: "10px 0",
                borderBottom: selectedProvinces.includes(value)
                  ? "2px solid #c0392b"
                  : "2px solid transparent",
                whiteSpace: "nowrap",
                transition: "color 0.15s",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Ticker */}
      <Ticker items={items} />

      {/* Body */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 32px" }}>
        {/* Search + Sort bar */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "20px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
            <svg
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#aaa",
                pointerEvents: "none",
              }}
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search updates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 12px 7px 30px",
                border: "1px solid #e0ded8",
                borderRadius: "3px",
                fontSize: "12px",
                fontFamily: "var(--font-roboto)",
                outline: "none",
                background: "#fff",
                color: "#333",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span
              style={{
                fontSize: "10px",
                color: "#aaa",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Sort:
            </span>
            {(["date", "urgency"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`filter-chip ${sortBy === s ? "active" : ""}`}
                style={{ textTransform: "capitalize" }}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowBookmarksOnly((v) => !v)}
            className={`filter-chip ${showBookmarksOnly ? "active" : ""}`}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill={showBookmarksOnly ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Saved ({bookmarkedIds.length})
            </span>
          </button>
        </div>

        {/* Topic filters */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginBottom: "8px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: "#aaa",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginRight: "2px",
            }}
          >
            Topic:
          </span>
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() =>
                setSelectedTopics((prev) =>
                  prev.includes(topic)
                    ? prev.filter((t) => t !== topic)
                    : [...prev, topic]
                )
              }
              className={`filter-chip ${selectedTopics.includes(topic) ? "active" : ""}`}
            >
              {topic}
            </button>
          ))}
          {selectedTopics.length > 0 && (
            <button
              onClick={() => setSelectedTopics([])}
              style={{
                fontSize: "10px",
                color: "#c0392b",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-roboto)",
                textDecoration: "underline",
                padding: "0 4px",
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Province filters */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginBottom: "24px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: "#aaa",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginRight: "2px",
            }}
          >
            Province:
          </span>
          {PROVINCES.map((province) => (
            <button
              key={province}
              onClick={() =>
                setSelectedProvinces((prev) =>
                  prev.includes(province)
                    ? prev.filter((p) => p !== province)
                    : [...prev, province]
                )
              }
              className={`filter-chip ${selectedProvinces.includes(province) ? "active province" : ""}`}
            >
              {province}
            </button>
          ))}
        </div>

        {/* Main layout: cards + sidebar */}
        <div
          className="main-layout"
          style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}
        >
          {/* Cards */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: "11px",
                color: "#aaa",
                fontFamily: "var(--font-roboto)",
                marginBottom: "14px",
              }}
            >
              {filtered.length} update{filtered.length !== 1 ? "s" : ""}
              {selectedTopics.length > 0 || selectedProvinces.length > 0
                ? " (filtered)"
                : " available"}
            </p>

            <div
              className="news-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              {filtered.map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  isBookmarked={bookmarkedIds.includes(item.id)}
                  onBookmark={() => toggleBookmark(item.id)}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#aaa",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-newsreader)",
                    fontSize: "18px",
                    marginBottom: "8px",
                    color: "#888",
                  }}
                >
                  No updates found
                </p>
                <p style={{ fontSize: "12px", fontFamily: "var(--font-roboto)" }}>
                  Adjust your filters or check back after tonight&apos;s refresh.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div id="about-sidebar">
            <Sidebar items={items} />
          </div>
        </div>
      </main>
    </>
  );
}
