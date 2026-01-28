import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Utensils, Coffee, Wine, Car, Sun, Moon, Sunset, Loader2, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useServices, Service } from '@/hooks/useServices';

// Import images
import breakfastImg from '@/assets/services-breakfast.jpg';
import lunchImg from '@/assets/services-lunch.jpg';
import dinnerImg from '@/assets/services-dinner.jpg';
import drinksImg from '@/assets/services-drinks.jpg';
import gamedriveImg from '@/assets/services-gamedrive.jpg';
import heroServices from '@/assets/hero-services.jpg';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface MenuItemProps {
  item: Service;
  size?: 'small' | 'large';
}

function MenuItem({ item, size = 'large' }: MenuItemProps) {
  const isSmall = size === 'small';
  return (
    <Card className="h-full hover:shadow-card-hover transition-shadow overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className={`${isSmall ? 'text-base' : 'text-lg'} flex justify-between items-start gap-2`}>
          <span className="break-words">{item.name}</span>
          <span className={`text-primary font-semibold ${isSmall ? 'text-xs' : 'text-sm'} whitespace-nowrap`}>
            {item.price}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-muted-foreground ${isSmall ? 'text-xs' : 'text-sm'} break-words`}>
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
}

interface MealTabContentProps {
  items: Service[];
  image: string;
  imageAlt: string;
  title: string;
  subtitle: string;
}

function MealTabContent({ items, image, imageAlt, title, subtitle }: MealTabContentProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative rounded-2xl overflow-hidden shadow-lg"
        >
          <img 
            src={image} 
            alt={imageAlt} 
            className="w-full h-64 lg:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-display text-2xl font-bold mb-1">{title}</h3>
            <p className="text-white/80 text-sm">{subtitle}</p>
          </div>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {items.slice(0, 4).map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <MenuItem item={item} size="small" />
            </motion.div>
          ))}
        </motion.div>
      </div>
      {items.length > 4 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {items.slice(4).map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <MenuItem item={item} size="large" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
}

export default function Services() {
  const { data: services = [], isLoading } = useServices();

  // Filter services by category
  const breakfastItems = services.filter(s => s.category === 'breakfast');
  const lunchItems = services.filter(s => s.category === 'lunch');
  const dinnerItems = services.filter(s => s.category === 'dinner');
  const drinks = services.filter(s => s.category === 'drinks');
  const gameDrives = services.filter(s => s.category === 'game_drive');

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroServices}
            alt="Elegant dining at Rafiki House"
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
              Complete Experience
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
              Our Services
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 max-w-lg">
              From exquisite dining to unforgettable safari adventures, we offer a complete Kenyan experience at Rafiki House Nanyuki.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dining Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Utensils className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">Dining Experience</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Culinary Delights
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our chefs prepare fresh, locally-sourced dishes that blend Kenyan flavors with international cuisine.
            </p>
          </motion.div>

          <Tabs defaultValue="breakfast" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="breakfast" className="gap-2">
                <Sun className="h-4 w-4" />
                <span className="hidden sm:inline">Breakfast</span>
              </TabsTrigger>
              <TabsTrigger value="lunch" className="gap-2">
                <Sunset className="h-4 w-4" />
                <span className="hidden sm:inline">Lunch</span>
              </TabsTrigger>
              <TabsTrigger value="dinner" className="gap-2">
                <Moon className="h-4 w-4" />
                <span className="hidden sm:inline">Dinner</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="breakfast">
              <MealTabContent
                items={breakfastItems}
                image={breakfastImg}
                imageAlt="Breakfast at Rafiki House"
                title="Morning Delights"
                subtitle="Start your day with a view of Mount Kenya"
              />
            </TabsContent>

            <TabsContent value="lunch">
              <MealTabContent
                items={lunchItems}
                image={lunchImg}
                imageAlt="Lunch at Rafiki House"
                title="Midday Feast"
                subtitle="Fresh local ingredients prepared with care"
              />
            </TabsContent>

            <TabsContent value="dinner">
              <MealTabContent
                items={dinnerItems}
                image={dinnerImg}
                imageAlt="Dinner at Rafiki House"
                title="Evening Elegance"
                subtitle="Fine dining under the African stars"
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Drinks Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full mb-4">
              <Wine className="h-5 w-5 text-accent" />
              <span className="text-accent font-medium">Beverage Selection</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Refreshments & Cocktails
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From fresh tropical juices to signature cocktails and fine wines.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-lg"
            >
              <img 
                src={drinksImg} 
                alt="Drinks at Rafiki House" 
                className="w-full h-64 lg:h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-display text-2xl font-bold mb-1">Bar & Lounge</h3>
                <p className="text-white/80 text-sm">Relax with a sundowner</p>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {drinks.map((drink) => (
                <motion.div key={drink.id} variants={itemVariants}>
                  <MenuItem item={drink} size="small" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Safari Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Car className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">Wildlife Adventures</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Safari & Game Drives
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the magic of the African wilderness with our expert guides.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1 relative rounded-2xl overflow-hidden shadow-lg"
            >
              <img 
                src={gamedriveImg} 
                alt="Safari Game Drive" 
                className="w-full h-64 lg:h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-display text-2xl font-bold mb-1">Wild Adventures</h3>
                <p className="text-white/80 text-sm">Explore Kenya's wildlife</p>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-2 grid grid-cols-1 gap-6"
            >
              {gameDrives.map((drive) => (
                <motion.div key={drive.id} variants={itemVariants}>
                  <Card className="hover:shadow-card-hover transition-shadow">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <CardTitle className="text-xl">{drive.name}</CardTitle>
                        <span className="text-primary font-bold text-lg">{drive.price}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{drive.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        {drive.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{drive.duration}</span>
                          </div>
                        )}
                        {drive.time_slot && (
                          <div className="flex items-center gap-1">
                            <Sun className="h-4 w-4 text-accent" />
                            <span>{drive.time_slot}</span>
                          </div>
                        )}
                      </div>
                      {drive.includes && drive.includes.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium mb-2">Includes:</p>
                          <div className="flex flex-wrap gap-2">
                            {drive.includes.map((item, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-muted rounded-md text-xs"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready for an Unforgettable Experience?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Book your stay at Rafiki House and enjoy all our services. Our team is ready to make your visit extraordinary.
            </p>
            <a 
              href="/stays"
              className="inline-block bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Book Your Stay
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
