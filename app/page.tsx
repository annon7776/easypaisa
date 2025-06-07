import { Shield, Info, Eye, AlertTriangle } from "lucide-react"

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Shield className="mr-2 text-orange-600" />📱 Installation Instructions
      </h3>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
          <h4 className="font-semibold text-gray-800 mb-2">Step 1: Enable Unknown Sources</h4>
          <p className="text-gray-600 text-sm">
            Go to Settings → Security → Enable "Install from Unknown Sources" or "Allow from this source"
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
          <h4 className="font-semibold text-gray-800 mb-2">Step 2: Download & Install</h4>
          <p className="text-gray-600 text-sm">
            Click the download button above and wait for the APK file to download completely
          </p>
        </div>

        {/* Step 3 - Google Play Protect Warning */}
        <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
          <h4 className="font-semibold text-gray-800 mb-2">⚠️ Step 3: Handle Security Warning</h4>
          <div className="bg-red-50 p-3 rounded-lg mb-3">
            <p className="text-red-800 font-medium text-sm mb-2">
              If you see "Harmful app blocked" or "Google Play Protect" warning:
            </p>
            <ol className="text-red-700 text-sm space-y-1 ml-4">
              <li>
                1. Click on <strong>"More details"</strong> ⬇️
              </li>
              <li>
                2. Then click <strong>"Install anyway"</strong> ✅
              </li>
              <li>
                3. Confirm by clicking <strong>"Install"</strong>
              </li>
            </ol>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Info className="w-4 h-4" />
            <span>This warning appears because the app is not from Google Play Store. Our app is safe to install.</span>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
          <h4 className="font-semibold text-gray-800 mb-2">Step 4: Complete Installation</h4>
          <p className="text-gray-600 text-sm">Wait for installation to complete, then open the app and enjoy! 🎉</p>
        </div>
      </div>

      {/* Visual Guide */}
      <div className="mt-6 bg-white p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Eye className="mr-2 text-blue-600" />
          Visual Guide for Security Warning:
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="bg-red-100 p-3 rounded-lg mb-2">
              <p className="text-sm font-medium text-red-800">When you see this warning:</p>
              <p className="text-xs text-red-600 mt-1">"Harmful app blocked" or "Google Play Protect"</p>
            </div>
            <div className="text-xs text-gray-600">⬇️ Click "More details" first</div>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-lg mb-2">
              <p className="text-sm font-medium text-green-800">Then you'll see:</p>
              <p className="text-xs text-green-600 mt-1">"Install anyway" button</p>
            </div>
            <div className="text-xs text-gray-600">✅ Click "Install anyway" to proceed</div>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
          <AlertTriangle className="mr-2" />
          Still Having Issues?
        </h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Make sure you have enough storage space (at least 50MB)</li>
          <li>• Try restarting your phone and installing again</li>
          <li>• Contact our support team if the problem persists</li>
        </ul>
      </div>
    </div>
  )
}
