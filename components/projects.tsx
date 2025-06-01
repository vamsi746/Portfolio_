"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, X, Trash2, Code, ExternalLink, Github, Edit, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import AuthModal from "./auth-modal"

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  demoUrl?: string
  githubUrl?: string
  image?: string
  certificateUrl?: string
}

export default function Projects() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Smart Attendance System using Face Recognition",
      description:
        "Developed a Python-based system using OpenCV and machine learning algorithms to automate classroom attendance.",
      technologies: ["Python", "OpenCV", "Machine Learning"],
      certificateUrl: "https://example.com/certificate1.pdf",
    },
    {
      id: "2",
      title: "Cloud-Based File Storage Application",
      description: "Built a web app using AWS (S3, EC2) to store and retrieve user files securely in the cloud.",
      technologies: ["AWS", "S3", "EC2", "Web Development"],
    },
    {
      id: "3",
      title: "Student Performance Analyzer",
      description:
        "Created a data-driven Flask web application to predict and visualize academic outcomes based on input metrics.",
      technologies: ["Python", "Flask", "Data Analysis"],
    },
    {
      id: "4",
      title: "Portfolio Website with HTML, CSS, and JavaScript",
      description:
        "Designed a responsive personal portfolio website showcasing academic background, skills, and projects.",
      technologies: ["HTML", "CSS", "JavaScript"],
    },
  ])

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<() => void>(() => {})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    title: "",
    description: "",
    technologies: [],
    demoUrl: "",
    githubUrl: "",
    certificateUrl: "",
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

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      const project: Project = {
        ...newProject,
        id: Date.now().toString(),
      }
      setProjects([...projects, project])
      setNewProject({
        title: "",
        description: "",
        technologies: [],
        demoUrl: "",
        githubUrl: "",
        certificateUrl: "",
      })
      setIsAdding(false)
      toast({
        title: "Project Added",
        description: "Your project has been added successfully.",
      })
    }
  }

  const handleEditProject = (id: string) => {
    const projectToEdit = projects.find((project) => project.id === id)
    if (projectToEdit) {
      setEditingId(id)
      setNewProject({
        title: projectToEdit.title,
        description: projectToEdit.description,
        technologies: projectToEdit.technologies,
        demoUrl: projectToEdit.demoUrl || "",
        githubUrl: projectToEdit.githubUrl || "",
        certificateUrl: projectToEdit.certificateUrl || "",
      })
      setIsAdding(true)
    }
  }

  const handleUpdateProject = () => {
    if (editingId && newProject.title && newProject.description) {
      setProjects(
        projects.map((project) =>
          project.id === editingId
            ? {
                ...project,
                title: newProject.title,
                description: newProject.description,
                technologies: newProject.technologies,
                demoUrl: newProject.demoUrl,
                githubUrl: newProject.githubUrl,
                certificateUrl: newProject.certificateUrl,
              }
            : project,
        ),
      )
      setEditingId(null)
      setNewProject({
        title: "",
        description: "",
        technologies: [],
        demoUrl: "",
        githubUrl: "",
        certificateUrl: "",
      })
      setIsAdding(false)
      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully.",
      })
    }
  }

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
    toast({
      title: "Project Deleted",
      description: "Project has been removed from your portfolio.",
    })
  }

  const handleTechnologiesChange = (techString: string) => {
    const techArray = techString
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech)
    setNewProject({ ...newProject, technologies: techArray })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setNewProject({
      title: "",
      description: "",
      technologies: [],
      demoUrl: "",
      githubUrl: "",
      certificateUrl: "",
    })
  }

  return (
    <section id="projects" className="py-16 md:py-24 bg-gray-900/50">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2 text-white">Projects</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mb-6"></div>
          <p className="text-gray-400 text-center max-w-2xl">Showcase of my development work</p>
        </motion.div>

        <div className="space-y-6">
          {/* Add New Project Button */}
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
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </motion.div>

          {/* Add/Edit Project Form */}
          {isAdding && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="mr-2 h-5 w-5" />
                    {editingId ? "Edit Project" : "Add New Project"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <Textarea
                    placeholder="Project Description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    rows={3}
                  />
                  <Input
                    placeholder="Technologies (comma-separated)"
                    value={newProject.technologies.join(", ")}
                    onChange={(e) => handleTechnologiesChange(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Demo URL (optional)"
                      value={newProject.demoUrl}
                      onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="GitHub URL (optional)"
                      value={newProject.githubUrl}
                      onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Input
                    placeholder="Project Certificate URL (optional)"
                    value={newProject.certificateUrl}
                    onChange={(e) => setNewProject({ ...newProject, certificateUrl: e.target.value })}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={editingId ? handleUpdateProject : handleAddProject}
                      className="bg-green-600 hover:bg-green-700 transition-all duration-300"
                    >
                      <Save className="mr-2 h-4 w-4" /> {editingId ? "Update Project" : "Save Project"}
                    </Button>
                    <Button
                      onClick={handleCancel}
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

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                className="transition-all duration-300"
              >
                <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700 text-white hover:bg-gray-700/50 transition-all duration-300">
                  {project.image && (
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-2 rounded-full">
                        <Code className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => requireAuth(() => handleEditProject(project.id))}
                        className="text-gray-400 hover:text-white hover:bg-gray-700 hover:scale-110 transition-all duration-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => requireAuth(() => handleDeleteProject(project.id))}
                        className="text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <p className="text-gray-300">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} className="bg-gray-700 text-gray-200 hover:bg-gray-600">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.demoUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          asChild
                        >
                          <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-3 w-3" /> Demo
                          </Link>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          asChild
                        >
                          <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-3 w-3" /> Code
                          </Link>
                        </Button>
                      )}
                      {project.certificateUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          asChild
                        >
                          <Link href={project.certificateUrl} target="_blank" rel="noopener noreferrer">
                            <Upload className="mr-2 h-3 w-3" /> Certificate
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {projects.length === 0 && !isAdding && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Code className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No projects added yet</p>
              <p className="text-gray-500">Click "Add Project" to showcase your work</p>
            </motion.div>
          )}
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          title="Edit Projects"
        />
      </div>
    </section>
  )
}
