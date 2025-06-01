"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Calendar } from "lucide-react"

// Sample experience data
const experienceData = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Innovations Inc.",
    location: "New York, NY",
    period: "Jan 2022 - Present",
    description:
      "Lead the development of the company's main product using React and TypeScript. Implemented new features, improved performance, and mentored junior developers.",
    skills: ["React", "TypeScript", "Next.js", "Redux", "Jest"],
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "Digital Solutions LLC",
    location: "San Francisco, CA",
    period: "Mar 2019 - Dec 2021",
    description:
      "Developed and maintained web applications using React, Node.js, and MongoDB. Collaborated with designers and product managers to deliver high-quality products.",
    skills: ["React", "Node.js", "MongoDB", "Express", "GraphQL"],
  },
  {
    id: 3,
    title: "Junior Web Developer",
    company: "WebCraft Studios",
    location: "Boston, MA",
    period: "Jun 2017 - Feb 2019",
    description:
      "Assisted in the development of client websites and web applications. Worked with HTML, CSS, JavaScript, and jQuery to implement designs and functionality.",
    skills: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap"],
  },
]

export default function Experience() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section id="experience" className="py-16 md:py-24">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">Work Experience</h2>
          <div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
          <p className="text-muted-foreground text-center max-w-2xl">My professional journey</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="max-w-3xl mx-auto space-y-8"
        >
          {experienceData.map((experience) => (
            <motion.div key={experience.id} variants={item}>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <div>
                      <CardTitle>{experience.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Building className="mr-1 h-4 w-4" />
                        {experience.company} • {experience.location}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="w-fit flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {experience.period}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{experience.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
