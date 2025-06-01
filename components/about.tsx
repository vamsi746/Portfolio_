"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AuthModal from "./auth-modal"

export default function About() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<() => void>(() => {})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [aboutData, setAboutData] = useState({
    title: "About Me",
    description:
      "Motivated B.Tech student specializing in Computer Science and Engineering with strong skills in Python, Java, and AWS cloud technologies. Eager to apply technical knowledge and gain practical experience through a challenging internship opportunity.",
  })

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const requireAuth = (action: () => void) => {
    if (isAuthenticated) {
      action()
    } else {
      setPendingAction(() => action)
      setShowAuthModal(true)
    }
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    pendingAction()
  }

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Information Updated",
      description: "Your about section has been updated successfully.",
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <section id="about" className="py-16 md:py-24 bg-gray-900/50">
      <div className="container max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2 text-white">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mb-6"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700 text-white hover:shadow-xl hover:shadow-gray-900/20 transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-100">{aboutData.title}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => requireAuth(() => setIsEditing(!isEditing))}
                className="text-gray-400 hover:text-white hover:bg-gray-700 hover:scale-110 transition-all duration-300"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={aboutData.description}
                    onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    rows={4}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-300"
                    >
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:scale-105 transition-all duration-300"
                    >
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-gray-300 leading-relaxed">{aboutData.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          title="Edit About Section"
        />
      </div>
    </section>
  )
}
