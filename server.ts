import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Gemini API setup
const aiClient = process.env.GEMINI_API_KEY 
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) 
  : null;

// API Routes
app.post("/api/hsn-code", async (req, res) => {
  const { itemName } = req.body;
  
  if (!aiClient) {
    return res.status(503).json({ error: "Gemini API key not configured on server" });
  }

  if (!itemName || itemName.length < 3) {
    return res.status(400).json({ error: "Item name too short" });
  }

  try {
    const prompt = `Find the 4, 6 or 8 digit HSN (Harmonized System of Nomenclature) code for the following item: "${itemName}". Return ONLY the numeric code. If you are unsure, return a plausible 4-digit code.`;

    const result = await aiClient.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hsnCode: {
              type: Type.STRING,
            },
          },
          required: ["hsnCode"],
        },
      },
    });

    const data = JSON.parse(result.text || '{}');
    res.json({ hsnCode: data.hsnCode || null });
  } catch (error) {
    console.error("Error fetching HSN code:", error);
    res.status(500).json({ error: "Failed to fetch HSN code" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
