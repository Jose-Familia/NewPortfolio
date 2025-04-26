import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Mail } from "lucide-react"
import { getCertifications, getEducation, getWorkExperience } from "@/lib/notion"
import { Badge } from "@/components/ui/badge"

// Añadir exportación para la revalidación
export const revalidate = 60; // Revalidar cada 60 segundos

export default async function AboutPage() {
  const certifications = await getCertifications()
  const education = await getEducation()
  const workExperience = await getWorkExperience()

  return (
    <div className="py-10">
      <Link href="/" className="flex items-center text-gray-400 hover:text-blue-500 mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-4">About Me</h1>
        <p className="text-xl text-gray-400 mb-8">
        I am a self-builder: I learn, I fail, I get up and move forward, because I know that everything worthwhile is earned with intelligence, discipline and heart.
        </p>

        <div className="space-y-6 text-gray-300">
          <p>
          Hello! I'm José Familia, a student and aspiring software developer living in the Dominican Republic.
          I'm passionate about web development, especially app development.
          </p>
          <p>
          My journey in the technology world began with my curiosity to understand how machines work beyond just turning on the PC.
          At the beginning of 2023, I started programming as a hobby and have learned many new things during this time.
          Although things don't always turn out well, I've learned to be patient and solve problems calmly. The more I do, the more new things I discover, and that's the exciting thing about programming.
          </p>
          <p>
          When I'm not programming.
          I like to spend time with people I care about, play sports (mainly baseball), read about things I like, or watch anime series. 
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild variant="outline" className="border-gray-700 hover:bg-gray-800">
            <Link href="/contact" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Contact Me
            </Link>
          </Button>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Work Experience</h2>
        <div className="space-y-12">
          {workExperience.map((job: { id: string; title: string; period: string; company: string; location: string; description: string; skills: string[] }) => (
        <div key={job.id} className="relative pl-8 border-l border-gray-800">
          <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-2 top-1"></div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
            <h3 className="text-xl font-bold">{job.title}</h3>
            <span className="inline-block px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
          {job.period}
            </span>
          </div>
          <p className="text-gray-400 mb-2">{job.company}</p>
          <p className="text-gray-400 mb-2">{job.location}</p>
          <p className="text-gray-300 mb-4">{job.description}</p>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill: string) => (
          <Badge key={skill} variant="secondary" className="bg-gray-800 text-gray-300">
            {skill}
          </Badge>
            ))}
          </div>
        </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Certifications & Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div key={cert.id} className="border border-gray-800 rounded-lg p-6 bg-gray-900 hover:border-blue-900 transition-all">
              <Badge className="mb-4 bg-blue-600 hover:bg-blue-600">Featured</Badge>
              <div className="w-16 h-16 mb-4 relative">
                <Image
                  src={cert.icon || "/placeholder.svg?height=64&width=64"}
                  alt={cert.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{cert.name}</h3>
              <p className="text-gray-400 mb-2">{cert.issuer}</p>
              <p className="text-gray-400 mb-2">Issued: {cert.date ?? "Not specified"}</p>
              <p className="text-gray-400 mb-4">Credential ID: {cert.credentialId}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {cert.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
              <a
                href={cert.url ?? "#"} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 flex items-center"
              >
                Verify credential
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Education</h2>
        <div className="space-y-12">
          {education.map((edu: { id: string; degree: string; institution: string; period: string; location: string; description: string }) => (
        <div key={edu.id} className="relative pl-8 border-l border-gray-800">
          <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-2 top-1"></div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
            <h3 className="text-xl font-bold">{edu.degree || "Unnamed Degree"}</h3>
            <span className="inline-block px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
          {edu.period || "No Period Available"}
            </span>
          </div>
          <p className="text-gray-400 mb-2">{edu.institution || "No Institution Provided"}</p>
          <p className="text-gray-400 mb-2">{edu.location || "No Location Provided"}</p>
          <p className="text-gray-300">{edu.description || "No Description Available"}</p>
        </div>
          ))}
        </div>
      </section>
    </div>
  )
}
