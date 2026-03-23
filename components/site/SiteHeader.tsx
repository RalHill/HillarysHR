import Link from "next/link";

const NAV_LINKS = [
  { label: "All Updates", href: "/" },
  { label: "Hillary's Take", href: "/take" },
  { label: "HR Explained", href: "/hr-explained" },
  { label: "Useful HR Tools", href: "/tools" },
];

export function SiteHeader() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      style={{
        background: "#fff",
        borderBottom: "3px solid #1a1a1a",
        padding: "0",
      }}
    >
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 32px 0" }}
      >
        {/* Masthead row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingBottom: "16px",
            borderBottom: "1px solid #e8e6e1",
            marginBottom: "16px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <p
              style={{
                fontFamily: "var(--font-roboto)",
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#c0392b",
                fontWeight: 700,
                marginBottom: "6px",
              }}
            >
              Canadian Employment Law &amp; HR Intelligence
            </p>
            <h1
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: "48px",
                fontWeight: 300,
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Hillary&apos;s HR Blog 🍁
            </h1>
          </Link>

          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: "11px",
                color: "#aaa",
                fontFamily: "var(--font-roboto)",
                marginBottom: "2px",
              }}
            >
              {currentDate}
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "#aaa",
                fontFamily: "var(--font-roboto)",
              }}
            >
              Updated daily
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav
          style={{
            display: "flex",
            gap: "24px",
            paddingBottom: "0",
            overflowX: "auto",
          }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "var(--font-roboto)",
                fontSize: "12px",
                fontWeight: 500,
                color: "#555",
                textDecoration: "none",
                padding: "8px 0",
                borderBottom: "2px solid transparent",
                whiteSpace: "nowrap",
                transition: "color 0.15s",
                display: "inline-block",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
