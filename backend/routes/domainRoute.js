import express from "express";
import DomainSearch from "../models/DomainSearch.js";

const router = express.Router();

const takenDomains = ["google.com"]; // .com mar walba taken
const extensions = [".com", ".net", ".org", ".edu"];

router.get("/check", async (req, res) => {
  let { domain } = req.query;

  if (!domain) {
    return res.status(400).json({
      success: false,
      message: "Domain is required",
    });
  }

  // Remove existing extensions if user typed one
  domain = domain.replace(/\.(com|net|org|edu)$/i, "");

  const results = extensions.map((ext) => {
    const fullDomain = domain + ext;

    // .com had iyo jeer unavailable
    let available;
    if (ext === ".com") {
      available = false;
    } else {
      available = !takenDomains.includes(fullDomain.toLowerCase());
    }

    return {
      domain: fullDomain,
      available,
      price: available ? "$14.99 / Year" : null,
    };
  });

  // Save to DB
  try {
    const saveData = results.map((r) => ({ domain: r.domain, available: r.available }));
    await DomainSearch.insertMany(saveData);
  } catch (error) {
    console.error(error.message);
  }

  res.json({ success: true, results });
});

export default router;
