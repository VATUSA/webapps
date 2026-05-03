import Link from "next/link"
import config from "package.json" with {type: 'json'};

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card/95 text-card-foreground shadow-sm backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm md:grid-cols-3">
        <div>
          <h4 className="mb-3 font-semibold text-foreground">About VATUSA</h4>
          <p className="text-muted-foreground">
            VATUSA provides simulated air traffic control services across the
            United States as part of the VATSIM global flight simulation
            network.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-foreground">Explore</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/events"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                href="/news"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                News
              </Link>
            </li>
            <li>
              <Link
                href="/info/policies"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Policies
              </Link>
            </li>
            <li>
              <Link
                href="/info/foundation"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Foundation
              </Link>
            </li>
            <li>
              <Link
                href="/support/faq"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Support / FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-foreground">Community</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/info/discord"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Discord
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/VATUSA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://status.vatsim.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                VATSIM Status
              </a>
            </li>
            <li>
              <a
                href="/info/discord"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Join Discord
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} VATUSA. All rights reserved.
            <span className="mx-2 text-muted-foreground/70">•</span>
            <span className="font-medium text-foreground/80">
              v{config.version}
            </span>
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/info/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <a
              href="https://vatsim.net"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              VATSIM.net
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
