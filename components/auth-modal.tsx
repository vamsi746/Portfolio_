"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Eye, EyeOff, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  title?: string
}

const ADMIN_PASSWORD = "vamsi2024"

export default function AuthModal({ isOpen, onClose, onSuccess, title = "Admin Access Required" }: AuthModalProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  if (!isOpen) return null

  const handleLogin = () => {
    setIsLoading(true)

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        onSuccess()
        onClose()
        setPassword("")
        toast({
          title: "Access Granted",
          description: "You can now edit this section.",
        })
      } else {
        toast({
          title: "Access Denied",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleClose = () => {
    setPassword("")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-md bg-gray-900/95 border-gray-700">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute right-2 top-2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center justify-center gap-2 text-white">
            <Lock className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400 text-center text-sm">Enter password to enable edit mode for this section</p>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              className="bg-gray-800 border-gray-600 text-white pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleLogin}
              disabled={isLoading || !password}
              className="flex-1 bg-gray-700 hover:bg-gray-600"
            >
              {isLoading ? "Verifying..." : "Access"}
            </Button>
            <Button onClick={handleClose} variant="outline" className="flex-1 border-gray-600 text-gray-300">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
