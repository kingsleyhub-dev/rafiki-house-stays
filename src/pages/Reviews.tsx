import { motion } from 'framer-motion';
import { Star, Quote, MapPin, User, ExternalLink, MessageSquare } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useReviews } from '@/hooks/useReviews';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getCountryFlag } from '@/lib/countryFlags';
import heroImage from '@/assets/hero-stays.jpg';

function ReviewHero({ reviewCount, averageScore }: { reviewCount: number; averageScore: number }) {
  return (
    <section className="relative h-[280px] sm:h-[340px] overflow-hidden">
      <img
        src={heroImage}
        alt="Rafiki House Nanyuki"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Guest Reviews
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto">
            Hear what our guests have to say about their stay at Rafiki House Nanyuki
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            {averageScore > 0 && (
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="h-5 w-5 text-accent fill-accent" />
                <span className="text-white font-bold text-lg">{averageScore.toFixed(1)}</span>
                <span className="text-white/70 text-sm">/ 10</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full">
              <MessageSquare className="h-4 w-4 text-white/80" />
              <span className="text-white font-semibold">{reviewCount}</span>
              <span className="text-white/70 text-sm">reviews</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ReviewCard({ review, index }: { review: any; index: number }) {
  const flag = getCountryFlag(review.reviewer_country);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="bg-card border border-border rounded-2xl p-5 sm:p-6 flex flex-col gap-4 card-hover"
    >
      {/* Header: flag avatar + name + score */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {flag ? (
              <span className="text-2xl leading-none">{flag}</span>
            ) : (
              <User className="h-5 w-5 text-navy" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">{review.reviewer_name}</p>
            {review.reviewer_country && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{review.reviewer_country}</span>
              </p>
            )}
          </div>
        </div>
        {review.score && (
          <div className="bg-navy text-white px-2.5 py-1 rounded-lg text-sm font-bold flex-shrink-0">
            {review.score}
          </div>
        )}
      </div>

      {/* Title */}
      {review.review_title && (
        <h3 className="font-semibold text-sm text-foreground leading-snug">
          {review.review_title}
        </h3>
      )}

      {/* Positive text */}
      {review.positive_text && (
        <div className="flex gap-2.5">
          <Quote className="h-4 w-4 text-navy flex-shrink-0 mt-1" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.positive_text}
          </p>
        </div>
      )}

      {/* Negative text */}
      {review.negative_text && (
        <div className="flex gap-2.5">
          <Quote className="h-4 w-4 text-destructive flex-shrink-0 mt-1" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.negative_text}
          </p>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-auto pt-1">
        {review.traveler_type && (
          <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">
            {review.traveler_type}
          </span>
        )}
        {review.stay_date && (
          <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">
            {review.stay_date}
          </span>
        )}
        {review.room_type && (
          <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">
            {review.room_type}
          </span>
        )}
      </div>
    </motion.article>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { data: reviews = [], isLoading } = useReviews();

  const scoredReviews = reviews.filter(r => r.score);
  const averageScore = scoredReviews.length > 0
    ? scoredReviews.reduce((sum, r) => sum + (r.score || 0), 0) / scoredReviews.length
    : 0;

  return (
    <Layout>
      <ReviewHero reviewCount={reviews.length} averageScore={averageScore} />

      <section className="page-container section-padding">
        {isLoading ? (
          <ReviewsSkeleton />
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">No reviews yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Guest reviews will appear here once they're added. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} />
              ))}
            </div>

            {/* Booking.com CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 text-center"
            >
              <div className="inline-flex flex-col items-center gap-3 bg-muted/50 border border-border rounded-2xl px-8 py-6">
                <p className="text-sm text-muted-foreground">
                  Want to see more reviews or leave your own?
                </p>
                <Button asChild variant="outline" className="gap-2">
                  <a
                    href="https://www.booking.com/hotel/ke/rafiki-house.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Booking.com
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </section>
    </Layout>
  );
}
