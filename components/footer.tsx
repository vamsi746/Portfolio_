import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 bg-black border-t border-gray-800">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <Link href="#home" className="flex items-center justify-center md:justify-start space-x-2">
              <span className="font-bold text-xl">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Portfolio</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mt-2">© {currentYear} Sangaraju Vamsi. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-white hover:bg-gray-800">
              <Link href="https://github.com/vamsi746" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-white hover:bg-gray-800">
              <Link
                href="https://www.linkedin.com/in/vamsi-sangaraju-a814472b6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-white hover:bg-gray-800">
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
