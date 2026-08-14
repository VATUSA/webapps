import { notFound } from "next/navigation"
import NewsPostDetail from "@/components/News/NewsPostDetail"
import { fetchNewsPostById } from "@/actions/news"
import { Metadata } from "next"

// Keep in sync with PUBLIC_REVALIDATE_SECONDS in @/lib/cache — Next.js requires
// this to be a statically analyzable literal.
export const revalidate = 300

// Returning an empty array prerenders nothing at build time but marks the route
// static-capable, so each post is rendered once on first visit and then served
// from cache. Without this Next.js renders every request from scratch, which is
// what let scraper traffic saturate the event loop.
export async function generateStaticParams() {
  return []
}

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
    const post = await fetchNewsPostById(id)
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
