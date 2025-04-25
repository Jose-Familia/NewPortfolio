"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  category: string
  slug: string
  liveUrl?: string
  githubUrl?: string
}

interface FeaturedProjectsProps {
  projects: Project[]
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section className="py-10">
       <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Projects</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">A glimpse into my creations and digital builds</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Card key={project.id} className="bg-gray-900 border-gray-800 overflow-hidden flex flex-col hover:border-blue-900 transition-all">
            <Link href={`/projects/${project.slug}`}>
              <div className="relative h-48 w-full">
                <Image
                  src={project.image || "/placeholder.svg?height=192&width=384"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-300"
                />
                {project.category && (
                  <Badge className="absolute top-4 right-4 bg-gray-800">
                    {project.category}
                  </Badge>
                )}
              </div>
            </Link>
            <CardContent className="p-6 flex flex-col flex-grow">
              <Link href={`/projects/${project.slug}`}>
                <h3 className="text-xl font-bold mb-2 hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
              </Link>
              <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-auto flex justify-between items-center">
                <Button asChild variant="link" className="p-0 text-blue-500 hover:text-blue-400 h-auto">
                  <Link href={`/projects/${project.slug}`} className="flex items-center">
                    View details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <div className="flex gap-3">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                      <ExternalLink className="h-4 w-4"/>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                      <Github className="h-4 w-4"/>
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/projects" className="flex items-center">
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
