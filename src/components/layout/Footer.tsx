import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import logo from '@/assets/rafiki-house-logo.png';

// WhatsApp icon component
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Rafiki House Nanyuki" className="h-12 w-auto brightness-0 invert" />
              <span className="font-display text-xl font-semibold">Rafiki House Nanyuki</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              A collection of unique boutique homes in the heart of Nanyuki, Kenya. 
              Experience the magic of the Kenyan highlands.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/stays" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  All Stays
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-accent" />
                <span className="text-primary-foreground/70">
                  Nanyuki, Laikipia County<br />Kenya
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-accent" />
                <a href="tel:+254705037373" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  +254 705 037 373
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:rafikihousenanyuki.info@gmail.com" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  rafikihousenanyuki.info@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-4">
              <a
                href="https://wa.me/254705037373"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center hover:bg-[#25D366]/80 transition-all"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="h-5 w-5 text-white" />
              </a>
              <a
                href="https://www.instagram.com/obadiah_the_marketer?igsh=Y2xrNndxMjgzaXBn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center hover:opacity-80 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a
                href="https://www.facebook.com/share/187SZsh9BG/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center hover:bg-[#1877F2]/80 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="h-px bg-primary-foreground/10 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
          <p>© 2026 Rafiki House Nanyuki. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
