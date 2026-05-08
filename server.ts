import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.use(express.json());

  // API Proxy Routes to avoid Mixed Content errors
  app.get("/api/iss-now", async (req, res) => {
    try {
      const response = await axios.get(
        "http://api.open-notify.org/iss-now.json",
        { headers: { 'User-Agent': 'Space-Dashboard-App/1.0' } }
      );
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ISS location" });
    }
  });

  app.get("/api/astros", async (req, res) => {
    try {
      const response = await axios.get(
        "http://api.open-notify.org/astros.json",
        { headers: { 'User-Agent': 'Space-Dashboard-App/1.0' } }
      );
      res.json(response.data);
    } catch (error: any) {
      console.error("Astros proxy error:", error.message, error.response?.data);
      res.status(500).json({ error: "Failed to fetch astronauts", details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files from dist
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
