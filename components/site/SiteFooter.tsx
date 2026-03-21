import Link from "next/link";

export function SiteFooter() {
  return (
    <footer
      style={{
        marginTop: "48px",
        paddingTop: "20px",
        borderTop: "1px solid #e8e6e1",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        maxWidth: "1200px",
        margin: "48px auto 0",
        padding: "20px 32px 32px",
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: "14px",
            fontWeight: 500,
            color: "#1a1a1a",
            marginBottom: "3px",
          }}
        >
          Hillary&apos;s HR Blog 🍁
        </p>
        <p
          style={{
            fontFamily: "var(--font-roboto)",
            fontSize: "10px",
            color: "#aaa",
          }}
        >
          Independent. For informational purposes only. Not legal advice.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          fontSize: "11px",
          fontFamily: "var(--font-roboto)",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{ color: "#888", textDecoration: "none" }}
        >
          News
        </Link>
        <Link
          href="/take"
          style={{ color: "#888", textDecoration: "none" }}
        >
          Hillary&apos;s Take
        </Link>
        <Link
          href="/hr-explained"
          style={{ color: "#888", textDecoration: "none" }}
        >
          HR Explained
        </Link>
        <a
          href="https://linkedin.com/in/hillary-chukwu-"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#888", textDecoration: "none" }}
        >
          LinkedIn
        </a>
        <a
          href="mailto:hillarychukwu92@gmail.com"
          style={{ color: "#888", textDecoration: "none" }}
        >
          Contact
        </a>
      </div>
    </footer>
  );
}
