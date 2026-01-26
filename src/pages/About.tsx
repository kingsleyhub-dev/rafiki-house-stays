import { motion } from 'framer-motion';
import { Heart, Users, Leaf, Mountain } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import heroImage from '@/assets/hero-image.jpg';

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
      {/* Hero */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Rafiki House Nanyuki"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy/70" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/80 max-w-2xl mx-auto"
          >
            Rafiki House is more than a place to stay — it's a celebration of Kenyan 
            heritage, nature, and the art of hospitality.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="font-display text-3xl font-bold mb-6">
                A Dream Born in the Highlands
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Nestled at the foot of Mount Kenya, Rafiki House began as a dream to create 
                a sanctuary where travelers could experience the authentic beauty of the 
                Kenyan highlands. The name "Rafiki" means "friend" in Swahili — and that's 
                exactly what we aim to be to every guest who walks through our doors.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our eight unique homes are each named after aromatic herbs and spices, 
                reflecting the rich botanical diversity of our property and the 
                culinary traditions of Kenya. From the vibrant Paprika to the serene 
                Sage, each space tells its own story.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We work closely with local craftspeople, farmers, and guides to ensure 
                that every stay contributes positively to our community. Our gardens 
                supply fresh produce to local markets, our buildings showcase 
                traditional building techniques, and our team is drawn entirely from 
                the surrounding villages.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're here to summit Mount Kenya, spot wildlife on safari, 
                or simply disconnect from the world, Rafiki House offers a home away 
                from home in one of Africa's most spectacular settings.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-bold text-center mb-12"
          >
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-xl shadow-card text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl font-bold mb-4">
                Discover Nanyuki
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nanyuki is a charming town in Laikipia County, known as the gateway 
                to Mount Kenya. With its year-round temperate climate and stunning 
                landscapes, it's the perfect base for adventure.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Just 200km north of Nairobi (2-3 hours drive)
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Home to world-class wildlife conservancies
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Gateway to Mount Kenya National Park
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Rich equestrian and farming heritage
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-muted rounded-xl h-80 flex items-center justify-center"
            >
              <div className="text-center text-muted-foreground">
                <Mountain className="h-12 w-12 mx-auto mb-2" />
                <p>Interactive map coming soon</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
