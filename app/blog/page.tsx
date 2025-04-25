import { getArticles } from "@/lib/notion"
import LatestArticles from "@/components/latest-articles"

export default async function BlogPage() {
  const articles = await getArticles()

  return (
    <div className="py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Featured Articles</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Reflections and perspectives on modern web development</p>
      </div>

      <LatestArticles articles={articles} />
    </div>
  )
}
