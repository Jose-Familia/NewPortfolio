import Hero from "@/components/hero"
import FeaturedProjects from "@/components/featured-projects"
import Skills from "@/components/skills"
import LatestArticles from "@/components/latest-articles"
import { getProjects, getSkills, getArticles } from "@/lib/notion"

export default async function Home() {
  const projects = await getProjects(3)
  const skills = await getSkills()
  const articles = (await getArticles(3)).map(article => ({
      ...article,
      content: (article as { content?: string }).content || "", 
  }))

  return (
    <div className="space-y-24 py-10">
      <Hero />
      <FeaturedProjects projects={projects} />
      <Skills skills={skills} />
      <LatestArticles articles={articles} />
    </div>
  )
}
