import Hero from "@/components/hero"
import About from "@/components/about"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Certifications from "@/components/certifications"
import Education from "@/components/education"
import Activities from "@/components/activities"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <Hero />
      <About />
      <Education />
      <Skills />
      <Projects />
      <Certifications />
      <Activities />
      <Contact />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
