import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

type SectionPlaceholderProps = {
  title: string
  description: string
  facilityId: string
}

export function SectionPlaceholder({
  title,
  description,
  facilityId,
}: SectionPlaceholderProps) {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>{description}</p>
          <p>
            Active facility: <span className="font-medium text-foreground">{facilityId.toUpperCase()}</span>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

