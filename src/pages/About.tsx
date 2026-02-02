import { motion } from 'framer-motion';
import { Heart, Users, Leaf, Mountain } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import heroAbout from '@/assets/hero-about.jpg';

const values = [
  {
    icon: Heart,
    title: 'Hospitality',
    description: 'We believe in the power of genuine human connection and warm Kenyan welcome.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'Each home is designed with eco-friendly practices and local materials.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We support local artisans, farmers, and businesses in Nanyuki.',
  },
  {
    icon: Mountain,
    title: 'Adventure',
    description: 'From Mount Kenya hikes to wildlife safaris, adventure awaits at every turn.',
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroAbout}
            alt="African savanna sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
              Karibu Nyumbani
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
              Our Story
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 max-w-lg">
              Rafiki House Nanyuki is more than a place to stay — it's a celebration of Kenyan 
              heritage, nature, and the art of hospitality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">
                A Dream Born in the Highlands
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
                Nestled at the foot of Mount Kenya, Rafiki House Nanyuki began as a dream to create 
                a sanctuary where travelers could experience the authentic beauty of the 
                Kenyan highlands. The name "Rafiki" means "friend" in Swahili — and that's 
                exactly what we aim to be to every guest who walks through our doors.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
                <em className="text-primary font-medium">"You dream it, we'll drive it. Let's uncover the hidden gems of this beautiful country together."</em>
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
                Our eight unique homes are each named after aromatic herbs and spices, 
                reflecting the rich botanical diversity of our property and the 
                culinary traditions of Kenya. From the vibrant Paprika to the serene 
                Sage, each space tells its own story.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
                We work closely with local craftspeople, farmers, and guides to ensure 
                that every stay contributes positively to our community. Our gardens 
                supply fresh produce to local markets, our buildings showcase 
                traditional building techniques, and our team is drawn entirely from 
                the surrounding villages.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Whether you're here to summit Mount Kenya, spot wildlife on safari, 
                or simply disconnect from the world, Rafiki House Nanyuki offers a home away 
                from home in one of Africa's most spectacular settings. Your next great adventure starts here.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12"
          >
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-5 md:p-6 rounded-xl shadow-card text-center"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <value.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                </div>
                <h3 className="font-display text-base md:text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
                Discover Nanyuki
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                Nanyuki is a charming town in Laikipia County, known as the gateway 
                to Mount Kenya. With its year-round temperate climate and stunning 
                landscapes, it's the perfect base for adventure.
              </p>
              <ul className="space-y-3 text-muted-foreground text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Just 200km north of Nairobi (2-3 hours drive)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Home to world-class wildlife conservancies</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Gateway to Mount Kenya National Park</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Rich equestrian and farming heritage</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-muted rounded-xl h-64 md:h-80 flex items-center justify-center"
            >
              <div className="text-center text-muted-foreground">
                <Mountain className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2" />
                <p className="text-sm md:text-base">Interactive map coming soon</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
