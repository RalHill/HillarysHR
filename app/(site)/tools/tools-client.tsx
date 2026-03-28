'use client'

import Link from "next/link";
import { useState } from "react";

const tools = [
  {
    name: "Boolean Search String Generator",
    description: "Build precision search strings for LinkedIn, ATS, and Google X-Ray. Select a role template or build from scratch.",
    href: "/tools/boolean-generator",
    icon: "🔍",
  },
  {
    name: "PTO & Leave Calculator",
    description: "Model vacation and leave entitlements by province, employment type, and tenure across all 13 Canadian jurisdictions.",
    href: "/tools/pto-calculator",
    icon: "📅",
  },
  {
    name: "Severance Pay Estimator",
    description: "Estimate Ontario ESA minimum severance pay and common law range for a termination without cause.",
    href: "/tools/severance-estimator",
    icon: "💰",
  },
  {
    name: "Statutory Holiday Pay Calculator",
    description: "Complete list of 2026 Canadian statutory holidays by province. Includes pay formula, qualifying rules, and estimated holiday pay.",
    href: "/tools/stat-holiday-calculator",
    icon: "🇨🇦",
  },
];

export default function ToolsPageClient() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="tool-page">
      <div className="tool-page-inner" style={{ paddingBottom: "3rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#aaa",
            marginBottom: "16px",
          }}
        >
          Free HR Tools
        </div>
        <h1 className="tool-h1">
          Useful HR Tools
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            maxWidth: "600px",
            lineHeight: 1.6,
          }}
        >
          Canadian HR calculators, search builders, and compliance tools. Practical logic for practitioners.
        </p>
      </div>

      {/* Tools Grid - Single Column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {tools.map((tool, index) => (
          <Link
            key={tool.href}
            href={tool.href}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e8e6e1",
                borderRadius: "8px",
                padding: "24px",
                display: "flex",
                alignItems: "flex-start",
                gap: "20px",
                transition: "all 0.2s ease",
                cursor: "pointer",
                boxShadow: hoveredId === index ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
                transform: hoveredId === index ? "translateY(-2px)" : "translateY(0)",
              }}
              onMouseEnter={() => setHoveredId(index)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Icon */}
              <div
                style={{
                  fontSize: "32px",
                  flexShrink: 0,
                }}
              >
                {tool.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    fontFamily: "var(--font-newsreader)",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#1a1a1a",
                    margin: "0 0 8px 0",
                  }}
                >
                  {tool.name}
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#666",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {tool.description}
                </p>
              </div>

              {/* Arrow */}
              <div
                style={{
                  fontSize: "16px",
                  color: "#c0392b",
                  fontWeight: 600,
                  flexShrink: 0,
                  transition: "transform 0.2s ease",
                }}
              >
                →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer note */}
      <div
        style={{
          marginTop: "48px",
          padding: "16px",
          background: "#f9f8f6",
          border: "1px solid #e8e6e1",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#aaa",
          textAlign: "center",
        }}
      >
        Not legal or financial advice. Verify calculations with qualified professionals before relying on them.
      </div>
      </div>
    </div>
  );
}
