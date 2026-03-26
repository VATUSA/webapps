export default function Footer() {
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
          <h4 className="mb-3 font-semibold text-foreground">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Facilities
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Training
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Policies
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-foreground">Network</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                VATSIM.net
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Status
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Discord
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2026 VATUSA. All rights reserved.
      </div>
    </footer>
  )
}
