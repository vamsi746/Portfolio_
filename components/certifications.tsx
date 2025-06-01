"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <section id="certifications" className="py-24 md:py-32 relative overflow-hidden section-light-grayscale">
      <div className="container max-w-7xl relative z-10 px-6">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="section-title-light-grayscale text-5xl md:text-6xl font-black text-gray-900 mb-6">
            Certifications
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 mx-auto mb-6"></div>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Professional certifications and achievements
          </p>
        </motion.div>

        {/* Add Certificate Button */}
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
            className="btn-light-grayscale text-lg px-8 py-4"
          >
            <Plus className="mr-2 h-5 w-5" /> Add Certificate
          </Button>
        </motion.div>

        {/* Add/Edit Certificate Form */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <div className="grayscale-card-light max-w-4xl mx-auto p-8">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Award className="mr-3 h-7 w-7 text-gray-600" />
                  {editingId ? "Edit Certificate" : "Add New Certificate"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    placeholder="Certificate Title"
                    value={newCertificate.title}
                    onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                    className="input-light-grayscale"
                  />
                  <Input
                    placeholder="Issuing Organization"
                    value={newCertificate.issuer}
                    onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                    className="input-light-grayscale"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    placeholder="Date (e.g., 2024)"
                    value={newCertificate.date}
                    onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
                    className="input-light-grayscale"
                  />
                  <Input
                    placeholder="Credential URL (optional)"
                    value={newCertificate.credentialUrl}
                    onChange={(e) => setNewCertificate({ ...newCertificate, credentialUrl: e.target.value })}
                    className="input-light-grayscale"
                  />
                </div>
                <Input
                  placeholder="Certificate File URL (optional)"
                  value={newCertificate.certificateUrl}
                  onChange={(e) => setNewCertificate({ ...newCertificate, certificateUrl: e.target.value })}
                  className="input-light-grayscale"
                />
                <Textarea
                  placeholder="Description"
                  value={newCertificate.description}
                  onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                  className="input-light-grayscale"
                  rows={3}
                />
                <div className="flex space-x-4">
                  <Button
                    onClick={editingId ? handleUpdateCertificate : handleAddCertificate}
                    className="btn-light-grayscale"
                  >
                    <Save className="mr-2 h-4 w-4" /> {editingId ? "Update Certificate" : "Save Certificate"}
                  </Button>
                  <Button onClick={handleCancel} className="btn-outline-grayscale">
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                </div>
              </CardContent>
            </div>
          </motion.div>
        )}

        {/* Certificates List */}
        <div className="space-y-8">
          {certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="float-grayscale"
            >
              <div className="grayscale-card-light max-w-4xl mx-auto p-8">
                <CardHeader className="flex flex-row items-start justify-between p-0 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-600 p-3 rounded-xl">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900 font-bold">{certificate.title}</CardTitle>
                      <p className="text-gray-600 font-semibold">
                        {certificate.issuer} • {certificate.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => requireAuth(() => handleEditCertificate(certificate.id))}
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {certificate.credentialUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
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
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
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
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <p className="text-gray-700 leading-relaxed font-medium">{certificate.description}</p>
                  {(certificate.credentialUrl || certificate.certificateUrl) && (
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      {certificate.credentialUrl && (
                        <Button className="btn-outline-grayscale" asChild>
                          <Link href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-3 w-3" /> Verify Credential
                          </Link>
                        </Button>
                      )}
                      {certificate.certificateUrl && (
                        <Button className="btn-outline-grayscale" asChild>
                          <Link href={certificate.certificateUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="mr-2 h-3 w-3" /> View Certificate
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {certificates.length === 0 && !isAdding && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Award className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <p className="text-gray-500 text-xl mb-2">No certificates added yet</p>
            <p className="text-gray-400">Click "Add Certificate" to showcase your achievements</p>
          </motion.div>
        )}

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
