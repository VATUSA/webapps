import type { StaffEntry } from "@/components/MembersStaff/StaffList"

// Hand-maintained: Cobalt's role model collapses the 9 division director
// seats (VATUSA1-9) into just division_staff/division_management, so there's
// no way to derive who holds which specific seat from Cobalt. Update this
// list directly when a seat changes hands.
export const DIVISION_STAFF: StaffEntry[] = [
  {
    id: "vatusa1",
    position: "VATUSA1 - Division Director",
    name: "Brandon Barrett",
    email: "vatusa1@vatusa.net",
  },
  {
    id: "vatusa2",
    position: "VATUSA2 - Deputy Director Air Traffic Services",
    name: "Brandon Wening",
    email: "vatusa2@vatusa.net",
  },
  {
    id: "vatusa3",
    position: "VATUSA3 - Deputy Director Training Services",
    name: "Brin Brody",
    email: "vatusa3@vatusa.net",
  },
  {
    id: "vatusa4",
    position: "VATUSA4 - Deputy Director Support Services",
    name: "Jared West",
    email: "vatusa4@vatusa.net",
  },
  {
    id: "vatusa5",
    position: "VATUSA5 - Events Manager",
    name: "Dan Michael Bonaga",
    email: "vatusa5@vatusa.net",
  },
  {
    id: "vatusa6",
    position: "VATUSA6 - Technical Manager",
    name: "Matt Boulanger",
    email: "vatusa6@vatusa.net",
  },
  {
    id: "vatusa7",
    position: "VATUSA7 - Social Media Manager",
    name: "Jason Calder",
    email: "vatusa7@vatusa.net",
  },
  {
    id: "vatusa8",
    position: "VATUSA8 - Training Services Manager",
    name: "Ashar Hussain",
    email: "vatusa8@vatusa.net",
  },
  {
    id: "vatusa9",
    position: "VATUSA9 - Training Content and Curriculum Manager",
    name: "Andrew Selder",
    email: "vatusa9@vatusa.net",
  },
]
