import { mkdirSync, writeFileSync } from "node:fs";
import {
  pages,
  publicMarkdown,
  renderFeed,
  SITE_URL,
} from "../src/content/registry.ts";
mkdirSync("public/content", { recursive: true });
mkdirSync("public/blog", { recursive: true });
writeFileSync("public/blog/feed.xml", renderFeed());
const lines = pages.map((p) => {
  const name = p.path === "/" ? "index" : p.path.slice(1).replaceAll("/", "-");
  writeFileSync(`public/content/${name}.md`, publicMarkdown(p.path));
  return `- [${p.title}](${SITE_URL}/content/${name}.md): ${p.description}`;
});
writeFileSync(
  "public/llms.txt",
  `# Goodbye Startup\n\n> An educational AI startup simulator. All days are simulated; real use takes about 15 minutes. Outputs are assumptions, not market research or predictions.\n\n## Public documentation\n\n${lines.join("\n")}\n\n## Privacy boundary\n\nOnly public editorial content is exported here. /api/ is private, not a content source.\n`,
);
console.log(
  `Generated ${pages.length} public Markdown documents and four RSS entries.`,
);
