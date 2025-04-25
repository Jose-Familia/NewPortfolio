import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Github, ExternalLink, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/lib/notion";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return notFound();
  }

  return (
    <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Navegación superior */}
      <Link href="/projects" className="inline-flex items-center text-sm text-gray-400 hover:text-blue-500 transition-colors mb-8">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Projects
      </Link>

      <article className="prose prose-invert prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300 max-w-none">
        {/* Cabecera del artículo */}
        <h1 className="text-4xl font-bold mb-4 not-prose">{project.title}</h1>
          
        {/* Etiquetas */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 not-prose">
            {project.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Imagen principal */}
        {project.image && (
          <div className="relative h-80 md:h-[450px] w-full mb-8 rounded-lg overflow-hidden shadow-lg not-prose">
            <Image 
              src={project.image} 
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        {/* Descripción destacada */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8 not-prose">
          <p className="text-lg text-gray-300">{project.description}</p>
          
          {/* Botones grandes de acción */}
          <div className="flex flex-wrap gap-4 mt-6">
            {project.liveUrl && (
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Demo
                </a>
              </Button>
            )}
            
            {project.githubUrl && (
              <Button asChild size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Github className="mr-2 h-4 w-4" />
                  View Code
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Contenido del proyecto */}
        {project.content ? (
          <MarkdownRenderer content={project.content} />
        ) : (
          <p className="text-gray-400">No content available.</p>
        )}
        
        {/* Navegación inferior */}
        <div className="border-t border-gray-800 mt-12 pt-6 not-prose">
          <Link href="/projects" className="inline-flex items-center text-gray-400 hover:text-blue-500 transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Projects
          </Link>
        </div>
      </article>
    </div>
  );
}

// Generar metadatos dinámicos - igual que en blog
export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = params;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    return {
      title: 'Proyecto no encontrado',
      description: 'El proyecto solicitado no existe o ha sido eliminado.'
    };
  }
  
  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Portfolio`,
      description: project.description,
      images: project.image ? [{ url: project.image }] : [],
    },
  };
}