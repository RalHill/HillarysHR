"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#faf9f7",
        padding: "20px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "500px" }}>
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: "32px",
            color: "#1a1a1a",
            marginBottom: "12px",
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            fontFamily: "var(--font-roboto)",
            fontSize: "14px",
            color: "#666",
            marginBottom: "24px",
            lineHeight: 1.6,
          }}
        >
          We had trouble loading the news feed. Please try again.
        </p>
        <button
          onClick={() => reset()}
          style={{
            background: "#1a1a1a",
            color: "#fff",
            border: "none",
            padding: "10px 24px",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-roboto)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#c0392b";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#1a1a1a";
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
