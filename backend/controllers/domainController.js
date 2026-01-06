import Domain from "../models/domainModel.js";
import Transaction from "../models/TransactionModel.js";
import User from "../models/UserModel.js";


// Register Domain
export const registerDomain = async (req, res) => {
  try {
    const { userId, domainName } = req.body;
    console.log("Register Domain Request Body:", JSON.stringify(req.body, null, 2));

    if (!userId || !domainName) {
      console.log("Register Domain Validation Failed: userId or domainName missing");
      return res.status(400).json({ message: "userId and domainName are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let domain = await Domain.findOne({ name: domainName.toLowerCase() });

    if (domain && domain.status === "registered") {
      return res.status(400).json({ message: "Domain already registered" });
    }

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    if (domain) {
      domain.status = "registered";
      domain.user = userId;
      domain.registrationDate = new Date();
      domain.expiryDate = expiryDate;
    } else {
      domain = new Domain({
        name: domainName,
        user: userId,
        status: "registered",
        registrationDate: new Date(),
        expiryDate,
      });
    }

    await domain.save();

    const populatedDomain = await Domain.findById(domain._id).populate("user", "fullname email");

    res.json({ message: "Domain registered successfully", domain: populatedDomain });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Transfer Domain
export const transferDomain = async (req, res) => {
  try {
    const { domainName, newUserId } = req.body;

    const domain = await Domain.findOne({ name: domainName.toLowerCase() });
    if (!domain || domain.status !== "registered") {
      return res.status(404).json({ message: "Domain not found or not registered" });
    }

    const newUser = await User.findById(newUserId);
    if (!newUser) return res.status(404).json({ message: "New user not found" });

    domain.user = newUserId;
    domain.status = "transferred";
    await domain.save();

    const populatedDomain = await Domain.findById(domain._id).populate("user", "fullname email");

    res.json({ message: "Domain transferred successfully", domain: populatedDomain });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Renew Domain
export const renewDomain = async (req, res) => {
  try {
    const { domainName } = req.body;

    const domain = await Domain.findOne({ name: domainName.toLowerCase() });
    if (!domain || domain.status !== "registered") {
      return res.status(404).json({ message: "Domain not found or not registered" });
    }

    domain.expiryDate.setFullYear(domain.expiryDate.getFullYear() + 1);
    await domain.save();

    const populatedDomain = await Domain.findById(domain._id).populate("user", "fullname email");

    res.json({ message: "Domain renewed successfully", domain: populatedDomain });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Domains
export const getAllDomains = async (req, res) => {
  try {
    const domains = await Domain.find()
      .populate("user", "fullname email")
      .sort({ createdAt: -1 });

    res.json({ success: true, domains });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Domains by User
export const getDomainsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching domains for userId:", userId);
    const domains = await Domain.find({ user: userId })
      .populate("user", "fullname email")
      .sort({ createdAt: -1 });

    console.log(`Found ${domains.length} domains for userId: ${userId}`);
    res.json({ success: true, domains });
  } catch (err) {
    console.error("Get domains by user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
