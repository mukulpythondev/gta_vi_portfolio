import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { art } from "@/lib/art";

export const alt = "Mukul Rana - GenAI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Hero key art as a data URL, read at build time. Null falls back to the drawn sunset. */
function backdrop() {
  const file = art("art/og/default");
  if (!file) return null;
  const data = fs.readFileSync(path.join(process.cwd(), "public", file));
  return `data:image/jpeg;base64,${data.toString("base64")}`;
}

export default function OpenGraphImage() {
  const image = backdrop();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #2b1055 0%, #d53369 58%, #ff9a3c 76%, #12061f 76%, #07050d 100%)",
        color: "#f4f0ff",
        display: "flex",
        flexDirection: "column",
        padding: "60px 80px",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {image ? (
        <>
          <img src={image} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, objectFit: "cover" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              background: "linear-gradient(90deg, rgba(7,5,13,0.92) 0%, rgba(7,5,13,0.6) 38%, rgba(7,5,13,0) 62%)",
            }}
          />
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            left: 760,
            top: 170,
            width: 300,
            height: 300,
            borderRadius: 300,
            background: "linear-gradient(180deg, #fff2a8, #ffb238 45%, #ff2e88)",
            display: "flex",
          }}
        />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#ffe1f0" }}>
        <span>SOLARA COAST / PERSONAL PORTFOLIO</span>
        {!image && <span>VOL. 01</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 120, fontWeight: 800, lineHeight: 0.95, fontStyle: "italic" }}>
        <span>MUKUL</span>
        <span style={{ color: "#18f0ff" }}>RANA.</span>
      </div>
      <div style={{ display: "flex", fontSize: 26, justifyContent: "space-between", color: "#ffd59a" }}>
        <span>GENAI ENGINEER</span>
        {!image && <span>BACKENDS / PRODUCTS / AI FEATURES</span>}
      </div>
    </div>,
    size,
  );
}
