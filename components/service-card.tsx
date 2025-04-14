import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ServiceCardProps {
  title: string
  description: string
  icon: string
  link: string
}

export function ServiceCard({ title, description, icon, link }: ServiceCardProps) {
  // Dynamically get the icon from Lucide
  const Icon = LucideIcons[icon as keyof typeof LucideIcons] as LucideIcon

  return (
    <Link href={link} className="group">
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="pb-2">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-light text-black group-hover:bg-yellow group-hover:text-black transition-colors">
            {Icon && <Icon className="h-5 w-5" />}
          </div>
          <CardTitle className="font-bauhaus group-hover:text-yellow transition-colors">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-dark">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}
