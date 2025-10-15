import { Link } from "react-router";

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
      className="text-primary-foreground/60 underline hover:text-primary-foreground/80"
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </Link>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-sm text-center text-primary-foreground/50">
          <span>
            &copy; 2025{" "}
            <FooterLink href="https://mrozwadowski.com" external>
              Mikołaj Rozwadowski
            </FooterLink>
          </span>{" "}
          &middot;{" "}
          <span>
            Zdjęcie w tle:{" "}
            <FooterLink
              href="https://unsplash.com/photos/a-church-with-a-pipe-organ-and-chandelier-WV-OY38J-Mc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              external
            >
              Haberdoedas II
            </FooterLink>
          </span>{" "}
          &middot;{" "}
          <span>
            Materiały graficzne:{" "}
            <FooterLink href="https://mockuphone.com" external>
              MockUPhone
            </FooterLink>
          </span>{" "}
          &middot;{" "}
          <FooterLink href="/privacy">
            <span>Polityka prywatności</span>
          </FooterLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
