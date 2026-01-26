import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SearchBar } from '@/components/search/SearchBar';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { properties } from '@/data/properties';
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

export default function Index() {
  const featuredProperties = properties.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Rafiki House Nanyuki"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={logo}
                alt="Rafiki House"
                className="h-20 w-auto mb-6 brightness-0 invert"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4"
            >
              Stay at<br />
              <span className="text-accent">Rafiki House Nanyuki</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg"
            >
              A collection of eight unique boutique homes nestled in the Kenyan highlands, 
              each named after aromatic herbs and spices.
            </motion.p>

            {/* Search Bar */}
            <div className="max-w-3xl">
              <SearchBar variant="hero" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 1 },
            y: { repeat: Infinity, duration: 2 }
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary-foreground/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why Choose Rafiki House?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              More than just a place to stay — it's an experience that connects you with nature, 
              community, and the spirit of Kenya.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Featured Homes
              </h2>
              <p className="text-muted-foreground">
                Explore our collection of unique stays
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex gap-2">
              <Link to="/stays">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button asChild className="gap-2">
              <Link to="/stays">
                View All Homes <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready for Your Nanyuki Adventure?
            </h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
              Book your stay at Rafiki House and discover the magic of the Kenyan highlands.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
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
