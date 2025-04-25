import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="py-20 text-center relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square">
          <div className="absolute inset-0 rounded-full bg-blue-600/10 blur-3xl animate-slow-spin" />
        </div>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Hi, I'm <span className="text-blue-500">Jose Familia</span>
      </h1>
      <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
      A student passionate about software development, interested in creating unique and modern applications, making them unique and functional.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/projects" className="flex items-center">
            View My Work
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-gray-700 hover:bg-gray-800">
          <Link href="/contact">Get In Touch</Link>
        </Button>
      </div>
    </section>
  )
}
