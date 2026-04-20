import NewsForm from "@/components/News/NewsForm"

export default async function NewNewsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <NewsForm mode="create" facilityId={id.toLowerCase()} />
    </main>
  )
}

