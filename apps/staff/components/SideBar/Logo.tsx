import Image from "next/image"

import { cn } from "@workspace/ui/lib/utils"

type LogoProps = {
  src: string
  alt: string
  className?: string
}

export function Logo({ src, alt, className }: LogoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={64}
      height={64}
      draggable={false}
      sizes="64px"
      unoptimized
      className={cn("size-4 shrink-0 object-contain", className)}
    />
  )
}
