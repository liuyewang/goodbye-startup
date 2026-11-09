import { metadataFor } from "@/src/content/registry";
export const metadata = metadataFor(
  "/blog/how-much-money-do-you-need-to-start-a-startup",
);
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return children;
}
