import { PublicLayout } from "@/components/route-guards"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PublicLayout>{children}</PublicLayout>
}
