import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

// Image generation for tab icon/favicon
export default async function Icon() {
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
          src="http://localhost:3000/logo.png"
          alt="WhiteHats Logo"
          style={{
            width: "85%",
            height: "85%",
            objectFit: "contain",
            borderRadius: "50%",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
