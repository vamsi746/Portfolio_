"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <section id="skills" className="py-16 md:py-24 bg-black/20">
      <div className="container max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2 text-white">Skills</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mb-6"></div>
        </motion.div>

        <div className="space-y-6">
          {/* Add New Category Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <Button
              onClick={() => requireAuth(() => setIsAddingCategory(true))}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Skill Category
            </Button>
          </motion.div>

          {/* Add New Category Form */}
          {isAddingCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700 text-white">
                <CardContent className="pt-6 space-y-4">
                  <Input
                    placeholder="Category Name (e.g., Programming Languages)"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleAddCategory}
                      className="bg-green-600 hover:bg-green-700 transition-all duration-300"
                    >
                      <Save className="mr-2 h-4 w-4" /> Save Category
                    </Button>
                    <Button
                      onClick={() => setIsAddingCategory(false)}
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

          {/* Add New Skill Form */}
          {isAddingSkill && selectedCategoryId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700 text-white">
                <CardContent className="pt-6 space-y-4">
                  <Input
                    placeholder="Skill Name (e.g., Python)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleAddSkill}
                      className="bg-green-600 hover:bg-green-700 transition-all duration-300"
                    >
                      <Save className="mr-2 h-4 w-4" /> Add Skill
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingSkill(false)
                        setSelectedCategoryId(null)
                      }}
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

          {/* Edit Category Form */}
          {editingCategoryId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700 text-white">
                <CardContent className="pt-6 space-y-4">
                  <Input
                    placeholder="Category Name"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleUpdateCategory}
                      className="bg-green-600 hover:bg-green-700 transition-all duration-300"
                    >
                      <Save className="mr-2 h-4 w-4" /> Update Category
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingCategoryId(null)
                        setEditCategoryName("")
                      }}
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

          {/* Skills Categories */}
          <div className="space-y-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                whileHover={{ scale: 1.01 }}
                className="transition-all duration-300"
              >
                <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700 text-white hover:bg-gray-700/50 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => requireAuth(() => handleEditCategory(category.id))}
                        className="text-gray-400 hover:text-white hover:bg-gray-700 hover:scale-110 transition-all duration-300"
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
                        className="text-gray-400 hover:text-white hover:bg-gray-700 hover:scale-110 transition-all duration-300"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => requireAuth(() => handleDeleteCategory(category.id))}
                        className="text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-gray-700 hover:bg-gray-600 text-gray-200 group flex items-center gap-1 pl-3 transition-all"
                        >
                          {skill}
                          <button
                            onClick={() => requireAuth(() => handleDeleteSkill(category.id, skill))}
                            className="ml-1 rounded-full hover:bg-gray-600 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
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
                </Card>
              </motion.div>
            ))}
          </div>
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
