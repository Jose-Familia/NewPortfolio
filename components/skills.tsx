"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Skill {
  name: string
  icon: string
  category: string
}

interface SkillsProps {
  skills: Skill[]
}

export default function Skills({ skills }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = ["All", "Frontend", "Backend", "Database", "Tools"]

  const filteredSkills = activeCategory === "All" ? skills : skills.filter((skill) => skill.category === activeCategory)

  return (
    <section className="py-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Technologies and tools I work with</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={
              activeCategory === category ? "bg-blue-600 hover:bg-blue-700" : "border-gray-700 hover:bg-gray-800"
            }
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filteredSkills.map((skill) => (
          <div 
            key={skill.name} 
            className="border border-gray-800 rounded-lg p-4 text-center bg-gray-900 hover:border-blue-900 transition-all"
          >
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <Image
                src={skill.icon || "/placeholder.svg?height=64&width=64"}
                alt={skill.name}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="font-medium">{skill.name}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}
