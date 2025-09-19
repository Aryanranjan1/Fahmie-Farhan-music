'use client'
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Music, Mail, Youtube, Instagram, Twitter, Facebook, Linkedin, Github, Twitch, Link as LinkIcon, LucideProps, Music2 as SoundcloudIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Define a type for the social link data
interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

// Map icon names to Lucide components
const iconComponents: { [key: string]: React.FC<LucideProps> } = {
  Youtube,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  Twitch,
  // Discord icon is not available in lucide-react, fallback to Default
  Soundcloud: SoundcloudIcon,
  Default: LinkIcon
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch("/api/social-links");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setSocialLinks(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch social links:", error);
      }
    };

    fetchSocialLinks();
  }, []);

  return (
    <footer className="bg-charcoal-dark border-t border-fantasy-gold/20 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-3xl font-bold text-fantasy-gold mb-4">FFM</div>
            <p className="text-text-muted mb-4">
              Fahmie Farhan Music - Epic orchestral compositions and modern Malay gamelan interpretations.
            </p>
            <div className="flex space-x-4">
              {Array.isArray(socialLinks) && socialLinks.map((social) => {
                const Icon = iconComponents[social.icon] || iconComponents.Default;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-deep-black rounded-full flex items-center justify-center text-fantasy-gold hover:bg-fantasy-gold hover:text-deep-black transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-fantasy-gold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-text-muted hover:text-fantasy-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/music" className="text-text-muted hover:text-fantasy-gold transition-colors">
                  Music Portfolio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-text-muted hover:text-fantasy-gold transition-colors">
                  Blog 
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-text-muted hover:text-fantasy-gold transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-muted hover:text-fantasy-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-fantasy-gold">Services</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-text-muted">Custom Compositions</span>
              </li>
              <li>
                <span className="text-text-muted">Orchestral Arrangements</span>
              </li>
              <li>
                <span className="text-text-muted">Gamelan Composition</span>
              </li>
              <li>
                <span className="text-text-muted">Malay Gamelan coaching</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-fantasy-gold">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-fantasy-gold" />
                <span className="text-text-muted text-sm">contact@fahmiefarhan.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-fantasy-gold">📱</span>
                <span className="text-text-muted text-sm">+60 11-31377753</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-fantasy-gold">📍</span>
                <span className="text-text-muted text-sm">Malaysia</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-fantasy-gold/20" />

        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="text-text-muted text-sm mb-4 md:mb-0">
            © {currentYear} Fahmie Farhan Music. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
