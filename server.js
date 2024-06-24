const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = "Devansh-kajve";
const GITHUB_REPO = "Story-video";
const GITHUB_WORKFLOW = "remotion-render.yml";

app.post("/trigger-render", async (req, res) => {
  const { imageUrls } = req.body;

  try {
    const response = await axios.post(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${GITHUB_WORKFLOW}/dispatches`,
      {
        ref: "main",
        inputs: {
          images: JSON.stringify(imageUrls),
        },
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    res.json({ message: "Render triggered successfully" });
  } catch (error) {
    console.error("Error triggering GitHub Action:", error);
    res.status(500).json({ error: "Failed to trigger render" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
