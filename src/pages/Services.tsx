import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Utensils, Coffee, Wine, Car, Sun, Moon, Sunset } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import images
import breakfastImg from '@/assets/services-breakfast.jpg';
import lunchImg from '@/assets/services-lunch.jpg';
import dinnerImg from '@/assets/services-dinner.jpg';
import drinksImg from '@/assets/services-drinks.jpg';
import gamedriveImg from '@/assets/services-gamedrive.jpg';

const breakfastItems = [
  { name: 'Full English Breakfast', description: 'Eggs, bacon, sausages, beans, toast & grilled tomatoes', price: 'KES 1,200' },
  { name: 'Kenyan Breakfast', description: 'Mandazi, chai, fresh fruits & scrambled eggs', price: 'KES 900' },
  { name: 'Continental Breakfast', description: 'Pastries, cold cuts, cheese, fresh juice & coffee', price: 'KES 1,000' },
  { name: 'Pancake Stack', description: 'Fluffy pancakes with maple syrup, berries & whipped cream', price: 'KES 850' },
  { name: 'Eggs Benedict', description: 'Poached eggs, hollandaise sauce on toasted muffins', price: 'KES 1,100' },
  { name: 'Fresh Fruit Platter', description: 'Seasonal Kenyan fruits with yogurt & honey', price: 'KES 650' },
];

const lunchItems = [
  { name: 'Grilled Tilapia', description: 'Fresh Lake Naivasha tilapia with ugali & sukuma wiki', price: 'KES 1,800' },
  { name: 'Nyama Choma Platter', description: 'Grilled goat meat with kachumbari & roasted potatoes', price: 'KES 2,200' },
  { name: 'Chicken Stir-Fry', description: 'Tender chicken with vegetables & jasmine rice', price: 'KES 1,500' },
  { name: 'Garden Salad Bowl', description: 'Fresh greens, avocado, tomatoes & grilled halloumi', price: 'KES 1,100' },
  { name: 'Beef Burger', description: 'Homemade patty with cheese, lettuce & crispy fries', price: 'KES 1,400' },
  { name: 'Pasta Primavera', description: 'Fresh pasta with seasonal vegetables in herb sauce', price: 'KES 1,300' },
];

const dinnerItems = [
  { name: 'Grilled Lamb Chops', description: 'Herb-crusted lamb with rosemary jus & vegetables', price: 'KES 3,200' },
  { name: 'Beef Tenderloin', description: 'Prime beef with red wine reduction & mashed potatoes', price: 'KES 3,500' },
  { name: 'Swahili Coconut Fish', description: 'Fresh catch in coconut curry with pilau rice', price: 'KES 2,400' },
  { name: 'Roasted Chicken', description: 'Free-range chicken with herbs & roasted vegetables', price: 'KES 2,000' },
  { name: 'Vegetarian Feast', description: 'Grilled vegetables, lentil curry & chapati', price: 'KES 1,600' },
  { name: 'Seafood Platter', description: 'Prawns, calamari & fish with garlic butter sauce', price: 'KES 4,000' },
];

const drinks = [
  { name: 'Fresh Passion Juice', description: 'Freshly squeezed Kenyan passion fruit', price: 'KES 350' },
  { name: 'Mango Smoothie', description: 'Creamy mango blend with a hint of ginger', price: 'KES 400' },
  { name: 'Dawa Cocktail', description: 'Kenyan honey, lime & vodka signature drink', price: 'KES 650' },
  { name: 'Tusker Beer', description: 'Kenya\'s finest lager, ice cold', price: 'KES 350' },
  { name: 'House Wine', description: 'Selected red or white by the glass', price: 'KES 700' },
  { name: 'Kenyan Coffee', description: 'Freshly roasted Arabica from Mt. Kenya', price: 'KES 250' },
  { name: 'Chai Masala', description: 'Traditional spiced Kenyan tea', price: 'KES 200' },
  { name: 'Fresh Coconut Water', description: 'Straight from the shell', price: 'KES 300' },
];

const gameDrives = [
  {
    name: 'Morning Game Drive',
    description: 'Experience the African bush at dawn when wildlife is most active. Spot lions, elephants, buffalo, and countless bird species.',
    duration: '3-4 hours',
    time: '6:00 AM - 10:00 AM',
    price: 'KES 8,500 per person',
    includes: ['Professional guide', 'Bottled water', 'Binoculars', 'Bush breakfast'],
  },
  {
    name: 'Afternoon Game Drive',
    description: 'Enjoy the golden afternoon light as animals gather at watering holes. Perfect for photography enthusiasts.',
    duration: '3-4 hours',
    time: '3:00 PM - 7:00 PM',
    price: 'KES 8,500 per person',
    includes: ['Professional guide', 'Sundowner drinks', 'Snacks', 'Blankets'],
  },
  {
    name: 'Full Day Safari',
    description: 'The ultimate wildlife experience. Explore multiple ecosystems and maximize your chances of seeing the Big Five.',
    duration: '8-10 hours',
    time: '6:00 AM - 4:00 PM',
    price: 'KES 18,000 per person',
    includes: ['Professional guide', 'Bush breakfast', 'Picnic lunch', 'All refreshments', 'Park fees'],
  },
];

const mealImages = {
  breakfast: breakfastImg,
  lunch: lunchImg,
  dinner: dinnerImg,
};

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

import heroServices from '@/assets/hero-services.jpg';

export default function Services() {
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative rounded-2xl overflow-hidden shadow-lg"
                >
                  <img 
                    src={breakfastImg} 
                    alt="Breakfast at Rafiki House" 
                    className="w-full h-64 lg:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-display text-2xl font-bold mb-1">Morning Delights</h3>
                    <p className="text-white/80 text-sm">Start your day with a view of Mount Kenya</p>
                  </div>
                </motion.div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {breakfastItems.slice(0, 4).map((item) => (
                    <motion.div key={item.name} variants={itemVariants}>
                      <Card className="h-full hover:shadow-card-hover transition-shadow overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex justify-between items-start gap-2">
                            <span className="break-words">{item.name}</span>
                            <span className="text-primary font-semibold text-xs whitespace-nowrap">{item.price}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-xs break-words">{item.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {breakfastItems.slice(4).map((item) => (
                  <motion.div key={item.name} variants={itemVariants}>
                    <Card className="h-full hover:shadow-card-hover transition-shadow overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex justify-between items-start gap-2">
                          <span className="break-words">{item.name}</span>
                          <span className="text-primary font-semibold text-sm whitespace-nowrap">{item.price}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm break-words">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="lunch">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative rounded-2xl overflow-hidden shadow-lg"
                >
                  <img 
                    src={lunchImg} 
                    alt="Lunch at Rafiki House" 
                    className="w-full h-64 lg:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-display text-2xl font-bold mb-1">Midday Feast</h3>
                    <p className="text-white/80 text-sm">Fresh local ingredients prepared with care</p>
                  </div>
                </motion.div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {lunchItems.slice(0, 4).map((item) => (
                    <motion.div key={item.name} variants={itemVariants}>
                      <Card className="h-full hover:shadow-card-hover transition-shadow overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex justify-between items-start gap-2">
                            <span className="break-words">{item.name}</span>
                            <span className="text-primary font-semibold text-xs whitespace-nowrap">{item.price}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-xs break-words">{item.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {lunchItems.slice(4).map((item) => (
                  <motion.div key={item.name} variants={itemVariants}>
                    <Card className="h-full hover:shadow-card-hover transition-shadow overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex justify-between items-start gap-2">
                          <span className="break-words">{item.name}</span>
                          <span className="text-primary font-semibold text-sm whitespace-nowrap">{item.price}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm break-words">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="dinner">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative rounded-2xl overflow-hidden shadow-lg"
                >
                  <img 
                    src={dinnerImg} 
                    alt="Dinner at Rafiki House" 
                    className="w-full h-64 lg:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-display text-2xl font-bold mb-1">Evening Elegance</h3>
                    <p className="text-white/80 text-sm">Fine dining under the African stars</p>
                  </div>
                </motion.div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {dinnerItems.slice(0, 4).map((item) => (
                    <motion.div key={item.name} variants={itemVariants}>
                      <Card className="h-full hover:shadow-card-hover transition-shadow overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex justify-between items-start gap-2">
                            <span className="break-words">{item.name}</span>
                            <span className="text-primary font-semibold text-xs whitespace-nowrap">{item.price}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-xs break-words">{item.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {dinnerItems.slice(4).map((item) => (
                  <motion.div key={item.name} variants={itemVariants}>
                    <Card className="h-full hover:shadow-card-hover transition-shadow overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex justify-between items-start gap-2">
                          <span className="break-words">{item.name}</span>
                          <span className="text-primary font-semibold text-sm whitespace-nowrap">{item.price}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm break-words">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Drinks Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={drinksImg} 
                  alt="Drinks at Rafiki House" 
                  className="w-full h-80 lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -right-6 bg-card p-4 rounded-xl shadow-lg"
              >
                <Wine className="h-8 w-8 text-primary mb-2" />
                <p className="font-display font-bold text-lg">8+ Signature</p>
                <p className="text-muted-foreground text-sm">Cocktails & Beverages</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full mb-4">
                <Wine className="h-5 w-5 text-accent-foreground" />
                <span className="text-accent-foreground font-medium">Bar & Beverages</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Refreshing Drinks
              </h2>
              <p className="text-muted-foreground mb-8">
                From fresh tropical juices to signature cocktails and fine wines, our bar has something for everyone.
              </p>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {drinks.map((drink) => (
                  <motion.div key={drink.name} variants={itemVariants}>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background hover:shadow-md transition-shadow overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Coffee className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-medium text-sm break-words">{drink.name}</p>
                          <span className="text-primary font-semibold text-xs whitespace-nowrap">{drink.price}</span>
                        </div>
                        <p className="text-muted-foreground text-xs mt-0.5 break-words">{drink.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Game Drives Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Hero Image for Game Drives */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden mb-12 shadow-xl"
          >
            <img 
              src={gamedriveImg} 
              alt="Safari Game Drive" 
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-8">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <Car className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Safari Adventures</span>
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                  Game Drives
                </h2>
                <p className="text-white/80 max-w-xl text-lg">
                  Embark on thrilling wildlife safaris with our experienced guides. Explore the stunning landscapes around Nanyuki and encounter Africa's magnificent wildlife.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {gameDrives.map((drive, index) => (
              <motion.div key={drive.name} variants={itemVariants}>
                <Card className="h-full hover:shadow-card-hover transition-all hover:-translate-y-1 border-2 border-transparent hover:border-primary/20 overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Car className="h-4 w-4 flex-shrink-0" />
                      <span className="break-words">{drive.duration}</span>
                    </div>
                    <CardTitle className="text-xl break-words">{drive.name}</CardTitle>
                    <p className="text-primary font-bold text-lg break-words">{drive.price}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground break-words">{drive.description}</p>
                    <div className="text-sm">
                      <p className="font-medium text-foreground mb-1 break-words">Time: {drive.time}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm mb-2">Includes:</p>
                      <ul className="space-y-1">
                        {drive.includes.map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span className="break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience Rafiki House?
            </h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
              Book your stay and enjoy our full range of services, from gourmet dining to safari adventures.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
