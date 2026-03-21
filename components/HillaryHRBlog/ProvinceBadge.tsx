import { PROVINCE_COLORS } from "@/lib/types";

export function ProvinceBadge({ province }: { province: string }) {
  const colors = PROVINCE_COLORS[province as keyof typeof PROVINCE_COLORS] || {
    bg: "#f3f2ef",
    text: "#555",
  };

  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize: "10px",
        fontWeight: 700,
        padding: "2px 6px",
        borderRadius: "4px",
        letterSpacing: "0.04em",
        fontFamily: "var(--font-roboto)",
      }}
    >
      {province}
    </span>
  );
}
