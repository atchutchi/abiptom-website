"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type VideoEmbedProps = {
  thumbnailSrc: string
  videoSrc: string
  title: string
  aspectRatio?: string
}

export const VideoEmbed = ({
  thumbnailSrc,
  videoSrc,
  title,
  aspectRatio = "16/9",
}: VideoEmbedProps) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => setIsPlaying(true)

  return (
    <div
      className="relative overflow-hidden bg-obys-dark"
      style={{ aspectRatio }}
    >
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            className="absolute inset-0 z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={thumbnailSrc}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button
                onClick={handlePlay}
                className="btn-obys--play flex items-center justify-center transition-transform duration-obys ease-obys-default hover:scale-110"
                aria-label={`Reproduzir vídeo: ${title}`}
                type="button"
              >
                <Play className="w-6 h-6 ml-1" fill="currentColor" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isPlaying && (
        <iframe
          src={videoSrc}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  )
}
