import { getProjects } from "@/lib/notion"
import FeaturedProjects from "@/components/featured-projects"

export default async function ProjectPage() {
  const projects = await getProjects()

  return (
    <div className="py-10">
      <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">Featured Projects</h1>
      <p className="text-gray-400 max-w-2xl mx-auto">A showcase of my work and projects</p>
      </div>

      <FeaturedProjects projects={projects} />
    </div>
  )
}
