import * as React from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"

export function EventCarousel() {
  return (
    <Carousel className="mx-auto w-full max-w-6xl px-12 sm:px-14">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="overflow-hidden">
                <CardContent className="aspect-video p-0">
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-2 sm:left-3" />
      <CarouselNext className="right-2 sm:right-3" />
    </Carousel>
  )
}
