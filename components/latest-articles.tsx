import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  date: string
  tags: string[]
}

interface LatestArticlesProps {
  articles: Article[]
}

export default function LatestArticles({ articles }: LatestArticlesProps) {
  return (
    <section className="py-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Articles</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Experiences of a student and novice developer</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article) => (
          <div key={article.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-blue-900 transition-all">
            <Link href={`/blog/${article.slug}`}>
              <div className="relative h-60 w-full">
                <Image
                  src={article.coverImage || "/placeholder.svg?height=240&width=400"}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
            </Link>
            <div className="p-6">
              <p className="text-gray-400 mb-2">{formatDate(article.date)}</p>
              <Link href={`/blog/${article.slug}`}>
                <h3 className="text-xl font-bold mb-2 hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
              </Link>
              <p className="text-gray-400 mb-4">{article.excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Link href={`/blog/${article.slug}`} className="text-blue-500 hover:text-blue-400 inline-flex items-center">
                Read More
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/blog" className="flex items-center">
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
