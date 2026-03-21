import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100dvh", background: "#faf9f7", display: "flex", flexDirection: "column" }}>
      <SiteHeader />
      <div style={{ flex: 1 }}>
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
