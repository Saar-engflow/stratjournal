import Image from 'next/image'
import Link from 'next/link'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  alternateLinkText: string
  alternateLinkHref: string
}

export function AuthLayout({
  children,
  title,
  subtitle,
  alternateLinkText,
  alternateLinkHref,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Side - Image & Branding */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/auth-page-image.jpg"
            alt="Trading journal visualization"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        
        {/* Overlay Content */}
        <div className="relative z-10 flex h-full flex-col justify-center p-12">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3 mb-10">
              <Image
                src="/icon-logo.png"
                alt="StratJournal Logo"
                width={56}
                height={56}
                className="rounded-xl"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <div>
                <h1 className="text-2xl font-bold text-white">StratJournal</h1>
                <p className="text-sm text-white/80">Trading Journal &amp; Strategy Manager</p>
              </div>
            </Link>
            
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Track Your Trades. Master Your Strategy.
            </h2>
            <p className="text-white/90 leading-relaxed text-lg">
              Professional trading journal for disciplined traders. 
              Record, analyze, and improve your trading performance with our clean, focused interface.
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Auth Form */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/icon-logo.png"
                alt="StratJournal Logo"
                width={56}
                height={56}
                className="rounded-xl mb-3"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <h1 className="text-xl font-bold text-primary">StratJournal</h1>
            </Link>
          </div>
          
          {/* Header */}
          {(title || subtitle) && (
            <div className="mb-8">
              {title && <h2 className="text-3xl font-bold text-primary mb-2">{title}</h2>}
              {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
            </div>
          )}
          
          {/* Auth Form */}
          {children}
          
          {/* Alternate Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {alternateLinkText}{' '}
              <Link
                href={alternateLinkHref}
                className="font-medium text-[#16A34A] hover:text-[#15803D] transition-colors"
              >
                {alternateLinkHref === '/sign-in' ? 'Sign in' : 'Sign up'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
