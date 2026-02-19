import Link from "next/link"
import Image from "next/image"

export const Logo = ({ href }: { href: string }) => {
  return (
    <Link href={href} className="flex items-center gap-2.5 cursor-pointer">
      <Image src="/logo.svg" alt="Logo" width={32} height={32} />
    </Link>
  )
}
