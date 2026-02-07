import axios from "axios";

export const sendWaafiPayment = async ({ transactionId, accountNo, amount, description }) => {
  // Trim credentials to avoid whitespace issues
  const merchantUid = (process.env.WAAFI_MERCHANT_UID || "").trim();
  const apiUserId = (process.env.WAAFI_API_USER_ID || "").trim();
  const apiKey = (process.env.WAAFI_API_KEY || "").trim();

  // Reverting to ISO string as it was working before
  const timestamp = new Date().toISOString();

  // Format amount to 2 decimal places (WaafiPay truncates > 2 decimals)
  const formattedAmount = Number(amount).toFixed(2);

  if (formattedAmount === "0.00") {
    return { responseCode: "9999", responseMsg: "Amount too low. Minimum amount is 0.01" };
  }

  // Ensure accountNo starts with 252 (remove + if present)
  if (!accountNo) {
    return { responseCode: "9999", responseMsg: "No account number provided" };
  }
  let cleanAccountNo = accountNo.toString().replace(/\+/g, '').trim();
  if (!cleanAccountNo.startsWith('252') && cleanAccountNo.length === 9) {
    cleanAccountNo = '252' + cleanAccountNo;
  }

  const payload = {
    schemaVersion: "1.0",
    requestId: transactionId,
    timestamp: timestamp,
    channelName: "WEB", // Reverted from "API"
    serviceName: "API_PURCHASE",
    serviceParams: {
      merchantUid: merchantUid,
      apiUserId: apiUserId,
      apiKey: apiKey,
      paymentMethod: "mwallet_account",
      payerInfo: {
        accountNo: cleanAccountNo
      },
      transactionInfo: {
        referenceId: transactionId,
        invoiceId: transactionId,
        amount: formattedAmount,
        currency: "USD",
        description: description
      }
    }
  };

  console.log("Sending WaafiPay Payload:", JSON.stringify(payload, null, 2));

  const response = await axios.post("https://api.waafipay.net/asm", payload);
  return response.data;
};
