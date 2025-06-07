"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Mail, AlertTriangle, CreditCard, ExternalLink } from "lucide-react"

interface ApprovalConfirmationProps {
  onBackToInstructions: () => void
  onGoToWebsite: () => void
}

export function ApprovalConfirmation({ onBackToInstructions, onGoToWebsite }: ApprovalConfirmationProps) {
  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mb-4 inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mx-auto">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <CardTitle className="text-3xl text-gray-800">Approval Confirmed!</CardTitle>
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 mt-2">
          <CheckCircle className="w-4 h-4 mr-1" />
          Thank you for approving the request
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold text-emerald-900">Email Confirmation</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
              <p className="text-sm text-emerald-700">
                <strong>If you have approved all pending approvals</strong> that are currently pending in your Easypaisa
                app, you will shortly receive an email confirmation of your ATM card activation.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
              <p className="text-sm text-emerald-700">
                Please check your registered email address for the activation confirmation within the next 10-15
                minutes.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-amber-900">Important Notice</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-600 rounded-full mt-2"></div>
              <p className="text-sm text-amber-700">
                <strong>Temporary Hold:</strong> For activation confirmation, Easypaisa may temporarily hold a random
                amount from your account.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-600 rounded-full mt-2"></div>
              <p className="text-sm text-amber-700">
                This hold is only for verification purposes and will be released back to your account within 24-48
                hours.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-600 rounded-full mt-2"></div>
              <p className="text-sm text-amber-700">
                The held amount will not affect your available balance for regular transactions.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Next Steps</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <p className="text-sm text-blue-700">Wait for email confirmation (10-15 minutes)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <p className="text-sm text-blue-700">Check for any temporary hold notification in your account</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <p className="text-sm text-blue-700">Your ATM card will be fully activated and ready to use</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 mb-3 text-center">
            For more information about Easypaisa services and account management:
          </p>
          <div className="text-center">
            <Button onClick={onGoToWebsite} className="bg-blue-600 hover:bg-blue-700">
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Easypaisa.com.pk
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBackToInstructions} className="flex-1">
            Back to Instructions
          </Button>
          <Button onClick={onGoToWebsite} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            Go to Easypaisa
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
