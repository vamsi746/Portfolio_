"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Edit,
  Save,
  X,
  Camera,
  Download,
  FileText,
  ExternalLink,
  User,
  MapPin,
  GraduationCap,
  Target,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AuthModal from "./auth-modal"
import Image from "next/image"

export default function About() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingPhoto, setIsEditingPhoto] = useState(false)
  const [isEditingResume, setIsEditingResume] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showPhotoAuthModal, setShowPhotoAuthModal] = useState(false)
  const [showResumeAuthModal, setShowResumeAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<() => void>(() => {})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isPhotoAuthenticated, setIsPhotoAuthenticated] = useState(false)
  const [isResumeAuthenticated, setIsResumeAuthenticated] = useState(false)
  const [aboutData, setAboutData] = useState({
    title: "About Me",
    description:
      "Passionate Computer Science Engineering student with a deep fascination for technology and innovation. I specialize in Python, Java, and AWS cloud technologies, constantly seeking to expand my knowledge and apply cutting-edge solutions to real-world challenges. My goal is to contribute to meaningful projects that make a positive impact on society through technology.",
    profileImage: "/profile-photo.jpeg",
    resumeUrl: "",
    resumeName: "Sangaraju_Vamsi_Resume.pdf",
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

  const requirePhotoAuth = (action: () => void) => {
    if (isPhotoAuthenticated) {
      action()
    } else {
      setPendingAction(() => action)
      setShowPhotoAuthModal(true)
    }
  }

  const requireResumeAuth = (action: () => void) => {
    if (isResumeAuthenticated) {
      action()
    } else {
      setPendingAction(() => action)
      setShowResumeAuthModal(true)
    }
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    pendingAction()
  }

  const handlePhotoAuthSuccess = () => {
    setIsPhotoAuthenticated(true)
    pendingAction()
  }

  const handleResumeAuthSuccess = () => {
    setIsResumeAuthenticated(true)
    pendingAction()
  }

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Information Updated",
      description: "Your about section has been updated successfully.",
    })
  }

  const handlePhotoSave = () => {
    setIsEditingPhoto(false)
    toast({
      title: "Photo Updated",
      description: "Your profile photo has been updated successfully.",
    })
  }

  const handleResumeSave = () => {
    setIsEditingResume(false)
    toast({
      title: "Resume Updated",
      description: "Your resume has been updated successfully.",
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handlePhotoCancel = () => {
    setIsEditingPhoto(false)
  }

  const handleResumeCancel = () => {
    setIsEditingResume(false)
  }

  const handleDownloadResume = () => {
    if (aboutData.resumeUrl) {
      window.open(aboutData.resumeUrl, "_blank")
    } else {
      toast({
        title: "Resume Not Available",
        description: "No resume has been uploaded yet.",
        variant: "destructive",
      })
    }
  }

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden section-light-grayscale">
      <div className="container max-w-7xl relative z-10 px-6">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">About Me</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 mx-auto mb-6"></div>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Discover my journey, passion, and vision for the future of technology
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Profile Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4 space-y-8"
          >
            {/* Profile Image Card */}
            <div className="grayscale-card-light p-8 float-grayscale">
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <div className="relative">
                    <Image
                      src={aboutData.profileImage || "/placeholder.svg"}
                      alt="Sangaraju Vamsi"
                      width={240}
                      height={240}
                      className="profile-image-grayscale object-cover"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-white/20"></div>
                  </div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => requirePhotoAuth(() => setIsEditingPhoto(!isEditingPhoto))}
                      className="absolute bottom-2 right-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-3 shadow-lg"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Sangaraju Vamsi</h3>
                  <p className="text-gray-600 font-medium">Full Stack Developer & Software Developer</p>
                </div>

                {/* Photo Edit Form */}
                {isEditingPhoto && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4 pt-4 border-t border-gray-200"
                  >
                    <Input
                      type="url"
                      placeholder="Enter image URL"
                      value={aboutData.profileImage}
                      onChange={(e) => setAboutData({ ...aboutData, profileImage: e.target.value })}
                      className="input-light-grayscale"
                    />
                    <div className="flex space-x-3">
                      <Button onClick={handlePhotoSave} className="btn-light-grayscale flex-1">
                        <Save className="mr-2 h-4 w-4" /> Save
                      </Button>
                      <Button onClick={handlePhotoCancel} className="btn-outline-grayscale">
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="space-y-4">
              {[
                { icon: GraduationCap, label: "Education", value: "B.Tech CSE" },
                { icon: MapPin, label: "Location", value: "Andhra Pradesh, India" },
                { icon: Target, label: "Focus", value: "Cloud & Development" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="grayscale-card-light p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-3 rounded-xl">
                      <item.icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">{item.label}</p>
                      <p className="text-gray-900 font-semibold">{item.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-8 space-y-8"
          >
            {/* About Content Card */}
            <div className="grayscale-card-light p-8 float-grayscale">
              <CardHeader className="flex flex-row items-center justify-between p-0 mb-8">
                <CardTitle className="text-3xl font-bold text-gray-900 flex items-center">
                  <User className="mr-3 h-8 w-8 text-gray-600" />
                  {aboutData.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => requireAuth(() => setIsEditing(!isEditing))}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                >
                  <Edit className="h-5 w-5" />
                </Button>
              </CardHeader>

              <CardContent className="p-0">
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <Textarea
                      value={aboutData.description}
                      onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                      className="input-light-grayscale min-h-[200px]"
                      rows={8}
                    />
                    <div className="flex space-x-4">
                      <Button onClick={handleSave} className="btn-light-grayscale">
                        <Save className="mr-2 h-5 w-5" /> Save Changes
                      </Button>
                      <Button onClick={handleCancel} className="btn-outline-grayscale">
                        <X className="mr-2 h-5 w-5" /> Cancel
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-8">
                    <p className="text-gray-700 text-lg leading-relaxed font-medium">{aboutData.description}</p>

                    {/* Skills Highlight */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Core Technologies</h4>
                      <div className="flex flex-wrap gap-3">
                        {["Python", "Java", "AWS", "Machine Learning", "Web Development", "Data Analysis"].map(
                          (skill) => (
                            <span key={skill} className="badge-light-grayscale">
                              {skill}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </div>

            {/* Resume Section */}
            <div className="grayscale-card p-8 text-white pulse-grayscale">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Resume & CV</h3>
                    <p className="text-gray-300">Download my latest resume</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => requireResumeAuth(() => setIsEditingResume(!isEditingResume))}
                  className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full"
                >
                  <Edit className="h-5 w-5" />
                </Button>
              </div>

              {isEditingResume ? (
                <div className="space-y-4">
                  <Input
                    type="url"
                    placeholder="Resume URL (PDF link)"
                    value={aboutData.resumeUrl}
                    onChange={(e) => setAboutData({ ...aboutData, resumeUrl: e.target.value })}
                    className="input-grayscale"
                  />
                  <Input
                    type="text"
                    placeholder="Resume filename"
                    value={aboutData.resumeName}
                    onChange={(e) => setAboutData({ ...aboutData, resumeName: e.target.value })}
                    className="input-grayscale"
                  />
                  <div className="flex space-x-3">
                    <Button onClick={handleResumeSave} className="bg-white text-gray-900 hover:bg-gray-100 flex-1">
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button onClick={handleResumeCancel} className="btn-outline-grayscale">
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                    <p className="text-lg font-semibold mb-2">{aboutData.resumeName}</p>
                    <p className="text-gray-300 text-sm">PDF Document • Updated Recently</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={handleDownloadResume}
                      className="bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3"
                      disabled={!aboutData.resumeUrl}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      {aboutData.resumeUrl ? "Download Resume" : "No Resume Available"}
                    </Button>
                    {aboutData.resumeUrl && (
                      <Button
                        onClick={() => window.open(aboutData.resumeUrl, "_blank")}
                        className="btn-outline-grayscale font-semibold py-3"
                      >
                        <ExternalLink className="mr-2 h-5 w-5" /> View Online
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          title="Edit About Section"
        />

        <AuthModal
          isOpen={showPhotoAuthModal}
          onClose={() => setShowPhotoAuthModal(false)}
          onSuccess={handlePhotoAuthSuccess}
          title="Edit Profile Photo"
        />

        <AuthModal
          isOpen={showResumeAuthModal}
          onClose={() => setShowResumeAuthModal(false)}
          onSuccess={handleResumeAuthSuccess}
          title="Edit Resume"
        />
      </div>
    </section>
  )
}
