"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <section id="activities" className="py-24 md:py-32 relative overflow-hidden section-dark-grayscale">
      <div className="container max-w-7xl relative z-10 px-6">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="section-title-grayscale text-5xl md:text-6xl font-black text-white mb-6">
            Extra-Curricular Activities
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 mx-auto mb-6"></div>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Leadership, teamwork, and community involvement
          </p>
        </motion.div>

        {/* Add Activity Button */}
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
            <Plus className="mr-2 h-5 w-5" /> Add Activity
          </Button>
        </motion.div>

        {/* Add/Edit Activity Form */}
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
                  <Users className="mr-3 h-7 w-7 text-gray-300" />
                  {editingId ? "Edit Activity" : "Add New Activity"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    placeholder="Activity/Club Title"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    className="input-grayscale"
                  />
                  <Input
                    placeholder="Organization"
                    value={newActivity.organization}
                    onChange={(e) => setNewActivity({ ...newActivity, organization: e.target.value })}
                    className="input-grayscale"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    placeholder="Role/Position"
                    value={newActivity.role}
                    onChange={(e) => setNewActivity({ ...newActivity, role: e.target.value })}
                    className="input-grayscale"
                  />
                  <Input
                    placeholder="Period (e.g., 2023 - Present)"
                    value={newActivity.period}
                    onChange={(e) => setNewActivity({ ...newActivity, period: e.target.value })}
                    className="input-grayscale"
                  />
                </div>
                <Textarea
                  placeholder="Description"
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  className="input-grayscale"
                  rows={3}
                />
                <div className="flex space-x-4">
                  <Button onClick={editingId ? handleUpdateActivity : handleAddActivity} className="btn-grayscale">
                    <Save className="mr-2 h-4 w-4" /> {editingId ? "Update Activity" : "Save Activity"}
                  </Button>
                  <Button onClick={handleCancel} className="btn-outline-grayscale">
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                </div>
              </CardContent>
            </div>
          </motion.div>
        )}

        {/* Activities List */}
        <div className="space-y-8">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="float-grayscale"
            >
              <div className="grayscale-card max-w-4xl mx-auto p-8">
                <CardHeader className="flex flex-row items-start justify-between p-0 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-600 p-3 rounded-xl">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white font-bold">{activity.title}</CardTitle>
                      <p className="text-gray-300 font-semibold">
                        {activity.role} • {activity.period}
                      </p>
                      <p className="text-gray-400 text-sm">{activity.organization}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => requireAuth(() => handleEditActivity(activity.id))}
                      className="text-gray-300 hover:text-white hover:bg-gray-700 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => requireAuth(() => handleDeleteActivity(activity.id))}
                      className="text-gray-300 hover:text-white hover:bg-gray-700 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-gray-300 leading-relaxed">{activity.description}</p>
                </CardContent>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {activities.length === 0 && !isAdding && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Users className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <p className="text-gray-400 text-xl mb-2">No activities added yet</p>
            <p className="text-gray-500">Click "Add Activity" to showcase your involvement</p>
          </motion.div>
        )}

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
