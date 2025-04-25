"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Briefcase, FileText, User, Mail, Menu, X } from "lucide-react"

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Projects", path: "/projects", icon: Briefcase },
    { name: "Blog", path: "/blog", icon: FileText },
    { name: "About", path: "/about", icon: User },
    { name: "Contact", path: "/contact", icon: Mail },
  ]

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-900/60 backdrop-blur-sm text-white md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 flex flex-col items-center justify-center md:hidden">
          <nav className="flex flex-col items-center space-y-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center text-xl ${
                    pathname === item.path ? "text-blue-500" : "text-gray-300 hover:text-blue-400"
                  } transition-colors`}
                >
                  <Icon className="mr-2" size={20} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      {/* Dock Navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center px-3 py-2 rounded-full bg-gray-900/50 backdrop-blur-md border border-gray-800/30 shadow-lg"
        >
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path

              return (
                <Link key={item.path} href={item.path} aria-label={item.name}>
                  <motion.div className="relative group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <div
                      className={`p-2 rounded-full transition-colors ${
                        isActive ? "text-blue-400" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    {/* Tooltip label on hover */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none">
                      {item.name}
                    </div>

                    {/* Minimal active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </motion.nav>
      </div>
    </>
  )
}

export default Navigation
