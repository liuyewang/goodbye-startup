import { metadataFor } from "@/src/content/registry";
export const metadata = metadataFor("/how-it-works");
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return children;
}
