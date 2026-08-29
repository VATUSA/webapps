import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, test } from "vitest"
import { MarkdownContent } from "./markdown-content.js"

/**
 * Fixtures below are drawn from real `news_post.body` / `event.body` rows in
 * the cobalt production DB (surveyed 2026-08-29), to make sure the renderer
 * actually handles what staff post rather than a theoretical Markdown
 * feature set. See individual test names for the row pattern each covers.
 */

function render(content: string) {
  return renderToStaticMarkup(<MarkdownContent content={content} />)
}

describe("MarkdownContent — standard Markdown used in production", () => {
  test("bold, italics, heading, bullet list (news_post id 13/18/19 style)", () => {
    const html = render(
      "# Position Posting: Atlanta ARTCC Events Coordinator\n\n" +
        "**Purpose:** support the facility.\n\n" +
        "This event is *first come, first served*.\n\n" +
        "* Reports to the DATM; ATM and VATUSA5 as necessary.\n" +
        "* Maintains a positive relationship with staff."
    )

    expect(html).toContain("<h1")
    expect(html).toContain("Position Posting: Atlanta ARTCC Events Coordinator")
    expect(html).toContain("<strong>Purpose:</strong>")
    expect(html).toContain("<em>first come, first served</em>")
    expect(html).toContain("<ul")
    expect(html).toContain("Reports to the DATM")
  })

  test("markdown link and image (news_post id 47 style)", () => {
    const html = render(
      "![Indy Center](https://i.postimg.cc/25gg5p0N/Stacked-No.png)\n\n" +
        "# Staff Openings at Indy Center\n\n" +
        "email [atm@flyindycenter.com](mailto:atm@flyindycenter.com)"
    )

    expect(html).toContain('<img src="https://i.postimg.cc/25gg5p0N/Stacked-No.png"')
    expect(html).toContain('alt="Indy Center"')
    expect(html).toContain('href="mailto:atm@flyindycenter.com"')
    expect(html).toContain(">atm@flyindycenter.com</a>")
  })

  test("trailing-backslash hard line break (used in 80% of news_post rows)", () => {
    const html = render(
      "**Enroute**: SEA_CTR - *ZSE*  \\\n" + "**Approach**: SEA_APP - *S46*"
    )

    // A trailing backslash is a CommonMark hard break -> a real <br> between
    // the two lines, not a literal backslash character left in the text.
    expect(html).not.toContain("\\")
    expect(html).toMatch(/SEA_CTR[\s\S]*<br\/?>[\s\S]*SEA_APP/)
  })

  test("plain prose with no markup at all (event id 2/3 style — the most common real event.body)", () => {
    const content =
      "Welcome to... THE WHEEL! This is a signature ZHU event which allows all of " +
      "VATUSA to come together as one and control as many airports within ZHU as possible."

    const html = render(content)

    expect(html).toContain(content)
  })
})

describe("MarkdownContent — embedded raw HTML (the <br>/<u> regression)", () => {
  test("bare <br /> between markdown blocks renders as an actual line break, not literal text", () => {
    const html = render(
      "This is **bold**, *italics*, and plain.\n\n" +
        "> block quote\n\n" +
        "<br />\n\n" +
        "Some `code` thing."
    )

    expect(html).not.toContain("&lt;br")
    expect(html).not.toContain("<br />\n\n") // not left as literal source text
    expect(html).toMatch(/<br\s*\/?>/)
    expect(html).toContain("<blockquote")
  })

  test("<br> and <br /> mid-paragraph (event id 10152 / news_post id 19 style)", () => {
    const html = render(
      "Date Posted: February 12, 2026 <br>\nSubmission Deadline: February 19, 2026"
    )

    expect(html).not.toContain("&lt;br")
    expect(html).toMatch(/<br\s*\/?>/)
  })

  test("<u> wrapping bold markdown (news_post id 18: <u>**Enroute Top 3**</u>)", () => {
    const html = render("<u>**Enroute Top 3**</u>")

    expect(html).toContain("<u>")
    expect(html).toContain("<strong>Enroute Top 3</strong>")
    expect(html).not.toContain("&lt;u&gt;")
  })
})

describe("MarkdownContent — sanitization allowlist", () => {
  test("only <u> and <br> are allowed through; other raw HTML is stripped, not executed", () => {
    const html = render(
      '<script>alert("xss")</script><img src=x onerror="alert(1)">' +
        "<u>underlined</u><br />plain text"
    )

    expect(html).not.toContain("<script")
    expect(html).not.toContain("onerror")
    expect(html).not.toContain("alert(")
    expect(html).toContain("<u>underlined</u>")
    expect(html).toMatch(/<br\s*\/?>/)
  })
})

describe("MarkdownContent — legacy BBCode event content (no genuine Markdown)", () => {
  test("BBCode tokens render inertly as literal text without throwing (event id 10152 style)", () => {
    const content =
      "[img]http://www.worldflight.com.au/images/WorldflightRSS.jpg[/img]<br /><br />" +
      "It's that time of the year again! [b]WorldFlight 2016[/b]"

    expect(() => render(content)).not.toThrow()

    const html = render(content)
    // BBCode isn't Markdown or HTML, so its tags aren't parsed into elements
    // — they stay as literal text (GFM does autolink the bare URL between
    // [img][/img], which is expected/harmless, just not asserted here).
    expect(html).toContain("[img]")
    expect(html).toContain("[b]WorldFlight 2016[/b]")
    expect(html).not.toContain("<script")
    // The <br /> tags mixed into that same legacy content still render for real.
    expect(html).toMatch(/<br\s*\/?>/)
  })

  test("nested BBCode + nonstandard decorative markup does not crash (event id 10233 style)", () => {
    const content =
      "[center][i]~~~Ghost Noises~~~[/i][/center]<br /><br />" +
      "I[b]t is that time of year again[/b]! [i][color=red][b]Seattle Suicide Operations[/b][/color][/i]"

    expect(() => render(content)).not.toThrow()
  })
})

describe("MarkdownContent — compact variant (FAQ)", () => {
  test("links open in a new tab and are still sanitized the same way", () => {
    const html = renderToStaticMarkup(
      <MarkdownContent
        variant="compact"
        content="See [the docs](https://example.com/docs) for <u>underlined</u> details."
      />
    )

    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noreferrer noopener"')
    expect(html).toContain("<u>underlined</u>")
  })
})
