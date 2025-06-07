"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Phone, Clock, CheckCircle, ArrowLeft, Send, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CallbackRequestProps {
  onBack: () => void
  onClose: () => void
}

export function CallbackRequest({ onBack, onClose }: CallbackRequestProps) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    preferredTime: "",
    urgency: "",
    issue: "",
    description: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Callback Request Submitted",
        description: "Our support team will contact you within the specified time frame.",
      })

      setSubmitted(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit callback request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-lg shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mx-auto">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <CardTitle className="text-xl text-gray-800">Callback Request Submitted!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-emerald-900">What happens next?</h3>
            </div>
            <div className="space-y-2 text-sm text-emerald-700">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Our support team has received your callback request</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  You will receive a call at <strong>{formData.phone}</strong>
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  Expected callback time: <strong>{formData.preferredTime}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <p className="font-semibold text-blue-900 text-sm">Reference ID</p>
            </div>
            <p className="text-lg font-mono text-blue-800 bg-white p-2 rounded border">
              CB-{Date.now().toString().slice(-6)}
            </p>
            <p className="text-xs text-blue-600 mt-2">Save this reference ID for future inquiries</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Support
            </Button>
            <Button onClick={onClose} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md bg-white/95 backdrop-blur-lg shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
            <Phone className="h-5 w-5 text-emerald-600" />
            Request Callback
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Fill out the form below and our support team will call you back at your preferred time.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number *
            </Label>
            <Input
              id="phone"
              placeholder="03XX-XXXXXXX"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="preferredTime" className="text-sm font-medium">
              Preferred Callback Time *
            </Label>
            <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange("preferredTime", value)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select preferred time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="within-1-hour">Within 1 hour</SelectItem>
                <SelectItem value="within-2-hours">Within 2 hours</SelectItem>
                <SelectItem value="within-4-hours">Within 4 hours</SelectItem>
                <SelectItem value="today-evening">Today evening (6-8 PM)</SelectItem>
                <SelectItem value="tomorrow-morning">Tomorrow morning (9-11 AM)</SelectItem>
                <SelectItem value="tomorrow-afternoon">Tomorrow afternoon (2-4 PM)</SelectItem>
                <SelectItem value="tomorrow-evening">Tomorrow evening (6-8 PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="urgency" className="text-sm font-medium">
              Issue Priority *
            </Label>
            <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Low - General inquiry
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Medium - Card activation issue
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    High - Account access problem
                  </div>
                </SelectItem>
                <SelectItem value="urgent">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Urgent - Security concern
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="issue" className="text-sm font-medium">
              Issue Category *
            </Label>
            <Select value={formData.issue} onValueChange={(value) => handleInputChange("issue", value)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select issue category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card-activation">ATM Card Activation</SelectItem>
                <SelectItem value="app-approval">App Approval Issues</SelectItem>
                <SelectItem value="otp-problems">OTP Not Received</SelectItem>
                <SelectItem value="account-balance">Account Balance Issues</SelectItem>
                <SelectItem value="transaction-problems">Transaction Problems</SelectItem>
                <SelectItem value="technical-support">Technical Support</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Issue Description
            </Label>
            <Textarea
              id="description"
              placeholder="Please describe your issue in detail..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>

        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-700">
              <p className="font-medium mb-1">Important Notes:</p>
              <ul className="space-y-1">
                <li>• Ensure your phone is available at the selected time</li>
                <li>• High priority issues will be addressed first</li>
                <li>• You'll receive an SMS confirmation</li>
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !formData.name ||
              !formData.phone ||
              !formData.preferredTime ||
              !formData.urgency ||
              !formData.issue ||
              loading
            }
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Request Callback
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
