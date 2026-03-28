import { type Metadata } from "next"
import MembersStaffContent from "@/components/MembersStaff/MembersStaffContent"

export const metadata: Metadata = {
  title: "Members & Staff | VATUSA",
  description: "Browse VATUSA staff positions and search for members",
}

export default function Page() {
  return <MembersStaffContent />
}
