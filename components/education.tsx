"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <section id="education" className="py-24 md:py-32 relative overflow-hidden section-dark-grayscale">
      <div className="container max-w-7xl relative z-10 px-6">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="section-title-grayscale text-5xl md:text-6xl font-black text-white mb-6">Education</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 mx-auto mb-6"></div>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            My academic journey and educational achievements
          </p>
        </motion.div>

        {/* Add Education Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <Button
            onClick={() =>
              requireAuth(() => {
                setIsAdding(true)
                setEditingId(null)
              })
            }
            className="btn-grayscale text-lg px-8 py-4"
          >
            <Plus className="mr-2 h-5 w-5" /> Add Education
          </Button>
        </motion.div>

        {/* Add/Edit Education Form */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <div className="grayscale-card max-w-4xl mx-auto p-8">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <GraduationCap className="mr-3 h-7 w-7 text-gray-300" />
                  {editingId ? "Edit Education" : "Add New Education"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    placeholder="Institution Name"
                    value={newEducation.institution}
                    onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                    className="input-grayscale"
                  />
                  <Input
                    placeholder="Degree/Level"
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                    className="input-grayscale"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    placeholder="Year/Expected Graduation"
                    value={newEducation.year}
                    onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                    className="input-grayscale"
                  />
                  <Input
                    placeholder="CGPA/Percentage"
                    value={newEducation.score}
                    onChange={(e) => setNewEducation({ ...newEducation, score: e.target.value })}
                    className="input-grayscale"
                  />
                </div>
                <div className="flex space-x-4">
                  <Button onClick={editingId ? handleUpdateEducation : handleAddEducation} className="btn-grayscale">
                    <Save className="mr-2 h-4 w-4" /> {editingId ? "Update" : "Save"}
                  </Button>
                  <Button onClick={handleCancelEdit} className="btn-outline-grayscale">
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                </div>
              </CardContent>
            </div>
          </motion.div>
        )}

        {/* Education List */}
        <div className="space-y-8">
          {educations.map((education, index) => (
            <motion.div
              key={education.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="float-grayscale"
            >
              <div className="grayscale-card max-w-4xl mx-auto p-8">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-gray-400 to-gray-600 rounded-l-lg"></div>
                <CardHeader className="flex flex-row items-start justify-between p-0 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-600 p-3 rounded-xl">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white font-bold">{education.institution}</CardTitle>
                      <p className="text-gray-300 font-semibold">{education.degree}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => requireAuth(() => handleEditEducation(education.id))}
                      className="text-gray-300 hover:text-white hover:bg-gray-700 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => requireAuth(() => handleDeleteEducation(education.id))}
                      className="text-gray-300 hover:text-white hover:bg-gray-700 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Year</p>
                      <p className="text-white font-bold text-lg">{education.year}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Score</p>
                      <p className="text-white font-bold text-lg">{education.score}</p>
                    </div>
                  </div>
                </CardContent>
              </div>
            </motion.div>
          ))}
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
