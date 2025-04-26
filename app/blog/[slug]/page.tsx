import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getArticleBySlug } from "@/lib/notion"
import { notFound } from "next/navigation"
import MarkdownRenderer from "@/components/MarkdownRenderer"

// Añadir exportación para la revalidación
export const revalidate = 60; // Revalidar cada 60 segundos

interface BlogPageProps {
  params: { slug: string }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  // No usar await en params, no es necesario
  const { slug } = params

  try {
    const article = await getArticleBySlug(slug)
    
    if (!article) {
      console.log(`No article found with slug: ${slug}`)
      return notFound()
    }

    return (
      <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center text-sm text-gray-400 hover:text-blue-500 transition-colors mb-8">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Blog
        </Link>

        <article className="prose prose-invert prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300 max-w-none">
          <header className="mb-8 not-prose">
            <div className="flex text-sm text-gray-400 mb-2">
              {article.date && (
                <time dateTime={new Date(article.date).toISOString()} className="inline-flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {article.coverImage && (
            <div className="relative h-80 md:h-[450px] w-full mb-8 rounded-lg overflow-hidden shadow-lg not-prose">
              <Image 
                src={article.coverImage} 
                alt={article.title} 
                fill 
                className="object-cover" 
                priority
              />
            </div>
          )}

          {/* Contenido del artículo */}
          <div className="not-prose">
            <MarkdownRenderer content={article.content || "No content available."} />
          </div>

          {/* Navegación inferior */}
          <div className="border-t border-gray-800 mt-12 pt-6 not-prose">
            <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-blue-500 transition-colors">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Blog
            </Link>
          </div>
        </article>
      </div>
    )
  } catch (error) {
    console.error("Error rendering article page:", error)
    return notFound()
  }
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = params
  const article = await getArticleBySlug(slug)
  
  if (!article) {
    return {
      title: 'Article not found',
      description: 'The requested article could not be found.'
    }
  }
  
  return {
    title: `${article.title} | Blog`,
    description: article.excerpt || article.title,
    openGraph: {
      title: `${article.title} | Blog`,
      description: article.excerpt || article.title,
      images: article.coverImage ? [{ url: article.coverImage }] : [],
    },
  }
}



