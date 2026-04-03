import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(join(__dirname, "public")));

// Signed URL endpoint pro ElevenLabs Conversational AI session
app.get("/api/signed-url", async (_req, res) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;

  if (!apiKey || !agentId) {
    return res.status(500).json({ error: "Missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID" });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      { headers: { "xi-api-key": apiKey } }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("ElevenLabs API error:", response.status, text);
      return res.status(response.status).json({ error: "ElevenLabs API error" });
    }

    const data = await response.json();
    res.json({ signed_url: data.signed_url });
  } catch (err) {
    console.error("Signed URL error:", err);
    res.status(500).json({ error: "Failed to get signed URL" });
  }
});

app.listen(PORT, () => {
  console.log(`Albert Voice Widget running at http://localhost:${PORT}`);
});
