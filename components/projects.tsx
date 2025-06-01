"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, X, Trash2, Code, ExternalLink, Github, Edit, Upload, Folder, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
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
  category: string
  status: string
}

export default function Projects() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Smart Attendance System using Face Recognition",
      description:
        "Developed a Python-based system using OpenCV and machine learning algorithms to automate classroom attendance tracking with high accuracy.",
      technologies: ["Python", "OpenCV", "Machine Learning", "TensorFlow"],
      certificateUrl: "https://example.com/certificate1.pdf",
      category: "Machine Learning",
      status: "Completed",
    },
    {
      id: "2",
      title: "Cloud-Based File Storage Application",
      description:
        "Built a secure web application using AWS services (S3, EC2) for efficient file storage and retrieval with user authentication.",
      technologies: ["AWS", "S3", "EC2", "Node.js", "React"],
      category: "Cloud Computing",
      status: "Completed",
    },
    {
      id: "3",
      title: "Student Performance Analyzer",
      description:
        "Created a data-driven Flask web application to predict and visualize academic outcomes using statistical analysis and machine learning.",
      technologies: ["Python", "Flask", "Data Analysis", "Pandas", "Matplotlib"],
      category: "Data Science",
      status: "In Progress",
    },
    {
      id: "4",
      title: "Portfolio Website with Modern Design",
      description:
        "Designed and developed a responsive personal portfolio website showcasing projects, skills, and achievements with modern UI/UX principles.",
      technologies: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
      category: "Web Development",
      status: "Completed",
    },
  ])

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<() => void>(() => {})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    title: "",
    description: "",
    technologies: [],
    demoUrl: "",
    githubUrl: "",
    certificateUrl: "",
    category: "Web Development",
    status: "In Progress",
  })

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const categories = [
    "All",
    "Web Development",
    "Machine Learning",
    "Cloud Computing",
    "Data Science",
    "Mobile Development",
  ]

  const filteredProjects =
    selectedCategory === "All" ? projects : projects.filter((project) => project.category === selectedCategory)

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
        category: "Web Development",
        status: "In Progress",
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
        category: projectToEdit.category,
        status: projectToEdit.status,
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
                category: newProject.category,
                status: newProject.status,
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
        category: "Web Development",
        status: "In Progress",
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
      category: "Web Development",
      status: "In Progress",
    })
  }

  return (
    <section id="projects" className="py-24 md:py-32 relative overflow-hidden section-dark-grayscale">
      <div className="container max-w-7xl relative z-10 px-6">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="section-title-grayscale text-5xl md:text-6xl font-black text-white mb-6">My Projects</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 mx-auto mb-6"></div>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Explore my portfolio of innovative projects and technical achievements
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category ? "bg-white text-gray-900 shadow-lg" : "btn-outline-grayscale"
              }`}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Add Project Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <Button
            onClick={() =>
              requireAuth(() => {
                setIsAdding(true)
                setEditingId(null)
              })
            }
            className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4 rounded-2xl shadow-lg"
          >
            <Plus className="mr-2 h-5 w-5" /> Add New Project
          </Button>
        </motion.div>

        {/* Add/Edit Project Form */}
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
                  <Code className="mr-3 h-7 w-7 text-gray-300" />
                  {editingId ? "Edit Project" : "Add New Project"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="input-grayscale"
                  />
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <Textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="input-grayscale min-h-[120px]"
                  rows={4}
                />
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    placeholder="Technologies (comma-separated)"
                    value={newProject.technologies.join(", ")}
                    onChange={(e) => handleTechnologiesChange(e.target.value)}
                    className="input-grayscale"
                  />
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Demo URL (optional)"
                    value={newProject.demoUrl}
                    onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                    className="input-grayscale"
                  />
                  <Input
                    placeholder="GitHub URL (optional)"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    className="input-grayscale"
                  />
                  <Input
                    placeholder="Certificate URL (optional)"
                    value={newProject.certificateUrl}
                    onChange={(e) => setNewProject({ ...newProject, certificateUrl: e.target.value })}
                    className="input-grayscale"
                  />
                </div>
                <div className="flex space-x-4">
                  <Button
                    onClick={editingId ? handleUpdateProject : handleAddProject}
                    className="bg-white text-gray-900 hover:bg-gray-100"
                  >
                    <Save className="mr-2 h-4 w-4" /> {editingId ? "Update Project" : "Save Project"}
                  </Button>
                  <Button onClick={handleCancel} className="btn-outline-grayscale">
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                </div>
              </CardContent>
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="float-grayscale"
            >
              <div className="grayscale-card p-6 h-full">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-600 p-3 rounded-xl">
                      <Folder className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                      <p className="text-gray-400 text-sm">{project.category}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => requireAuth(() => handleEditProject(project.id))}
                      className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => requireAuth(() => handleDeleteProject(project.id))}
                      className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === "Completed"
                        ? "bg-gray-600 text-gray-200"
                        : project.status === "In Progress"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {project.status}
                  </span>
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>

                {/* Project Content */}
                <div className="space-y-4 flex-1">
                  <p className="text-gray-300 leading-relaxed">{project.description}</p>

                  {/* Technologies */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} className="badge-grayscale">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
                    {project.demoUrl && (
                      <Button variant="outline" size="sm" className="btn-outline-grayscale" asChild>
                        <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-3 w-3" /> Demo
                        </Link>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button variant="outline" size="sm" className="btn-outline-grayscale" asChild>
                        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-3 w-3" /> Code
                        </Link>
                      </Button>
                    )}
                    {project.certificateUrl && (
                      <Button variant="outline" size="sm" className="btn-outline-grayscale" asChild>
                        <Link href={project.certificateUrl} target="_blank" rel="noopener noreferrer">
                          <Upload className="mr-2 h-3 w-3" /> Certificate
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && !isAdding && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Folder className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <p className="text-gray-400 text-xl mb-2">No projects found</p>
            <p className="text-gray-500">Try selecting a different category or add a new project</p>
          </motion.div>
        )}

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
