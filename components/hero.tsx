"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Instagram, Mail, ArrowDown } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  const [typedText, setTypedText] = useState("")
  const fullText = "Building tomorrow's digital experiences today"

  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1))
      }, 80)
      return () => clearTimeout(timeout)
    }
  }, [typedText])

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

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24">
      <div className="container text-center relative z-10 max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-12"
        >
          {/* Main Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent block">
                SANGARAJU
              </span>
              <span className="text-gray-100 block mt-2">VAMSI</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-300">Full Stack Developer & Software Developer</h2>
            <p className="text-xl md:text-2xl text-gray-400 font-medium">
              Passionate about crafting innovative solutions.
            </p>
          </motion.div>

          {/* Typing Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="h-20 flex items-center justify-center"
          >
            <p className="text-xl md:text-2xl text-gray-200 font-medium">
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                className="text-gray-400"
              >
                |
              </motion.span>
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center space-x-6"
          >
            {[
              { icon: Github, href: "https://github.com/vamsi746", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/vamsi-sangaraju-a814472b6", label: "LinkedIn" },
              {
                icon: Instagram,
                href: "https://www.instagram.com/vamsi_sangaraju/?next=%2F&hl=en",
                label: "Instagram",
              },
              { icon: Mail, onClick: handleEmailClick, label: "Email" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-16 h-16 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-500 shadow-lg hover:shadow-xl transition-all duration-300"
                  {...(item.href ? { asChild: true } : { onClick: item.onClick })}
                >
                  {item.href ? (
                    <Link href={item.href} target="_blank" rel="noopener noreferrer">
                      <item.icon className="h-7 w-7" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  ) : (
                    <>
                      <item.icon className="h-7 w-7" />
                      <span className="sr-only">{item.label}</span>
                    </>
                  )}
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="pt-8"
          >
            <Button
              className="btn-grayscale text-lg px-10 py-4"
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore My Work
              <ArrowDown className="ml-3 h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-400 rounded-full opacity-60"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-3 h-3 bg-gray-500 rounded-full opacity-40"
        />
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-gray-300 rounded-full opacity-50"
        />
      </div>
    </section>
  )
}
