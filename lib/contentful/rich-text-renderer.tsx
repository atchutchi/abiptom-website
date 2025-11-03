import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, Document } from '@contentful/rich-text-types'
import Image from 'next/image'
import Link from 'next/link'

// Opções para renderizar rich text do Contentful
export const richTextOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node: any, children: React.ReactNode) => (
      <p className="mb-4 text-gray-dark leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (_node: any, children: React.ReactNode) => (
      <h1 className="text-4xl font-bauhaus font-bold text-black mt-8 mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (_node: any, children: React.ReactNode) => (
      <h2 className="text-3xl font-bauhaus font-bold text-black mt-6 mb-3">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (_node: any, children: React.ReactNode) => (
      <h3 className="text-2xl font-bauhaus font-bold text-black mt-5 mb-2">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (_node: any, children: React.ReactNode) => (
      <h4 className="text-xl font-bauhaus font-bold text-black mt-4 mb-2">{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (_node: any, children: React.ReactNode) => (
      <h5 className="text-lg font-bauhaus font-bold text-black mt-3 mb-1">{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (_node: any, children: React.ReactNode) => (
      <h6 className="text-base font-bauhaus font-bold text-black mt-2 mb-1">{children}</h6>
    ),
    [BLOCKS.UL_LIST]: (_node: any, children: React.ReactNode) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-dark">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node: any, children: React.ReactNode) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-dark">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node: any, children: React.ReactNode) => (
      <li className="ml-4">{children}</li>
    ),
    [BLOCKS.QUOTE]: (_node: any, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-yellow pl-4 italic my-4 text-gray-600">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-gray-300" />,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { file, title } = node.data.target.fields
      const url = file.url.startsWith('//') ? `https:${file.url}` : file.url
      
      if (file.contentType.startsWith('image/')) {
        return (
          <div className="my-6">
            <Image
              src={url}
              alt={title || 'Blog image'}
              width={800}
              height={450}
              className="rounded-lg w-full h-auto"
            />
          </div>
        )
      }
      
      return null
    },
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => {
      const { uri } = node.data
      
      // Link externo
      if (uri.startsWith('http')) {
        return (
          <a
            href={uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow hover:text-yellow-hover underline"
          >
            {children}
          </a>
        )
      }
      
      // Link interno
      return (
        <Link href={uri} className="text-yellow hover:text-yellow-hover underline">
          {children}
        </Link>
      )
    },
  },
}

// Componente para renderizar rich text
export function RichTextRenderer({ content }: { content: Document }) {
  return <>{documentToReactComponents(content, richTextOptions)}</>
}

