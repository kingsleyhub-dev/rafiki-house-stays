import { motion } from 'framer-motion';
import { Star, Quote, MapPin, User } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';
import { Skeleton } from '@/components/ui/skeleton';

export function ReviewsSection() {
  const { data: reviews = [], isLoading } = useReviews();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Guest Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) return null;

  const averageScore = reviews.reduce((sum, r) => sum + (r.score || 0), 0) / reviews.filter(r => r.score).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-semibold">Guest Reviews</h2>
          {averageScore > 0 && (
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold">{averageScore.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({reviews.length})</span>
            </div>
          )}
        </div>
        <a
          href="https://www.booking.com/hotel/ke/rafiki-house.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          View on Booking.com →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.slice(0, 6).map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{review.reviewer_name}</p>
                  {review.reviewer_country && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {review.reviewer_country}
                    </p>
                  )}
                </div>
              </div>
              {review.score && (
                <div className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-bold">
                  {review.score}
                </div>
              )}
            </div>

            {review.review_title && (
              <p className="font-medium text-sm">{review.review_title}</p>
            )}

            {review.positive_text && (
              <div className="flex gap-2">
                <Quote className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {review.positive_text}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {review.traveler_type && (
                <span className="bg-muted px-2 py-0.5 rounded-full">{review.traveler_type}</span>
              )}
              {review.stay_date && (
                <span className="bg-muted px-2 py-0.5 rounded-full">{review.stay_date}</span>
              )}
              {review.room_type && (
                <span className="bg-muted px-2 py-0.5 rounded-full">{review.room_type}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
