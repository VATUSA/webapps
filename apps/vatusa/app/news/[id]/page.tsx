import { notFound } from "next/navigation"
import NewsPostDetail from "@/components/News/NewsPostDetail"
import { fetchNewsPostById } from "@/actions/news"

type NewsPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: NewsPageProps) {
  const { id: idParam } = await params
  const id = Number(idParam)

  if (!Number.isInteger(id) || id <= 0) {
    notFound()
  }

  const post = await fetchNewsPostById(id)
  if (!post) {
    notFound()
  }

  return (
    <main className="container mx-auto py-6">
      <NewsPostDetail post={post} />
    </main>
  )
}
