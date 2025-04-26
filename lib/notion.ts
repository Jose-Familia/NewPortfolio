import { Client } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"
import slugify from "slugify"

// Configuración de clientes de Notion
const notion = new Client({ auth: process.env.NOTION_API_KEY })
const n2m = new NotionToMarkdown({ notionClient: notion })

// IDs de bases de datos de Notion
const PROJECTS_DB_ID = process.env.NOTION_PROJECTS_DB_ID!
const SKILLS_DB_ID = process.env.NOTION_SKILLS_DB_ID!
const ARTICLES_DB_ID = process.env.NOTION_ARTICLES_DB_ID!
const CERTIFICATIONS_DB_ID = process.env.NOTION_CERTIFICATIONS_DB_ID!
const EDUCATION_DB_ID = process.env.NOTION_EDUCATION_DB_ID!
const WORK_EXPERIENCE_DB_ID = process.env.NOTION_WORK_EXPERIENCE_DB_ID!
const CONTACT_FORM_DB_ID = process.env.NOTION_CONTACT_FORM_DB_ID!

/**
 * Extrae las propiedades de una página de Notion
 * @param page - Página de Notion
 * @returns Objeto con las propiedades extraídas
 */
const getPageProperties = (page: any) => {
  const properties: Record<string, any> = {}

  Object.entries(page.properties).forEach(([key, value]: [string, any]) => {
    try {
      switch (value.type) {
        case "title":
          properties[key] = value.title[0]?.plain_text || ""
          break
        case "rich_text":
          properties[key] = value.rich_text[0]?.plain_text || ""
          break
        case "date":
          properties[key] = value.date?.start || ""
          break
        case "multi_select":
          properties[key] = value.multi_select.map((item: any) => item.name)
          break
        case "select":
          properties[key] = value.select?.name || ""
          break
        case "files":
          if (value.files?.length > 0) {
            properties[key] = value.files[0]?.file?.url || value.files[0]?.external?.url || ""
          } else {
            properties[key] = ""
          }
          break
        case "url":
          properties[key] = value.url || ""
          break
        case "email":
          properties[key] = value.email || ""
          break
        case "checkbox":
          properties[key] = value.checkbox || false
          break
        case "number":
          properties[key] = value.number || 0
          break
        default:
          properties[key] = null
      }
    } catch (error) {
      properties[key] = null
    }
  })

  return properties
}

/**
 * Obtiene proyectos desde Notion
 * @param limit - Límite opcional de proyectos a retornar
 * @returns Array de proyectos
 */
export async function getProjects(limit?: number) {
  try {
    if (!PROJECTS_DB_ID) return []

    const response = await notion.databases.query({
      database_id: PROJECTS_DB_ID,
      page_size: limit ?? 100,
    })

    return response.results.map((page: any) => {
      const props = getPageProperties(page)
      
      return {
        id: page.id,
        title: props.Title || "Untitled Project",
        slug: slugify(props.Title || "untitled", { lower: true, strict: true }),
        description: props.Description || "",
        image: props.Image || "/placeholder.svg",
        tags: props.Tags || [],
        category: props.Category || "Other",
        // Aseguramos que Live URL sea para el demo y Github URL para el código
        liveUrl: props["Live URL"] || props["Live Url"] || props["LiveUrl"] || "",
        githubUrl: props["Github URL"] || props["Github Url"] || props["GithubUrl"] || "",
      }
    })
  } catch (error) {
    return []
  }
}

/**
 * Obtiene un proyecto por su slug
 * @param slug - Slug del proyecto
 * @returns Proyecto encontrado o null
 */
export async function getProjectBySlug(slug: string) {
  try {
    if (!PROJECTS_DB_ID) return null

    const response = await notion.databases.query({
      database_id: PROJECTS_DB_ID,
    })

    // Encuentra el proyecto por slug generado
    const project = response.results.find((page: any) => {
      const props = getPageProperties(page)
      const pageSlug = slugify(props.Title || "untitled", { lower: true, strict: true })
      return pageSlug === slug
    })

    if (!project) return null

    // Obtiene contenido como markdown
    const mdBlocks = await n2m.pageToMarkdown(project.id)
    const mdString = n2m.toMarkdownString(mdBlocks)
    const props = getPageProperties(project)

    return {
      id: project.id,
      title: props.Title || "Untitled Project",
      slug: slugify(props.Title || "untitled", { lower: true, strict: true }),
      description: props.Description || "",
      image: props.Image || "/placeholder.svg",
      tags: props.Tags || [],
      category: props.Category || "Other",
      // Aseguramos que Live URL sea para el demo y Github URL para el código
      liveUrl: props["Live URL"] || props["Live Url"] || props["LiveUrl"] || "",
      githubUrl: props["GitHub URL"] || props["GitHub Url"] || props["GitHubUrl"] || "",
      content: mdString.parent,
    }
  } catch (error) {
    return null
  }
}

/**
 * Obtiene habilidades desde Notion
 * @returns Array de habilidades
 */
export async function getSkills() {
  try {
    if (!SKILLS_DB_ID) return []

    const response = await notion.databases.query({
      database_id: SKILLS_DB_ID,
    })

    return response.results.map((page: any) => {
      const props = getPageProperties(page)
      
      return {
        id: page.id,
        name: props.Name || "Unnamed Skill",
        category: props.Category || "Other",
        icon: props.Icon || "",
      }
    })
  } catch (error) {
    return []
  }
}

/**
 * Obtiene artículos de blog desde Notion
 * @param limit - Límite opcional de artículos a retornar
 * @returns Array de artículos
 */
export async function getArticles(limit?: number) {
  try {
    if (!ARTICLES_DB_ID) return []

    const response = await notion.databases.query({
      database_id: ARTICLES_DB_ID,
      page_size: limit ?? 100,
    })

    return response.results.map((page: any) => {
      const props = getPageProperties(page)
      
      return {
        id: page.id,
        title: props.Title || "Untitled Article",
        slug: props.Slug || slugify(props.Title || "untitled", { lower: true, strict: true }),
        excerpt: props.Excerpt || "",
        coverImage: props["Cover Image"] || "",
        date: props.Date || new Date().toISOString(),
        tags: props.Tags || [],
      }
    })
  } catch (error) {
    return []
  }
}

/**
 * Obtiene un artículo por su slug
 * @param slug - Slug del artículo
 * @returns Artículo encontrado o null
 */
export async function getArticleBySlug(slug: string) {
  try {
    if (!ARTICLES_DB_ID) return null

    // Primero intentamos buscar por el campo Slug exacto
    let response = await notion.databases.query({
      database_id: ARTICLES_DB_ID,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
      page_size: 1,
    })

    // Si no encontramos el artículo por Slug, obtenemos todos y comparamos por título slugificado
    if (response.results.length === 0) {
      const allArticles = await notion.databases.query({
        database_id: ARTICLES_DB_ID,
      })

      // Buscamos un artículo cuyo título slugificado coincida con el slug solicitado
      const matchingArticle = allArticles.results.find((page: any) => {
        const props = getPageProperties(page)
        const titleSlug = slugify(props.Title || "untitled", { lower: true, strict: true })
        return titleSlug === slug
      })

      if (matchingArticle) {
        response = { results: [matchingArticle] }
      }
    }

    if (response.results.length === 0) return null

    const page = response.results[0]
    const mdBlocks = await n2m.pageToMarkdown(page.id)
    const mdString = n2m.toMarkdownString(mdBlocks)
    const props = getPageProperties(page)

    return {
      id: page.id,
      title: props.Title || "Untitled Article",
      slug: props.Slug || slugify(props.Title || "untitled", { lower: true, strict: true }),
      excerpt: props.Excerpt || "",
      coverImage: props["Cover Image"] || "",
      date: props.Date || new Date().toISOString(),
      tags: props.Tags || [],
      content: props.Content || mdString.parent,
    }
  } catch (error) {
    return null
  }
}

/**
 * Obtiene experiencia laboral desde Notion
 * @returns Array de experiencias laborales
 */
export async function getWorkExperience() {
  try {
    if (!WORK_EXPERIENCE_DB_ID) return []

    const response = await notion.databases.query({
      database_id: WORK_EXPERIENCE_DB_ID,
    })

    return response.results.map((page: any) => {
      const props = getPageProperties(page)
      
      // Buscar el título con diferentes variaciones posibles
      const title = 
        props["Titulo del Puesto"] || 
        props["Título del Puesto"] ||
        props["Title"] ||
        props["Position"] ||
        "Unnamed Position"
      
      // Buscar la descripción con diferentes variaciones
      const description = 
        props["Descripcion"] || 
        props["Descripción"] ||
        props["Description"] || 
        ""
      
      // Buscar la ubicación con diferentes variaciones
      const location = 
        props["Ubicacion"] || 
        props["Ubicación"] ||
        props["Location"] || 
        ""
      
      // Buscar habilidades con diferentes variaciones
      const skills = 
        props["Habilidades"] || 
        props["Skills"] || 
        []
      
      return {
        id: page.id,
        title: title,
        company: props["Empresa"] || props["Company"] || "",
        startDate: props["Fecha de Inicio"] || props["Start Date"] || "",
        endDate: props["Fecha de Fin"] || props["End Date"] || "Presente",
        period: props["Periodo"] || props["Period"] || "",
        description: description,
        location: location,
        skills: skills,
      }
    })
  } catch (error) {
    return []
  }
}

/**
 * Obtiene formación académica desde Notion
 * @returns Array de formaciones académicas
 */
export async function getEducation() {
  try {
    if (!EDUCATION_DB_ID) return []

    const response = await notion.databases.query({
      database_id: EDUCATION_DB_ID,
    })

    return response.results.map((page: any) => {
      const props = getPageProperties(page)
      
      // Mapear correctamente los campos con sus nombres exactos de Notion
      return {
        id: page.id,
        degree: props["Título del grado"] || props["Titulo del grado"] || "",
        institution: props["Institución"] || props["Institucion"] || "",
        period: props["Periodo"] || "",
        location: props["Ubicación"] || props["Ubicacion"] || "",
        description: props["Descripción"] || props["Descripcion"] || "",
      }
    })
  } catch (error) {
    console.error("Error fetching education from Notion:", error)
    return []
  }
}

/**
 * Obtiene certificaciones desde Notion
 * @returns Array de certificaciones
 */
export async function getCertifications() {
  try {
    if (!CERTIFICATIONS_DB_ID) return []

    const response = await notion.databases.query({
      database_id: CERTIFICATIONS_DB_ID,
    })

    return response.results.map((page: any) => {
      const props = getPageProperties(page)
      
      return {
        id: page.id,
        name: props.Nombre || "Unnamed Certification",
        issuer: props["Entidad emisora"] || "",
        date: props["Fecha de emisión"] || "",
        credentialId: props["ID de credencial"] || "",
        url: props["URL de verificación"] || "",
        tags: props["Tags relacionados"] || [],
        icon: props.Icono || "",
      }
    })
  } catch (error) {
    return []
  }
}

/**
 * Genera un slug desde un string
 * @param text - Texto a convertir en slug
 * @returns Slug generado
 */
export function generateSlug(text: string): string {
  return slugify(text || "untitled", { 
    lower: true, 
    strict: true,
    remove: /[*+~.()'"!:@]/g
  })
}

// Función para enviar formulario de contacto
export async function sendContactForm(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    if (!CONTACT_FORM_DB_ID) {
      console.error("⚠️ CONTACT_FORM_DB_ID no está definido en .env")
      return false
    }

    await notion.pages.create({
      parent: { database_id: CONTACT_FORM_DB_ID },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: formData.name,
              },
            },
          ],
        },
        Email: {
          email: formData.email,
        },
        Subject: {
          rich_text: [
            {
              text: {
                content: formData.subject,
              },
            },
          ],
        },
        Message: {
          rich_text: [
            {
              text: {
                content: formData.message,
              },
            },
          ],
        },
        Status: {
          select: {
            name: "New",
          },
        },
        Date: {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    })
    return true
  } catch (error) {
    console.error("Error sending contact form to Notion:", error)
    return false
  }
}

// Get article by ID
export async function getArticleById(id: string) {
  try {
    const page = await notion.pages.retrieve({ page_id: id })
    const mdBlocks = await n2m.pageToMarkdown(id)
    const mdString = n2m.toMarkdownString(mdBlocks)
    const props = getPageProperties(page)

    return {
      id: page.id,
      title: props.title || "Untitled Article",
      slug: props.slug || slugify(props.title || "Untitled Article"),
      excerpt: props.excerpt || "",
      coverImage: props.coverimage || "",
      date: props.date || new Date().toISOString(),
      tags: props.tags || [],
      content: mdString.parent,
    }
  } catch (error) {
    console.error(`Error fetching article with id ${id} from Notion:`, error)
    return null
  }
}

// Get project by ID
export async function getProjectById(id: string) {
  try {
    const page = await notion.pages.retrieve({ page_id: id })
    const mdBlocks = await n2m.pageToMarkdown(id)
    const mdString = n2m.toMarkdownString(mdBlocks)
    const props = getPageProperties(page)

    return {
      id: page.id,
      title: props.title || "Untitled Project",
      slug: props.slug || slugify(props.title || "Untitled Project"),
      description: props.description || "",
      image: props.image || "",
      tags: props.tags || [],
      category: props.category || "Frontend",
      // Intercambio de las propiedades
      url: props.github || "",
      github: props.url || "",
      content: mdString.parent,
    }
  } catch (error) {
    console.error(`Error fetching project with id ${id} from Notion:`, error)
    return null
  }
}

// Función de ayuda para listar todas las propiedades disponibles en una base de datos
export async function listDatabaseProperties(databaseId: string) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 1,
    });
    
    if (response.results && response.results.length > 0) {
      const page = response.results[0];
      // Lista todas las propiedades con su tipo
      const properties: { name: string; type: string }[] = "properties" in page ? Object.entries(page.properties).map(([name, prop]: [string, any]) => ({
        name,
        type: prop.type,
      })) : [];
      console.log(`Properties for database ${databaseId}:`, properties);
      return properties;
    }
    
    return [];
  } catch (error) {
    console.error(`Error listing properties for database ${databaseId}:`, error);
    return [];
  }
}
