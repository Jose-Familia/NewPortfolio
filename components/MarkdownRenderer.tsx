"use client"

import { useState, useEffect } from "react"

interface MarkdownRendererProps {
  content: string
}

/**
 * Convierte texto de Notion a HTML preservando su estilo original
 */
function notionToHtml(content: string): string {
  if (!content) return "<p>No content available</p>";
  
  // Preservar bloques de código antes de procesamiento
  const codeBlocks: string[] = [];
  let html = content.replace(/```([\s\S]*?)```/g, (match) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(match);
    return placeholder;
  });
  
  // Escapar caracteres HTML para evitar inyecciones
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // 1. Encabezados con clases de estilo Notion
  html = html
    .replace(/^# (.*$)/gm, '<h1 class="notion-h1">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="notion-h2">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="notion-h3">$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4 class="notion-h4">$1</h4>')
    .replace(/^##### (.*$)/gm, '<h5 class="notion-h5">$1</h5>')
    .replace(/^###### (.*$)/gm, '<h6 class="notion-h6">$1</h6>');
  
  // 2. Formato de texto - estilo Notion
  
  // Texto resaltado (highlight) - Notion usa ==texto== para resaltar
  html = html.replace(/==(.*?)==/g, '<mark class="notion-highlight">$1</mark>');
  
  // Negrita
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="notion-bold">$1</strong>');
  
  // Cursiva
  html = html.replace(/\*(.*?)\*/g, '<em class="notion-italic">$1</em>');
  
  // Tachado
  html = html.replace(/~~(.*?)~~/g, '<del class="notion-strikethrough">$1</del>');
  
  // Código en línea
  html = html.replace(/`([^`]+)`/g, '<code class="notion-inline-code">$1</code>');
  
  // Enlaces
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="notion-link">$1</a>');
  
  // 3. Bloques especiales de Notion
  
  // Divisores (líneas horizontales)
  html = html.replace(/^-{3,}$/gm, '<hr class="notion-hr">');
  
  // Bloques de callout (formato simplificado)
  html = html.replace(/>\s*\[!NOTE\]\s*([\s\S]*?)(?=\n\n|$)/g, 
    '<div class="notion-callout notion-callout-note"><div class="notion-callout-content">$1</div></div>');
  html = html.replace(/>\s*\[!WARNING\]\s*([\s\S]*?)(?=\n\n|$)/g, 
    '<div class="notion-callout notion-callout-warning"><div class="notion-callout-content">$1</div></div>');
  
  // Citas
  html = html.replace(/^>\s*(.*$)/gm, '<blockquote class="notion-quote">$1</blockquote>');
  
  // 4. Tablas - soporte completo
  
  // Procesar tablas - identificamos bloques de tabla completos
  let inTable = false;
  let tableContent = '';
  const lines = html.split('\n');
  const processedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Detectar inicio o contenido de tabla
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        // Inicio de una nueva tabla
        inTable = true;
        tableContent = '<table class="notion-table"><tbody>';
      }
      
      // Filtrar líneas de separación en tablas (e.g., | --- | --- |)
      if (!/^\|[\s-]+\|[\s-\|]*$/.test(line)) {
        // Es una fila de datos, procesarla
        let row = '<tr>';
        
        // Extraer celdas eliminando el primer y último |
        const cells = line.substring(1, line.length - 1).split('|');
        
        for (let cell of cells) {
          const cellContent = cell.trim();
          // Detectar si es un encabezado (usamos esto si es la primera fila)
          if (i === 0 || (i === 2 && lines[1].trim().match(/^\|[\s:-]+\|[\s:-\|]*$/))) {
            row += `<th class="notion-th">${cellContent}</th>`;
          } else {
            row += `<td class="notion-td">${cellContent}</td>`;
          }
        }
        
        row += '</tr>';
        tableContent += row;
      }
      
      continue;
    }
    
    // Detectar fin de tabla
    if (inTable && !line.startsWith('|')) {
      tableContent += '</tbody></table>';
      processedLines.push(tableContent);
      inTable = false;
      tableContent = '';
    }
    
    // Si no estamos procesando una tabla, añadir la línea normalmente
    if (!inTable) {
      processedLines.push(lines[i]);
    }
  }
  
  // Cerrar una tabla si terminó el contenido
  if (inTable) {
    tableContent += '</tbody></table>';
    processedLines.push(tableContent);
  }
  
  html = processedLines.join('\n');
  
  // 5. Listas (con estilos de Notion)
  
  // Dividir el contenido en líneas para un procesamiento más preciso
  inTable = false;
  let inList = false;
  let listType = '';
  let listItems = [];
  let listLevel = 0;
  
  const lines2 = html.split('\n');
  const processedLines2 = [];
  
  for (let i = 0; i < lines2.length; i++) {
    const line = lines2[i];
    
    // Detectar listas no ordenadas con diferentes niveles de indentación
    const ulMatch = line.match(/^(\s*)[\*\-] (.*)$/);
    if (ulMatch) {
      const [_, indent, content] = ulMatch;
      const currentLevel = Math.floor(indent.length / 2);
      
      if (!inList || listType !== 'ul' || currentLevel !== listLevel) {
        if (inList) {
          // Cerrar lista anterior
          processedLines2.push(`</${listType}>`);
          listItems = [];
        }
        inList = true;
        listType = 'ul';
        listLevel = currentLevel;
      }
      
      listItems.push(`<li class="notion-list-item">${content}</li>`);
      continue;
    }
    
    // Detectar listas ordenadas
    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (olMatch) {
      const [_, indent, content] = olMatch;
      const currentLevel = Math.floor(indent.length / 2);
      
      if (!inList || listType !== 'ol' || currentLevel !== listLevel) {
        if (inList) {
          // Cerrar lista anterior
          processedLines2.push(`</${listType}>`);
          listItems = [];
        }
        inList = true;
        listType = 'ol';
        listLevel = currentLevel;
      }
      
      listItems.push(`<li class="notion-list-item">${content}</li>`);
      continue;
    }
    
    // Si no es un item de lista pero estábamos en una lista, cerrarla
    if (inList && !ulMatch && !olMatch) {
      const listClass = listType === 'ul' ? 'notion-list notion-list-disc' : 'notion-list notion-list-numbered';
      processedLines2.push(`<${listType} class="${listClass}">${listItems.join('')}</${listType}>`);
      inList = false;
      listItems = [];
    }
    
    // Procesar la línea normal
    processedLines2.push(line);
  }
  
  // Cerrar cualquier lista abierta al final
  if (inList) {
    const listClass = listType === 'ul' ? 'notion-list notion-list-disc' : 'notion-list notion-list-numbered';
    processedLines2.push(`<${listType} class="${listClass}">${listItems.join('')}</${listType}>`);
  }
  
  html = processedLines2.join('\n');
  
  // 6. Restaurar bloques de código con sintaxis highlighting
  codeBlocks.forEach((block, index) => {
    const code = block.replace(/```(?:(\w+)\n)?([\s\S]*?)```/g, (_, lang, content) => {
      const language = lang ? ` data-language="${lang}"` : '';
      return `<pre class="notion-code"${language}><code>${content.trim()}</code></pre>`;
    });
    html = html.replace(`__CODE_BLOCK_${index}__`, code);
  });
  
  // 7. Procesar párrafos y espaciado
  
  // Divide por líneas vacías que son separadores de párrafos en Notion
  const blocks = html.split(/\n\s*\n/);
  
  // Procesa cada bloque
  html = blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    
    // Si ya es un elemento HTML formatado, no lo envuelvas
    if (/^<(h[1-6]|ul|ol|li|pre|blockquote|div|p|table|hr)/.test(block)) {
      return block;
    }
    
    // Convierte saltos de línea a <br> dentro de párrafos
    return `<p class="notion-paragraph">${block.replace(/\n/g, '<br>')}</p>`;
  }).join('\n\n');
  
  // 8. Imágenes con estilo Notion
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, 
    '<figure class="notion-image"><img src="$2" alt="$1" class="notion-image-inner" /><figcaption class="notion-image-caption">$1</figcaption></figure>');
  
  return html;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    try {
      const renderedHtml = notionToHtml(content);
      setHtml(renderedHtml);
    } catch (error) {
      console.error("Error rendering content:", error);
      setHtml("<p>Error displaying content</p>");
    }
  }, [content]);

  return (
    <div 
      className="prose prose-invert prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300 max-w-none notion-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}