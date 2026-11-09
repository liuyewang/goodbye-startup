import { metadataFor } from "@/src/content/registry";
export const metadata = metadataFor("/blog/churn-rate-how-to-reduce");
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return children;
}
