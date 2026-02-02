import { motion, useInView } from 'framer-motion';
import { ArrowRight, Star, Shield, Heart, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { useProperties } from '@/hooks/useProperties';
import { Property } from '@/types';
import heroImage from '@/assets/hero-image.jpg';
import logo from '@/assets/rafiki-house-logo.png';

const features = [
  {
    icon: Star,
    title: 'Unique Stays',
    description: 'Each home has its own personality and charm, inspired by herbs and spices.',
  },
  {
    icon: Shield,
    title: 'Trusted Experience',
    description: 'All properties are professionally maintained and regularly inspected.',
  },
  {
    icon: Heart,
    title: 'Local Hospitality',
    description: 'Experience genuine Kenyan warmth with our dedicated on-site team.',
  },
  {
    icon: MapPin,
    title: 'Prime Location',
    description: 'Set against the backdrop of Mount Kenya in beautiful Nanyuki.',
  },
];

// Animated property carousel for mobile
function AnimatedPropertyCarousel({ properties }: { properties: Property[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });
  
  // Auto-advance carousel
  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % properties.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isInView, properties.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
  };

  return (
    <div ref={containerRef} className="relative md:hidden">
      {/* Carousel Container */}
      <div className="overflow-hidden rounded-xl">
        <motion.div
          className="flex"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {properties.map((property, index) => (
            <div key={property.id} className="w-full flex-shrink-0 px-1">
              <PropertyCard property={property} index={index} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-lg z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Previous property"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-lg z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Next property"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {properties.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all min-h-[24px] min-w-[24px] flex items-center justify-center ${
              index === currentIndex ? 'bg-primary scale-125' : 'bg-primary/30'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-primary/30'}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  const { data: properties = [] } = useProperties();
  const featuredProperties = properties.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Rafiki House Nanyuki"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/60 to-navy/30 md:to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 py-8 flex flex-col h-full">
          {/* Logo - Centered at Top */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 md:mb-12 flex justify-center"
          >
            <img
              src={logo}
              alt="Rafiki House Nanyuki"
              className="h-36 sm:h-44 md:h-56 lg:h-64 w-auto drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            />
          </motion.div>

          {/* Centered Content */}
          <div className="max-w-2xl mx-auto text-center flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mb-3 md:mb-4"
            >
              <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-accent/20 text-accent rounded-full text-xs sm:text-sm font-medium">
                Karibu Nyumbani — Welcome Home
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-3 md:mb-4 leading-tight"
            >
              Stay at<br />
              <span className="text-accent">Rafiki House Nanyuki</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-primary-foreground/80 mb-6 md:mb-8 max-w-lg leading-relaxed text-center mx-auto"
            >
              A collection of eight unique boutique homes nestled in the Kenyan highlands, 
              each named after aromatic herbs and spices. Your next great adventure starts here.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 min-h-[48px]" asChild>
                <Link to="/stays">
                  Explore Our Stays <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator - Hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 1 },
            y: { repeat: Infinity, duration: 2 }
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary-foreground/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Featured Properties - Now First */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-10"
          >
            <div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2">
                Featured Homes
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Explore our collection of unique stays
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex gap-2 min-h-[44px]">
              <Link to="/stays">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Mobile Animated Carousel */}
          <AnimatedPropertyCarousel properties={featuredProperties} />

          {/* Desktop Grid with Staggered Animation */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <PropertyCard property={property} index={index} />
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Button asChild className="gap-2 min-h-[48px] w-full max-w-xs">
              <Link to="/stays">
                View All Homes <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section - Now Second */}
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              Why Choose Rafiki House?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base text-center">
              More than just a place to stay — it's an experience that connects you with nature, 
              community, and the spirit of Kenya.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-4 md:p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                  <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="font-display text-sm md:text-lg font-semibold mb-1 md:mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-navy text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-accent font-medium mb-2 text-sm sm:text-base">
              You dream it, we'll drive it
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              Ready for Your Nanyuki Adventure?
            </h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto mb-6 md:mb-8 text-sm sm:text-base text-center">
              Let's uncover the hidden gems of this beautiful country together. 
              Book your stay at Rafiki House and discover the magic of the Kenyan highlands.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 min-h-[48px]">
              <Link to="/stays" className="flex items-center gap-2">
                Explore All Stays <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
