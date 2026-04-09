import axios from "axios";

export const sendWaafiPayment = async ({ transactionId, accountNo, amount, description }) => {
  const merchantUid = (process.env.WAAFI_MERCHANT_UID || "").trim();
  const apiUserId = (process.env.WAAFI_API_USER_ID || "").trim();
  const apiKey = (process.env.WAAFI_API_KEY || "").trim();

  const timestamp = new Date().toISOString();
  const formattedAmount = Number(amount).toFixed(2);

  if (formattedAmount === "0.00") {
    return { responseCode: "9999", responseMsg: "Amount too low. Minimum amount is 0.01" };
  }

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
    channelName: "WEB",
    serviceName: "API_PURCHASE",
    serviceParams: {
      merchantUid: merchantUid,
      apiUserId: apiUserId,
      apiKey: apiKey,
      paymentMethod: "mwallet_account",
      payerInfo: { accountNo: cleanAccountNo },
      transactionInfo: {
        referenceId: transactionId,
        invoiceId: transactionId,
        amount: formattedAmount,
        currency: "USD",
        description: description
      }
    }
  };

  const response = await axios.post("https://api.waafipay.net/asm", payload);
  return response.data;
};
