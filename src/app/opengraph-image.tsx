import { ImageResponse } from "next/og";

export const alt = "Morning Operator automation and SEO foundation workbench";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: "#e8f1f3",
        color: "#102f46",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ fontSize: 25, letterSpacing: 2 }}>MORNING OPERATOR</strong>
        <span style={{ padding: "12px 18px", background: "#d7982d", border: "3px solid #102f46", fontSize: 18 }}>
          OPEN SOURCE
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
        <span style={{ color: "#087a78", fontSize: 24, letterSpacing: 3 }}>AUTOMATION × SEO FOUNDATION</span>
        <div style={{ marginTop: 18, fontSize: 72, lineHeight: 1.02, fontWeight: 800 }}>
          Useful systems. Searchable expertise. Human approval.
        </div>
      </div>
      <div style={{ display: "flex", gap: 18, fontSize: 20 }}>
        <span>4 public locales</span><span>·</span><span>Fixed scope</span><span>·</span><span>No outcome guarantees</span>
      </div>
    </div>,
    size
  );
}
