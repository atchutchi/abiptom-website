interface PDFPreviewProps {
  pdfUrl: string;
  title: string;
  description: string;
}

export function PDFPreview({ pdfUrl, title, description }: PDFPreviewProps) {
  return (
    <div className="group overflow-hidden rounded-lg border">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <iframe
          src={`${pdfUrl}#page=1&view=Fit`}
          className="w-full h-full"
          style={{ border: "none" }}
        />
        <a 
          href={pdfUrl}
          target="_blank"
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button className="bg-yellow text-black hover:bg-yellow-hover px-4 py-2 rounded-md font-medium">
            Ver PDF
          </button>
        </a>
      </div>
      <div className="p-4">
        <h3 className="font-bold font-bauhaus">{title}</h3>
        <p className="text-sm text-gray-dark">
          {description}
        </p>
      </div>
    </div>
  )
} 