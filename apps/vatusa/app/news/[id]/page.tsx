import { notFound } from "next/navigation"
import NewsPostDetail from "@/components/News/NewsPostDetail"
import { fetchNewsPostById } from "@/actions/news"
import { Metadata } from "next"
import { getNewsPostById } from "@workspace/third-party/cobalt"

type NewsPageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const post = await getNewsPostById(id)
    return {
      title: `${post?.title} | VATUSA News`,
      description: post?.body?.substring(0, 160) || "VATUSA News Post",
    }
  } catch {
    return {
      title: "News Post Not Found | VATUSA",
      description: "This news post could not be found",
    }
  }
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
