"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, X, Trash2, Users, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AuthModal from "./auth-modal"

interface Activity {
  id: string
  title: string
  organization: string
  role: string
  period: string
  description: string
}

export default function Activities() {
  const { toast } = useToast()
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      title: "Techlon Association",
      organization: "Annamacharya Institute of Technology and Sciences",
      role: "Member",
      period: "2023 - Present",
      description: "Active member participating in technical events, workshops, and coding competitions.",
    },
    {
      id: "2",
      title: "Cultural Club",
      organization: "Annamacharya Institute of Technology and Sciences",
      role: "Member",
      period: "2022 - Present",
      description: "Organizing and participating in cultural events, festivals, and inter-college competitions.",
    },
  ])

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<() => void>(() => {})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [newActivity, setNewActivity] = useState<Omit<Activity, "id">>({
    title: "",
    organization: "",
    role: "",
    period: "",
    description: "",
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

  const handleAddActivity = () => {
    if (newActivity.title && newActivity.organization) {
      const activity: Activity = {
        ...newActivity,
        id: Date.now().toString(),
      }
      setActivities([...activities, activity])
      setNewActivity({
        title: "",
        organization: "",
        role: "",
        period: "",
        description: "",
      })
      setIsAdding(false)
      toast({
        title: "Activity Added",
        description: "Your activity has been added successfully.",
      })
    }
  }

  const handleEditActivity = (id: string) => {
    const activityToEdit = activities.find((activity) => activity.id === id)
    if (activityToEdit) {
      setEditingId(id)
      setNewActivity({
        title: activityToEdit.title,
        organization: activityToEdit.organization,
        role: activityToEdit.role,
        period: activityToEdit.period,
        description: activityToEdit.description,
      })
      setIsAdding(true)
    }
  }

  const handleUpdateActivity = () => {
    if (editingId && newActivity.title && newActivity.organization) {
      setActivities(
        activities.map((activity) =>
          activity.id === editingId
            ? {
                ...activity,
                title: newActivity.title,
                organization: newActivity.organization,
                role: newActivity.role,
                period: newActivity.period,
                description: newActivity.description,
              }
            : activity,
        ),
      )
      setEditingId(null)
      setNewActivity({
        title: "",
        organization: "",
        role: "",
        period: "",
        description: "",
      })
      setIsAdding(false)
      toast({
        title: "Activity Updated",
        description: "Your activity has been updated successfully.",
      })
    }
  }

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id))
    toast({
      title: "Activity Deleted",
      description: "Activity has been removed from your portfolio.",
    })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setNewActivity({
      title: "",
      organization: "",
      role: "",
      period: "",
      description: "",
    })
  }

  return (
    <section id="activities" className="py-16 md:py-24">
      <div className="container max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2 text-white">Extra-Curricular Activities</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mb-6"></div>
        </motion.div>

        <div className="space-y-6">
          {/* Add New Activity Button */}
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
              <Plus className="mr-2 h-4 w-4" /> Add Activity
            </Button>
          </motion.div>

          {/* Add/Edit Activity Form */}
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
                    <Users className="mr-2 h-5 w-5" />
                    {editingId ? "Edit Activity" : "Add New Activity"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Activity/Club Title"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="Organization"
                      value={newActivity.organization}
                      onChange={(e) => setNewActivity({ ...newActivity, organization: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Role/Position"
                      value={newActivity.role}
                      onChange={(e) => setNewActivity({ ...newActivity, role: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="Period (e.g., 2023 - Present)"
                      value={newActivity.period}
                      onChange={(e) => setNewActivity({ ...newActivity, period: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Textarea
                    placeholder="Description"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={editingId ? handleUpdateActivity : handleAddActivity}
                      className="bg-green-600 hover:bg-green-700 transition-all duration-300"
                    >
                      <Save className="mr-2 h-4 w-4" /> {editingId ? "Update Activity" : "Save Activity"}
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

          {/* Activities List */}
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                whileHover={{ scale: 1.01 }}
                className="transition-all duration-300"
              >
                <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700 text-white hover:bg-gray-700/50 transition-all duration-300">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-2 rounded-full">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{activity.title}</CardTitle>
                        <p className="text-gray-400 text-sm">
                          {activity.role} • {activity.period}
                        </p>
                        <p className="text-gray-500 text-sm">{activity.organization}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => requireAuth(() => handleEditActivity(activity.id))}
                        className="text-gray-400 hover:text-white hover:bg-gray-700 hover:scale-110 transition-all duration-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => requireAuth(() => handleDeleteActivity(activity.id))}
                        className="text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-300">{activity.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {activities.length === 0 && !isAdding && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No activities added yet</p>
              <p className="text-gray-500">Click "Add Activity" to showcase your involvement</p>
            </motion.div>
          )}
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          title="Edit Activities"
        />
      </div>
    </section>
  )
}
