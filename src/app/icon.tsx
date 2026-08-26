import fs from "fs";
import { ImageResponse } from "next/og";
import path from "path";

// Route segment config
export const runtime = "nodejs";

// Image metadata
export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

// Image generation for tab icon/favicon
export default async function Icon() {
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logoBuffer = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "20%",
          overflow: "hidden",
          background: "#030712",
          border: "2px solid #0088ff",
          boxShadow: "0 0 10px rgba(0, 136, 255, 0.5)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoBase64}
          alt="WhiteHats Logo"
          width="54"
          height="54"
          style={{
            width: "85%",
            height: "85%",
            objectFit: "contain",
            borderRadius: "30%",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
