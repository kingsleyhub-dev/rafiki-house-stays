import { motion } from 'framer-motion';
import { Heart, Users, Leaf, Mountain } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useAboutContent } from '@/hooks/useAboutContent';
import { Skeleton } from '@/components/ui/skeleton';
import heroAbout from '@/assets/hero-about.jpg';

const valueIcons: Record<string, React.ElementType> = {
  value_hospitality: Heart,
  value_sustainability: Leaf,
  value_community: Users,
  value_adventure: Mountain,
};

export default function About() {
  const { data: contents, isLoading } = useAboutContent();

  // Helper to get content by section key
  const getContent = (key: string) => contents?.find(c => c.section_key === key);

  // Parse content with paragraph breaks
  const renderParagraphs = (text: string) => {
    return text.split('\n\n').map((paragraph, index) => {
      // Check if it's the quote line
      if (paragraph.startsWith('"') && paragraph.endsWith('"')) {
        return (
          <p key={index} className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
            <em className="text-primary font-medium">{paragraph}</em>
          </p>
        );
      }
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
          {paragraph}
        </p>
      );
    });
  };

  // Parse location info with bullet points
  const renderLocationContent = (text: string) => {
    const lines = text.split('\n');
    const paragraphs: string[] = [];
    const bullets: string[] = [];

    lines.forEach(line => {
      if (line.startsWith('•')) {
        bullets.push(line.replace('• ', ''));
      } else if (line.trim()) {
        paragraphs.push(line);
      }
    });

    return (
      <>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
            {p}
          </p>
        ))}
        {bullets.length > 0 && (
          <ul className="space-y-3 text-muted-foreground text-sm sm:text-base">
            {bullets.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  };

  const originStory = getContent('origin_story');
  const mainStory = getContent('main_story');
  const locationInfo = getContent('location_info');

  // Get value cards
  const valueKeys = ['value_hospitality', 'value_sustainability', 'value_community', 'value_adventure'];
  const values = valueKeys
    .map(key => {
      const content = getContent(key);
      if (!content) return null;
      return {
        key,
        icon: valueIcons[key] || Heart,
        title: content.title || '',
        description: content.content,
      };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

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

      {/* Origin Story Section */}
      <section className="py-12 md:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="text-center space-y-4">
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-6 w-64 mx-auto" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : originStory ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <span className="inline-block px-4 py-2 bg-accent/20 text-accent-foreground rounded-full text-sm font-medium mb-4">
                  Our Origin
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">
                  {originStory.title}
                </h2>
                <div className="prose prose-lg max-w-none">
                  {originStory.content.split('\n\n').map((paragraph, index) => {
                    // Check for "evening bonfire sessions" to highlight
                    if (paragraph.includes('evening bonfire sessions')) {
                      const parts = paragraph.split('evening bonfire sessions');
                      return (
                        <p key={index} className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-6">
                          {parts[0]}
                          <span className="text-primary font-medium">evening bonfire sessions</span>
                          {parts[1]}
                        </p>
                      );
                    }
                    return (
                      <p key={index} className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-6">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : mainStory ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="prose prose-lg max-w-none"
              >
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">
                  {mainStory.title}
                </h2>
                {renderParagraphs(mainStory.content)}
              </motion.div>
            ) : null}
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
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-card p-5 md:p-6 rounded-xl shadow-card text-center">
                  <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
                  <Skeleton className="h-5 w-24 mx-auto mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))
            ) : (
              values.map((value, index) => (
                <motion.div
                  key={value.key}
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
              ))
            )}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : locationInfo ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
                  {locationInfo.title}
                </h2>
                {renderLocationContent(locationInfo.content)}
              </motion.div>
            ) : null}
            <motion.a
              href="https://maps.app.goo.gl/fm7SAxX6SYrVyz8D9?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-xl h-64 md:h-80 overflow-hidden group block"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7606!2d37.0731!3d-0.0167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMDEnMDAuMSJTIDM3wrAwNCcyMy4yIkU!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Rafiki House Nanyuki Location"
                className="pointer-events-none"
              />
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                  <Mountain className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm md:text-base">View on Google Maps</span>
                </div>
              </div>
            </motion.a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
