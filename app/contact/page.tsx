"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Send } from "lucide-react" 

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      // Manejo seguro de la respuesta JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        responseData = {};
      }
      
      if (!response.ok) {
        console.error(`Error response (${response.status}):`, responseData);
        throw new Error(responseData.error || `Error de servidor: ${response.status}`);
      }
      
      console.log('Éxito:', responseData);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="py-10 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-600/10 mb-4">
          <Mail className="h-8 w-8 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
        <p className="text-gray-400 max-w-lg mx-auto">Have a project in mind or want to chat? Feel free to reach out!</p>
      </div>

      {submitStatus === "success" && (
        <div className="bg-green-900/20 border border-green-500 text-green-300 p-4 rounded-lg mb-6">
          Thank you for your message! I'll get back to you as soon as possible.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
          There was an error sending your message. Please try again later.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 rounded-lg border border-gray-800 p-6">
        <div>
          <label htmlFor="name" className="block mb-2 text-gray-300">
            Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-gray-900 border-gray-800 focus:border-blue-600"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 text-gray-300">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-gray-900 border-gray-800 focus:border-blue-600"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block mb-2 text-gray-300">
            Subject
          </label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="bg-gray-900 border-gray-800 focus:border-blue-600"
            placeholder="What is this regarding?"
          />
        </div>

        <div>
          <label htmlFor="message" className="block mb-2 text-gray-300">
            Message
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="bg-gray-900 border-gray-800 focus:border-blue-600"
            placeholder="Your message here..."
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>Processing...</>
          ) : (
            <span className="flex items-center justify-center">
              Send Message
              <Send className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </form>
      
      <div className="mt-12 text-center">
        <p className="text-gray-400 mb-4">Prefer to connect on social media?</p>
        <div className="flex justify-center space-x-4">
          <a href="https://github.com/jose-familia" target="_blank" rel="noopener noreferrer" 
             className="text-gray-400 hover:text-blue-400 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/jrfamilia/" target="_blank" rel="noopener noreferrer" 
             className="text-gray-400 hover:text-blue-400 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
            </svg>
          </a>
            <a href="https://www.instagram.com/j.familia18/" target="_blank" rel="noopener noreferrer" 
             className="text-gray-400 hover:text-blue-400 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm8.75 2.25a.75.75 0 1 1 0 1.5h-.005a.75.75 0 0 1 .005-1.5zm-4.5 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
            </svg>
            </a>
        </div>
      </div>
    </div>
  )
}
