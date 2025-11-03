import { Link } from "react-router";
import { Heart } from "lucide-react";

const FooterLink = ({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) => {
  return (
    <Link
      to={href}
      className="underline hover:text-accent"
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </Link>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-primary-foreground/60">
        <div className="flex items-center justify-center text-sm">
          <p>
            © 2025{" "}
            <FooterLink href="https://mrozwadowski.com" external>
              Mikołaj Rozwadowski
            </FooterLink>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
          <p>
            <FooterLink href="/privacy">Polityka prywatności</FooterLink>
          </p>
          <span className="hidden sm:inline">•</span>
          <p>
            Zdjęcie w tle:{" "}
            <FooterLink
              href="https://unsplash.com/photos/a-church-with-a-pipe-organ-and-chandelier-WV-OY38J-Mc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              external
            >
              Haberdoedas II
            </FooterLink>
          </p>
          <span className="hidden sm:inline">•</span>
          <p>
            Materiały graficzne:{" "}
            <FooterLink href="https://mockuphone.com" external>
              MockUPhone
            </FooterLink>
          </p>
          {/* <span className="hidden sm:inline">•</span>
          <p>
            Hosting:{" "}
            <FooterLink href="https://mikr.us/?r=2ba02f5f" external>
              Mikr.us
            </FooterLink>
          </p> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
