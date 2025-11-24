import { Github, Instagram, Linkedin, Mail, Codepen } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/girish_lade_/",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/girish-lade-075bba201/",
      label: "LinkedIn",
    },
    {
      icon: Github,
      href: "https://github.com/girishlade111",
      label: "GitHub",
    },
    {
      icon: Codepen,
      href: "https://codepen.io/Girish-Lade-the-looper",
      label: "Codepen",
    },
    {
      icon: Mail,
      href: "mailto:girishlade111@gmail.com",
      label: "Email",
    },
  ];

  return (
    <footer className="relative z-10 py-8 text-center text-sm text-muted-foreground">
      <div className="flex justify-center gap-6 mb-4">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform"
            aria-label={link.label}
          >
            <link.icon className="w-5 h-5" />
          </a>
        ))}
      </div>
      <p>
        Made with ✨ by Girish Lade |{" "}
        <a
          href="https://ladestack.in"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors duration-200 font-medium"
        >
          Ladestack
        </a>
      </p>
    </footer>
  );
};

export default Footer;
