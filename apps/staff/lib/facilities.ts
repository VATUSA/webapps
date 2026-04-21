export type FacilityOption = {
  code: string
  name: string
}

export const EVENT_FACILITY_OPTIONS: FacilityOption[] = [
  { code: "ZAE", name: "VATUSA" },
  { code: "ZHQ", name: "VATUSA" },
  { code: "ZAB", name: "Albuquerque ARTCC" },
  { code: "ZAK", name: "Anchorage ARTCC" },
  { code: "ZTL", name: "Atlanta ARTCC" },
  { code: "ZBW", name: "Boston ARTCC" },
  { code: "ZAU", name: "Chicago ARTCC" },
  { code: "ZOB", name: "Cleveland ARTCC" },
  { code: "ZDV", name: "Denver ARTCC" },
  { code: "ZFW", name: "Fort Worth ARTCC" },
  { code: "HCF", name: "Honolulu ARTCC" },
  { code: "ZHU", name: "Houston ARTCC" },
  { code: "ZID", name: "Indianapolis ARTCC" },
  { code: "ZJX", name: "Jacksonville ARTCC" },
  { code: "ZKC", name: "Kansas City ARTCC" },
  { code: "ZLA", name: "Los Angeles ARTCC" },
  { code: "ZME", name: "Memphis ARTCC" },
  { code: "ZMA", name: "Miami ARTCC" },
  { code: "ZMP", name: "Minneapolis ARTCC" },
  { code: "ZNY", name: "New York ARTCC" },
  { code: "ZOA", name: "Oakland ARTCC" },
  { code: "ZLC", name: "Salt Lake City ARTCC" },
  { code: "ZSE", name: "Seattle ARTCC" },
  { code: "ZDC", name: "Washington, D.C. ARTCC" },
]

export const EVENT_FACILITY_IDS = EVENT_FACILITY_OPTIONS.map(
  (facility) => facility.code
)
