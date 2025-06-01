"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, X, Award, ExternalLink, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import AuthModal from "./auth-modal"

interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  credentialUrl?: string
  certificateUrl?: string
}

export default function Certifications() {
  const { toast } = useToast()
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "1",
      title: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2024",
      description: "Fundamental knowledge of AWS Cloud concepts, services, and security.",
      credentialUrl: "https://aws.amazon.com/certification/",
      certificateUrl: "https://example.com/aws-certificate.pdf",
    },
    {
      id: "2",
      title: "IBM Skill Builder",
      issuer: "IBM",
      date: "2023",
      description: "Completed various skill development modules on IBM's learning platform.",
    },
    {
      id: "3",
      title: "Python Certification",
      issuer: "Python Institute",
      date: "2023",
      description: "Proficient in Python programming through certified training.",
      certificateUrl: "https://example.com/python-certificate.pdf",
    },
    {
      id: "4",
      title: "Java Certification",
      issuer: "Oracle",
      date: "2023",
      description: "Certified knowledge and hands-on experience in Java programming.",
    },
  ])

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<() => void>(() => {})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [newCertificate, setNewCertificate] = useState<Omit<Certificate, "id">>({
    title: "",
    issuer: "",
    date: "",
    description: "",
    credentialUrl: "",
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

  const handleAddCertificate = () => {
    if (newCertificate.title && newCertificate.issuer) {
      const certificate: Certificate = {
        ...newCertificate,
        id: Date.now().toString(),
      }
      setCertificates([...certificates, certificate])
      setNewCertificate({
        title: "",
        issuer: "",
        date: "",
        description: "",
        credentialUrl: "",
        certificateUrl: "",
      })
      setIsAdding(false)
      toast({
        title: "Certificate Added",
        description: "Your certificate has been added successfully.",
      })
    }
  }

  const handleEditCertificate = (id: string) => {
    const certificateToEdit = certificates.find((cert) => cert.id === id)
    if (certificateToEdit) {
      setEditingId(id)
      setNewCertificate({
        title: certificateToEdit.title,
        issuer: certificateToEdit.issuer,
        date: certificateToEdit.date,
        description: certificateToEdit.description,
        credentialUrl: certificateToEdit.credentialUrl || "",
        certificateUrl: certificateToEdit.certificateUrl || "",
      })
      setIsAdding(true)
    }
  }

  const handleUpdateCertificate = () => {
    if (editingId && newCertificate.title && newCertificate.issuer) {
      setCertificates(
        certificates.map((cert) =>
          cert.id === editingId
            ? {
                ...cert,
                title: newCertificate.title,
                issuer: newCertificate.issuer,
                date: newCertificate.date,
                description: newCertificate.description,
                credentialUrl: newCertificate.credentialUrl,
                certificateUrl: newCertificate.certificateUrl,
              }
            : cert,
        ),
      )
      setEditingId(null)
      setNewCertificate({
        title: "",
        issuer: "",
        date: "",
        description: "",
        credentialUrl: "",
        certificateUrl: "",
      })
      setIsAdding(false)
      toast({
        title: "Certificate Updated",
        description: "Your certificate has been updated successfully.",
      })
    }
  }

  const handleDeleteCertificate = (id: string) => {
    setCertificates(certificates.filter((cert) => cert.id !== id))
    toast({
      title: "Certificate Deleted",
      description: "Certificate has been removed from your portfolio.",
    })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setNewCertificate({
      title: "",
      issuer: "",
      date: "",
      description: "",
      credentialUrl: "",
      certificateUrl: "",
    })
  }

  return (
    <section id="certifications" className="py-16 md:py-24 bg-gray-900/50">
      <div className="container max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2 text-white">Certifications</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mb-6"></div>
        </motion.div>

        <div className="space-y-6">
          {/* Add New Certificate Button */}
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
              <Plus className="mr-2 h-4 w-4" /> Add Certificate
            </Button>
          </motion.div>

          {/* Add/Edit Certificate Form */}
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
                    <Award className="mr-2 h-5 w-5" />
                    {editingId ? "Edit Certificate" : "Add New Certificate"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Certificate Title"
                      value={newCertificate.title}
                      onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="Issuing Organization"
                      value={newCertificate.issuer}
                      onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Date (e.g., 2024)"
                      value={newCertificate.date}
                      onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="Credential URL (optional)"
                      value={newCertificate.credentialUrl}
                      onChange={(e) => setNewCertificate({ ...newCertificate, credentialUrl: e.target.value })}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Input
                    placeholder="Certificate File URL (optional)"
                    value={newCertificate.certificateUrl}
                    onChange={(e) => setNewCertificate({ ...newCertificate, certificateUrl: e.target.value })}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <Textarea
                    placeholder="Description"
                    value={newCertificate.description}
                    onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={editingId ? handleUpdateCertificate : handleAddCertificate}
                      className="bg-green-600 hover:bg-green-700 transition-all duration-300"
                    >
                      <Save className="mr-2 h-4 w-4" /> {editingId ? "Update Certificate" : "Save Certificate"}
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

          {/* Certificates List */}
          <div className="space-y-4">
            {certificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
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
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{certificate.title}</CardTitle>
                        <p className="text-gray-400 text-sm">
                          {certificate.issuer} • {certificate.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => requireAuth(() => handleEditCertificate(certificate.id))}
                        className="text-gray-400 hover:text-white hover:bg-gray-700 hover:scale-110 transition-all duration-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {certificate.credentialUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white hover:bg-gray-700 hover:scale-110 transition-all duration-300"
                          asChild
                        >
                          <Link href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {certificate.certificateUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white hover:bg-gray-700 hover:scale-110 transition-all duration-300"
                          asChild
                        >
                          <Link href={certificate.certificateUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => requireAuth(() => handleDeleteCertificate(certificate.id))}
                        className="text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <p className="text-gray-300">{certificate.description}</p>
                    {(certificate.credentialUrl || certificate.certificateUrl) && (
                      <div className="flex flex-wrap gap-2">
                        {certificate.credentialUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            asChild
                          >
                            <Link href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-3 w-3" /> Verify
                            </Link>
                          </Button>
                        )}
                        {certificate.certificateUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            asChild
                          >
                            <Link href={certificate.certificateUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="mr-2 h-3 w-3" /> View Certificate
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {certificates.length === 0 && !isAdding && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Award className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No certificates added yet</p>
              <p className="text-gray-500">Click "Add Certificate" to showcase your achievements</p>
            </motion.div>
          )}
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          title="Edit Certifications"
        />
      </div>
    </section>
  )
}
