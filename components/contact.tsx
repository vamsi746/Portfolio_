"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Contact() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      })

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailClick = () => {
    const email = "sangarajuvamsi6@gmail.com"
    const subject = "Portfolio Contact"
    const body = "Hello Sangaraju Vamsi,"

    try {
      window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_self")
    } catch (error) {
      try {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      } catch (error2) {
        navigator.clipboard
          .writeText(email)
          .then(() => {
            alert(`Email address copied to clipboard: ${email}`)
          })
          .catch(() => {
            alert(`Please email me at: ${email}`)
          })
      }
    }
  }

  const handlePhoneClick = () => {
    window.location.href = "tel:+919392742302"
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "sangarajuvamsi6@gmail.com",
      onClick: handleEmailClick,
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+91 9392742302",
      onClick: handlePhoneClick,
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Andhra Pradesh, India",
      onClick: () => window.open("https://maps.google.com/?q=Andhra+Pradesh+India", "_blank"),
    },
  ]

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden section-light-grayscale">
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
            Contact Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 mx-auto mb-6"></div>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Let's connect and discuss opportunities
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-1 space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h3>
              <p className="text-gray-600 leading-relaxed">
                I'm always open to discussing new opportunities, collaborations, or just having a chat about technology
                and development.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="grayscale-card-light p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={item.onClick}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-600 p-3 rounded-xl">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 hover:text-gray-900 transition-colors">{item.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="md:col-span-2"
          >
            <div className="grayscale-card-light p-8">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">Send a Message</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-semibold text-gray-900">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                        className="input-light-grayscale"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-gray-900">
                        Your Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="input-light-grayscale"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-semibold text-gray-900">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      required
                      className="input-light-grayscale"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold text-gray-900">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message here..."
                      rows={6}
                      required
                      className="input-light-grayscale"
                    />
                  </div>
                  <Button type="submit" className="w-full btn-light-grayscale text-lg py-4" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" /> Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
