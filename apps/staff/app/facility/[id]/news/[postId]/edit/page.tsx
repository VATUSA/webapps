import { notFound } from "next/navigation"
import NewsForm from "@/components/News/NewsForm"
import { fetchNewsPostForEdit } from "@/actions/news"

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string; postId: string }>
}) {
  const { id, postId } = await params
  const newsId = Number(postId)

  if (!Number.isInteger(newsId) || newsId <= 0) {
    notFound()
  }

  const news = await fetchNewsPostForEdit(newsId)
  if (!news) {
    notFound()
  }

  const facilitySlug = id.toLowerCase()

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <NewsForm mode="edit" facilityId={facilitySlug} news={news} />
    </main>
  )
}
