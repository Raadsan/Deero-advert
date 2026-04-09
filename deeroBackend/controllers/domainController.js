import axios from "axios";

export const checkDomainAvailability = async (req, res) => {
  try {
    const domain = req.query.domain?.trim();

    if (!domain) {
      return res.status(400).json({ success: false, message: "Domain is required" });
    }

    if (!/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(domain)) {
      return res.status(400).json({ success: false, message: "Enter a valid domain like example.com" });
    }

    const apiKey = process.env.WHOISXML_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ success: false, message: "Missing API key in backend configuration" });
    }

    const url = `https://domain-availability.whoisxmlapi.com/api/v1?apiKey=${apiKey}&domainName=${encodeURIComponent(domain)}&outputFormat=JSON`;

    const response = await axios.get(url);
    const data = response.data;
    const availability = data?.DomainInfo?.domainAvailability;

    return res.json({
      success: true,
      result: {
        domain,
        available: availability === "AVAILABLE",
        unavailable: availability === "UNAVAILABLE",
        status: availability || "UNKNOWN",
      },
    });
  } catch (error) {
    console.error("Domain check error details:", error.message);
    return res.status(500).json({ success: false, message: "Failed to check domain availability." });
  }
};
