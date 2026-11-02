import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Roam Travel — visa assistance, flights, hotels and car rental. Karachi, Pakistan.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const photo = await readFile(join(process.cwd(), "public/images/hero.jpg"));
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#faf9f6",
        color: "#26362b",
      }}
    >
      <div
        style={{
          width: "57%",
          display: "flex",
          flexDirection: "column",
          padding: "58px 55px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 54, fontWeight: 700, display: "flex" }}>
          * roam.
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 62, letterSpacing: -3, lineHeight: 1.07 }}>
            Your next chapter starts here.
          </div>
          <div style={{ fontSize: 22, marginTop: 26, color: "#626d59" }}>
            Visa assistance. Flights. Hotels. Car rental.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            background: "#d6ee8b",
            padding: "15px 22px",
            borderRadius: 8,
            fontSize: 20,
            alignSelf: "flex-start",
          }}
        >
          Karachi, Pakistan · Explore with Roam
        </div>
      </div>
      <img
        src={`data:image/jpeg;base64,${photo.toString("base64")}`}
        alt="Italian Riviera"
        width={516}
        height={630}
        style={{ objectFit: "cover" }}
      />
    </div>,
    size,
  );
}
