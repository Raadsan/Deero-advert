import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/check-domain", async (req, res) => {
  const { domain } = req.query;

  if (!domain) return res.status(400).json({ message: "Domain is required" });

  try {
    const domainLower = domain.toLowerCase().trim();

    // OTE endpoint
    const response = await fetch(
      `https://api.ote-godaddy.com/v1/domains/available?domain=${domainLower}`,
      {
        headers: {
          Authorization: `sso-key ${process.env.GODADDY_KEY}:${process.env.GODADDY_SECRET}`,
        },
      }
    );

    const data = await response.json();

    res.json({
      domain: domainLower,
      available: data.available,
      price: data.price ? data.price / 1000000 : null,
      currency: data.currency
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Domain check failed" });
  }
});

export default router;
