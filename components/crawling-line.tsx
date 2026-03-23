"use client"

type CrawlingLineProps = {
  items: string[]
  separator?: string
  speed?: number
  className?: string
}

export const CrawlingLine = ({
  items,
  separator = "•",
  speed = 30,
  className = "",
}: CrawlingLineProps) => {
  const repeatedItems = [...items, ...items, ...items, ...items]

  const content = repeatedItems
    .map((item) => `${item} ${separator} `)
    .join("")

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className="inline-flex animate-crawling-line"
        style={
          {
            "--crawl-duration": `${speed}s`,
          } as React.CSSProperties
        }
      >
        <span className="text-crawling text-obys-text-muted select-none pr-4">
          {content}
        </span>
        <span className="text-crawling text-obys-text-muted select-none pr-4">
          {content}
        </span>
      </div>
    </div>
  )
}
