"use client"

import * as React from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import type { FAQCategory } from "@/components/Support/FAQ/faq-data"

type FAQPageContentProps = {
  categories: FAQCategory[]
  supportTicketHref: string
}

export default function FAQPageContent({
  categories,
  supportTicketHref,
}: FAQPageContentProps) {
  const [activeHash, setActiveHash] = React.useState("")

  const handleAnchorClick = (id: string) => {
    setActiveHash(id)
  }

  React.useEffect(() => {
    const updateHash = () => {
      setActiveHash(window.location.hash.replace(/^#/, ""))
    }

    updateHash()
    window.addEventListener("hashchange", updateHash)
    return () => window.removeEventListener("hashchange", updateHash)
  }, [])

  return (
    <main className="container mx-auto py-6">
      <header className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          VATUSA Support Knowledgebase
        </h1>
        <p className="text-sm text-muted-foreground">
          Cannot find an answer?{" "}
          <Link
            href={supportTicketHref}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Submit a support ticket
          </Link>
          .
        </p>
      </header>

      <section className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id} className="border-border/60 bg-card/95">
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-md border border-border/60">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/30 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      <th className="w-16 px-4 py-2">#</th>
                      <th className="px-4 py-2">Question</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item, idx) => {
                      const href = `#${item.id}`
                      const isActive = activeHash === item.id
                      return (
                        <tr
                          key={item.id}
                          className="group border-b border-border/50 transition-colors hover:[&>td]:bg-muted/50 dark:hover:[&>td]:bg-muted/80"
                        >
                          <td
                            className={`px-4 py-3 text-muted-foreground transition-colors ${
                              isActive ? "bg-primary/15 dark:bg-primary/25" : ""
                            }`}
                          >
                            <Link
                              href={href}
                              onClick={() => handleAnchorClick(item.id)}
                              className="-mx-4 -my-3 block px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                            >
                              {idx + 1}
                            </Link>
                          </td>
                          <td
                            className={`px-4 py-3 transition-colors ${
                              isActive ? "bg-primary/15 dark:bg-primary/25" : ""
                            }`}
                          >
                            <Link
                              href={href}
                              onClick={() => handleAnchorClick(item.id)}
                              className="-mx-4 -my-3 block px-4 py-3 font-medium text-foreground underline-offset-4 outline-none group-hover:text-primary hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring/50"
                            >
                              {item.question}
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-8 space-y-4">
        {categories.map((category) => (
          <Card
            key={`${category.id}-answers`}
            className="border-border/60 bg-card/95"
          >
            <CardHeader>
              <CardTitle>{category.title} Answers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.items.map((item, idx) => {
                const isActive = activeHash === item.id
                return (
                  <article
                    key={item.id}
                    id={item.id}
                    className={`scroll-mt-28 rounded-md border p-4 transition-colors ${
                      isActive
                        ? "border-primary/70 bg-primary/15 ring-2 ring-primary/35 dark:bg-primary/25"
                        : "border-border/60 bg-background/40"
                    }`}
                  >
                    <h3 className="font-semibold text-foreground">
                      {idx + 1}. {item.question}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                    <div className="mt-2">
                      <Link
                        href={`#${item.id}`}
                        onClick={() => handleAnchorClick(item.id)}
                        className="text-xs text-primary underline-offset-4 hover:underline"
                      >
                        Copy/share link
                      </Link>
                    </div>
                  </article>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  )
}
