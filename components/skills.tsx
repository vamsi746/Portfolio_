"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, X, Trash2, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AuthModal from "./auth-modal"

interface SkillCategory {
  id: string
  name: string
  skills: string[]
}

export default function Skills() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<SkillCategory[]>([
    {
      id: "1",
      name: "Programming Languages",
      skills: ["Python", "C", "Java", "HTML"],
    },
    {
      id: "2",
      name: "Cloud Technologies",
      skills: ["AWS Cloud Practitioner"],
    },
    {
      id: "3",
      name: "Web Development",
      skills: ["HTML", "CSS", "JavaScript"],
    },
  ])

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editCategoryName, setEditCategoryName] = useState("")

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<() => void>(() => {})
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const category: SkillCategory = {
        id: Date.now().toString(),
        name: newCategory,
        skills: [],
      }
      setCategories([...categories, category])
      setNewCategory("")
      setIsAddingCategory(false)
      toast({
        title: "Category Added",
        description: `${newCategory} category has been added successfully.`,
      })
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && selectedCategoryId) {
      setCategories(
        categories.map((category) => {
          if (category.id === selectedCategoryId) {
            return {
              ...category,
              skills: [...category.skills, newSkill],
            }
          }
          return category
        }),
      )
      setNewSkill("")
      setIsAddingSkill(false)
      setSelectedCategoryId(null)
      toast({
        title: "Skill Added",
        description: `${newSkill} has been added successfully.`,
      })
    }
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id))
    toast({
      title: "Category Deleted",
      description: "Category has been removed from your skills.",
    })
  }

  const handleDeleteSkill = (categoryId: string, skill: string) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            skills: category.skills.filter((s) => s !== skill),
          }
        }
        return category
      }),
    )
    toast({
      title: "Skill Deleted",
      description: `${skill} has been removed from your skills.`,
    })
  }

  const handleEditCategory = (id: string) => {
    const category = categories.find((c) => c.id === id)
    if (category) {
      setEditingCategoryId(id)
      setEditCategoryName(category.name)
    }
  }

  const handleUpdateCategory = () => {
    if (editingCategoryId && editCategoryName.trim()) {
      setCategories(
        categories.map((category) => {
          if (category.id === editingCategoryId) {
            return {
              ...category,
              name: editCategoryName,
            }
          }
          return category
        }),
      )
      setEditingCategoryId(null)
      setEditCategoryName("")
      toast({
        title: "Category Updated",
        description: "Category name has been updated successfully.",
      })
    }
  }

  return (
    <section id="skills" className="py-24 md:py-32 relative overflow-hidden section-light-grayscale">
      <div className="container max-w-7xl relative z-10 px-6">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="section-title-light-grayscale text-5xl md:text-6xl font-black text-gray-900 mb-6">Skills</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 mx-auto mb-6"></div>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Technical expertise and professional competencies
          </p>
        </motion.div>

        {/* Add Category Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <Button
            onClick={() => requireAuth(() => setIsAddingCategory(true))}
            className="btn-light-grayscale text-lg px-8 py-4"
          >
            <Plus className="mr-2 h-5 w-5" /> Add Skill Category
          </Button>
        </motion.div>

        {/* Add New Category Form */}
        {isAddingCategory && (
          <div className="grayscale-card-light max-w-2xl mx-auto p-6 mb-8">
            <CardContent className="pt-6 space-y-4">
              <Input
                placeholder="Category Name (e.g., Programming Languages)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="input-light-grayscale"
              />
              <div className="flex space-x-2">
                <Button onClick={handleAddCategory} className="btn-light-grayscale">
                  <Save className="mr-2 h-4 w-4" /> Save Category
                </Button>
                <Button onClick={() => setIsAddingCategory(false)} className="btn-outline-grayscale">
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
            </CardContent>
          </div>
        )}

        {/* Add New Skill Form */}
        {isAddingSkill && selectedCategoryId && (
          <div className="grayscale-card-light max-w-2xl mx-auto p-6 mb-8">
            <CardContent className="pt-6 space-y-4">
              <Input
                placeholder="Skill Name (e.g., Python)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="input-light-grayscale"
              />
              <div className="flex space-x-2">
                <Button onClick={handleAddSkill} className="btn-light-grayscale">
                  <Save className="mr-2 h-4 w-4" /> Add Skill
                </Button>
                <Button
                  onClick={() => {
                    setIsAddingSkill(false)
                    setSelectedCategoryId(null)
                  }}
                  className="btn-outline-grayscale"
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
            </CardContent>
          </div>
        )}

        {/* Edit Category Form */}
        {editingCategoryId && (
          <div className="grayscale-card-light max-w-2xl mx-auto p-6 mb-8">
            <CardContent className="pt-6 space-y-4">
              <Input
                placeholder="Category Name"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="input-light-grayscale"
              />
              <div className="flex space-x-2">
                <Button onClick={handleUpdateCategory} className="btn-light-grayscale">
                  <Save className="mr-2 h-4 w-4" /> Update Category
                </Button>
                <Button
                  onClick={() => {
                    setEditingCategoryId(null)
                    setEditCategoryName("")
                  }}
                  className="btn-outline-grayscale"
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
            </CardContent>
          </div>
        )}

        {/* Skills Categories */}
        <div className="space-y-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="float-grayscale"
            >
              <div className="grayscale-card-light p-8">
                <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
                  <CardTitle className="text-2xl text-gray-900 font-bold">{category.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => requireAuth(() => handleEditCategory(category.id))}
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        requireAuth(() => {
                          setSelectedCategoryId(category.id)
                          setIsAddingSkill(true)
                        })
                      }
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => requireAuth(() => handleDeleteCategory(category.id))}
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill) => (
                      <Badge key={skill} className="badge-light-grayscale group flex items-center gap-2 px-4 py-2">
                        {skill}
                        <button
                          onClick={() => requireAuth(() => handleDeleteSkill(category.id, skill))}
                          className="ml-1 rounded-full hover:bg-gray-300 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {category.skills.length === 0 && (
                      <p className="text-gray-500 text-sm italic">No skills added yet</p>
                    )}
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
          title="Edit Skills"
        />
      </div>
    </section>
  )
}
