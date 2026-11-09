import { metadataFor } from "@/src/content/registry";
export const metadata = metadataFor("/blog");
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return children;
}
