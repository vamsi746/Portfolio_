"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Instagram, Mail } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  const [typedText, setTypedText] = useState("")
  const fullText = "Crafting innovative solutions with code and creativity"

  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1))
      }, 50)
      return () => clearTimeout(timeout)
    }
  }, [typedText])

  const handleEmailClick = () => {
    const email = "sangarajuvamsi6@gmail.com"
    const subject = "Portfolio Contact"
    const body = "Hello Sangaraju Lakshmi Narayana,"

    // Try multiple methods to ensure email opens
    try {
      // Method 1: Direct mailto
      window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_self")
    } catch (error) {
      // Method 2: Location href
      try {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      } catch (error2) {
        // Method 3: Copy to clipboard as fallback
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
    <section id="home" className="min-h-screen flex items-center justify-center relative">
      <div className="container text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold mb-4 tracking-wider bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
        >
          SANGARAJU LAKSHMI NARAYANA
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl mb-6 text-gray-300"
        >
          B.Tech Student at Annamacharya Institute of Technology and Sciences
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl mb-12 text-gray-400 h-8"
        >
          {typedText}
          <span className="animate-pulse text-gray-300">|</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center space-x-6"
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-800/50 hover:scale-110 transition-all duration-300 border border-gray-700 hover:border-gray-500"
            asChild
          >
            <Link href="https://github.com/vamsi746" target="_blank" rel="noopener noreferrer">
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-800/50 hover:scale-110 transition-all duration-300 border border-gray-700 hover:border-gray-500"
            asChild
          >
            <Link
              href="https://www.linkedin.com/in/vamsi-sangaraju-a814472b6"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-800/50 hover:scale-110 transition-all duration-300 border border-gray-700 hover:border-gray-500"
            asChild
          >
            <Link
              href="https://www.instagram.com/vamsi_sangaraju/?next=%2F&hl=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEmailClick}
            className="text-gray-300 hover:text-white hover:bg-gray-800/50 hover:scale-110 transition-all duration-300 border border-gray-700 hover:border-gray-500"
          >
            <Mail className="h-6 w-6" />
            <span className="sr-only">Email</span>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
