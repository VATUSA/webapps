import EventCalendar from "@/components/Events/EventCalendar/EventCalendar"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events Calendar | VATUSA",
  description: "Browse and explore upcoming VATUSA events",
}

export default function Page() {
  return (
    <EventCalendar />
  )
}