"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Save, X, Trash2, GraduationCap, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AuthModal from "./auth-modal"

interface Education {
  id: string
  institution: string
  degree: string
  year: string
  score: string
}

export default function Education() {
  const { toast } = useToast()
  const [educations, setEducations] = useState<Education[]>([
    {
      id: "1",
      institution: "Annamacharya Institute of Technology and Sciences",
      degree: "B.Tech in Computer Science and Engineering",
      year: "2026",
      score: "CGPA: 8.6",
    },
    {
      id: "2",
      institution: "Sri Chaitanya Junior College",
      degree: "Intermediate (MPC)",
      year: "2022",
      score: "90%",
    },
    {
      id: "3",
      institution: "Sri Sai Balaji High School",
      degree: "10th Standard",
      year: "2020",
      score: "98%",
    },
  ])

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<() => void>(() => {})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [newEducation, setNewEducation] = useState<Omit<Education, "id">>({
    institution: "",
    degree: "",
    year: "",
    score: "",
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

  const handleAddEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      const education: Education = {
        ...newEducation,
        id: Date.now().toString(),
      }
      setEducations([...educations, education])
      setNewEducation({
        institution: "",
        degree: "",
        year: "",
        score: "",
      })
      setIsAdding(false)
      toast({
        title: "Education Added",
        description: "Your education details have been added successfully.",
      })
    }
  }

  const handleDeleteEducation = (id: string) => {
    setEducations(educations.filter((edu) => edu.id !== id))
    toast({
      title: "Education Deleted",
      description: "Education details have been removed from your portfolio.",
    })
  }

  const handleEditEducation = (id: string) => {
    const educationToEdit = educations.find((edu) => edu.id === id)
    if (educationToEdit) {
      setEditingId(id)
      setNewEducation({
        institution: educationToEdit.institution,
        degree: educationToEdit.degree,
        year: educationToEdit.year,
        score: educationToEdit.score,
      })
      setIsAdding(true)
    }
  }

  const handleUpdateEducation = () => {
    if (editingId && newEducation.institution && newEducation.degree) {
      setEducations(
        educations.map((edu) =>
          edu.id === editingId
            ? {
                ...edu,
                institution: newEducation.institution,
                degree: newEducation.degree,
                year: newEducation.year,
                score: newEducation.score,
              }
            : edu,
        ),
      )
      setEditingId(null)
      setNewEducation({
        institution: "",
        degree: "",
        year: "",
        score: "",
      })
      setIsAdding(false)
      toast({
        title: "Education Updated",
        description: "Your education details have been updated successfully.",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setNewEducation({
      institution: "",
      degree: "",
      year: "",
      score: "",
    })
    setIsAdding(false)
  }

  return (
    <section id="education" className="py-16 md:py-24 bg-gray-900/50">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2 text-white">Education</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mb-6"></div>
          <p className="text-gray-400 text-center max-w-2xl">My academic background</p>
        </motion.div>

        <div className="space-y-6">
          {/* Add New Education Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <Button
              onClick={() =>
                requireAuth(() => {
                  setIsAdding(true)
                  setEditingId(null)
                })
              }
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Education
            </Button>
          </motion.div>

          {/* Add/Edit Education Form */}
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    {editingId ? "Edit Education" : "Add New Education"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Institution Name"
                      value={newEducation.institution}
                      onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="Degree/Level"
                      value={newEducation.degree}
                      onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Year/Expected Graduation"
                      value={newEducation.year}
                      onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="CGPA/Percentage"
                      value={newEducation.score}
                      onChange={(e) => setNewEducation({ ...newEducation, score: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={editingId ? handleUpdateEducation : handleAddEducation}
                      className="bg-green-600 hover:bg-green-700 transition-all duration-300"
                    >
                      <Save className="mr-2 h-4 w-4" /> {editingId ? "Update" : "Save"}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 transition-all duration-300"
                    >
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Education List */}
          <div className="space-y-4">
            {educations.map((education, index) => (
              <motion.div
                key={education.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                className="transition-all duration-300"
              >
                <Card className="relative overflow-hidden bg-gray-800/50 backdrop-blur-md border-gray-700 text-white hover:bg-gray-700/50 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gray-400 to-gray-600"></div>
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-2 rounded-full">
                        <GraduationCap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{education.institution}</CardTitle>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => requireAuth(() => handleEditEducation(education.id))}
                        className="text-gray-400 hover:text-white hover:bg-gray-700 hover:scale-110 transition-all duration-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => requireAuth(() => handleDeleteEducation(education.id))}
                        className="text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-gray-400 text-sm">Degree/Level</p>
                        <p className="text-white">{education.degree}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Year</p>
                        <p className="text-white">{education.year}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">CGPA/Percentage</p>
                        <p className="text-white">{education.score}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          title="Edit Education"
        />
      </div>
    </section>
  )
}
