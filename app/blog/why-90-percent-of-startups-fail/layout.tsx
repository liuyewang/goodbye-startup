import { metadataFor } from "@/src/content/registry";
export const metadata = metadataFor("/blog/why-90-percent-of-startups-fail");
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return children;
}
