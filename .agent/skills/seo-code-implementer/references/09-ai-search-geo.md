# 09. AI Search and Generative Engine Readiness (code side)

AI answer systems (Google AI Overviews and AI Mode, ChatGPT search, Perplexity, Gemini, Claude, Copilot) retrieve pages, then quote or cite them. Google's own guidance is that optimizing for these is still fundamentally SEO: be crawlable, indexable, fast, clear, and trustworthy. So the baseline from the other references already covers most of it. This file covers what is specific.

## 1. Make content available without JavaScript

Many AI crawlers fetch raw HTML and **do not execute JavaScript**. If the content is rendered client-side, those systems see an empty shell.
- Server-render or pre-render all indexable content (`07-crawl-index-files.md`).
- Verify with `curl -s URL | grep -i "<a text from the page>"`.

## 2. Crawler access policy in robots.txt

Decide per crawler purpose. These are separate user agents with different purposes:

| Purpose | Common user agents (verify names in each vendor's current docs) |
|---|---|
| Training data collection | `GPTBot` (OpenAI), `ClaudeBot` (Anthropic), `CCBot` (Common Crawl), `Google-Extended` (Google AI training and grounding control token, does not affect Google Search), `Applebot-Extended`, `Bytespider`, `Meta-ExternalAgent` |
| Search index for AI answers (citations and links back) | `OAI-SearchBot` (OpenAI), `Claude-SearchBot` (Anthropic), `PerplexityBot` |
| User-initiated fetches (a person asks the assistant to open a page) | `ChatGPT-User`, `Claude-User`, `Perplexity-User` |

Template (default policy: stay discoverable and citable in AI search; let the business decide on training):

```
# AI search and user-initiated fetchers: allowed so the site can be cited
User-agent: OAI-SearchBot
User-agent: Claude-SearchBot
User-agent: PerplexityBot
User-agent: ChatGPT-User
User-agent: Claude-User
User-agent: Perplexity-User
Allow: /

# Training crawlers: BUSINESS DECISION. Default below is allow; change to Disallow: / to opt out.
# TODO(seo): confirm training-crawler policy with the business
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: CCBot
Allow: /
```

Important:
- This is a **policy decision, not a technical one.** Implement the template with a `TODO(seo)` marker and flag it in the hand-off report. Do not silently block or silently allow.
- Blocking a search-oriented bot means the site will not be cited by that product. Blocking `Googlebot` or `Bingbot` removes the site from search; never do that for AI reasons. `Google-Extended` does not affect Google Search ranking.
- robots.txt is a voluntary standard; compliant crawlers follow it. Do not rely on it for confidentiality.
- Do not block these bots at the CDN or WAF unless the specialist asks; unintended bot-protection rules are a common reason sites vanish from AI answers. Mention it in the hand-off.

## 3. Content structure that is easy to quote

AI systems extract passages. Make passages self-contained:
- **Answer first.** Put the direct answer in the first one or two sentences under a heading, then elaborate.
- **Question-style headings** where natural (H2 or H3 phrased as the question a reader would ask), followed by a concise answer paragraph.
- **Short, focused paragraphs** that make sense out of context: name the subject instead of "it" or "this" at the start of a paragraph.
- **Lists and tables** for steps, comparisons, specs, and pricing, using real `<ol>`, `<ul>`, and `<table>` markup.
- **Definitions** in a clear form: "X is ...".
- **Specific facts with sources**: numbers, dates, and named entities, with visible citations as outbound links.
- **Visible authorship and freshness**: byline, published and updated dates, reviewer credit (see `04`). Update `dateModified` only for real changes.
- **Entity clarity**: use the same names consistently; link to the About page; `Organization` and `Person` schema with `sameAs`.
- **Summaries**: a short "Key takeaways" or TL;DR block near the top of long pages (real text in HTML).
- Provide transcripts for video and audio, and text descriptions for charts, so non-text content is quotable.

These are templates for how components are built (a `KeyTakeaways` component, FAQ-style sections that render real text, a `DefinitionBlock`), not instructions to rewrite copy; the SEO specialist and writers own the wording.

## 4. Snippet controls

Control what is excerpted, only if the business wants limits:
- `<meta name="robots" content="max-snippet:N">` or `nosnippet`
- `data-nosnippet` on specific elements (text, div, span)
Default: do not restrict; restricting reduces visibility in results and AI features.

## 5. llms.txt (optional; set expectations honestly)

`/llms.txt` is a **proposed convention**: a Markdown file that gives language models a concise, curated map of the site. At the time of writing, major search engines have not confirmed that it influences ranking or AI citations, and Google has said it does not use it. It is cheap to add, harmless, and useful for agents and developer tools that read it (documentation sites benefit most). Add it when requested or when the project is documentation or API focused. Do not describe it as a ranking factor.

Format (`../templates/llms.txt`):
```
# Brand Name

> One or two sentence summary of what the site is and who it is for.

Optional extra context paragraph.

## Key pages
- [Pricing](https://example.com/pricing/): Plans and what is included
- [Documentation](https://example.com/docs/): Getting started and API reference

## Optional
- [Blog](https://example.com/blog/): Articles and updates
```
Rules: absolute URLs, real pages only, concise descriptions, generated from the same route and content data as the sitemap so it never goes stale. Optionally also publish `/llms-full.txt` with the full text of key docs. Clean Markdown versions of pages (for example `/docs/page.md`) are a further optional step for documentation sites.

## 6. Agent readiness (for AI agents that use sites)

Agents browsing on behalf of users rely on the accessibility tree and clear structure:
- Semantic HTML, labelled buttons and form controls (`<label for>`, `aria-label`), meaningful link text, correct roles
- Stable, predictable forms and checkout flows; no CAPTCHA walls on read-only content
- `autocomplete` attributes, clear error messages
- Do not hide primary actions behind hover-only or gesture-only interactions
- Emerging standards such as WebMCP (exposing site tools to agents) are early; add only if the project explicitly targets agent interaction, and treat them as experimental

## 7. Brand and entity consistency

- Consistent site name, description, logo, and social profiles in head tags, schema, footer, and About page
- Link to official profiles from the site (and `sameAs`), so engines can connect the entity
- Wikipedia, Reddit, reviews, and press mentions influence AI answers but are off-site work for the specialist

## What not to do

- Do not stuff content with questions or keyword variants for AI. Quality, accuracy, and clarity are the lever.
- Do not cloak: serving different content to AI crawlers than to users violates guidelines.
- Do not add hidden prompts or instructions aimed at language models (prompt injection) in page content.
- Do not block mainstream search crawlers.
- Do not claim llms.txt or any single tag guarantees citations.

## Hand-off notes for the specialist

- Which AI crawler policy was implemented and what needs a business decision
- Whether `llms.txt` was added and its source of truth
- Any CDN/WAF bot rules that could block AI crawlers (code cannot see these)
- Which pages contain answer-first sections and summaries so they can be prioritized
