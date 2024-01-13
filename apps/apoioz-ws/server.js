console.clear();
const express = require("express");
const crypto = require("crypto");
const WebSocket = require("ws");
const app = express();
const port = process.env.PORT || 5000;

const campaigns = new Map();

const server = new WebSocket.Server({
  server: app.listen(port, () => {
    console.log(
      `
  🔌 Apoioz WebSocket Server
  - Local:        http://localhost:${port}
  - Environments: .env
    `
    );
  }),
});

server.on("connection", (ws) => {
  ws.on("message", (message) => {
    const campaignId = message.toString();

    if (!campaigns.has(campaignId)) {
      campaigns.set(campaignId, new Set());
    }
    campaigns.get(campaignId).add(ws);
  });
  ws.on("close", () => {
    campaigns.forEach((clients) => {
      clients.delete(ws);
    });
  });
});

app.get("/campaign/:campaignId/supporter", (req, res) => {
  const campaignId = `campaign:${req.params.campaignId}`;
  const campaignClients = campaigns.get(campaignId);

  if (campaignClients) {
    campaignClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(campaignId);
      }
    });
  }

  return res.json({ message: "ok" });
});
