import { useState } from 'react';
import { Star, Trash2, Plus, RefreshCw, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useReviews,
  useScrapeReviews,
  useDeleteReview,
  useCreateReview,
  Review,
} from '@/hooks/useReviews';
import { toast } from '@/hooks/use-toast';

export function ReviewsManager() {
  const { data: reviews = [], isLoading } = useReviews();
  const scrapeReviews = useScrapeReviews();
  const deleteReview = useDeleteReview();
  const createReview = useCreateReview();

  const [isAddingReview, setIsAddingReview] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newReview, setNewReview] = useState({
    reviewer_name: '',
    reviewer_country: '',
    review_title: '',
    positive_text: '',
    negative_text: '',
    score: '',
    stay_date: '',
    room_type: '',
    traveler_type: '',
  });

  const handleScrape = async () => {
    try {
      const result = await scrapeReviews.mutateAsync();
      toast({
        title: 'Reviews scraped',
        description: `${result.reviewsAdded} new reviews were added from Booking.com.`,
      });
    } catch (error: any) {
      toast({
        title: 'Scraping failed',
        description: error.message || 'Could not scrape reviews from Booking.com. Try adding them manually.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteReview.mutateAsync(deleteId);
      setDeleteId(null);
      toast({ title: 'Review deleted' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete review.', variant: 'destructive' });
    }
  };

  const handleAddReview = async () => {
    if (!newReview.reviewer_name.trim()) {
      toast({ title: 'Error', description: 'Reviewer name is required.', variant: 'destructive' });
      return;
    }

    try {
      await createReview.mutateAsync({
        reviewer_name: newReview.reviewer_name,
        reviewer_country: newReview.reviewer_country || null,
        review_title: newReview.review_title || null,
        positive_text: newReview.positive_text || null,
        negative_text: newReview.negative_text || null,
        score: newReview.score ? parseFloat(newReview.score) : null,
        stay_date: newReview.stay_date || null,
        room_type: newReview.room_type || null,
        traveler_type: newReview.traveler_type || null,
      });
      setIsAddingReview(false);
      setNewReview({
        reviewer_name: '',
        reviewer_country: '',
        review_title: '',
        positive_text: '',
        negative_text: '',
        score: '',
        stay_date: '',
        room_type: '',
        traveler_type: '',
      });
      toast({ title: 'Review added' });
    } catch {
      toast({ title: 'Error', description: 'Failed to add review.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Guest Reviews</h3>
          <p className="text-sm text-muted-foreground">
            Manage reviews from Booking.com or add them manually
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleScrape}
            disabled={scrapeReviews.isPending}
          >
            {scrapeReviews.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Fetch from Booking.com
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setIsAddingReview(true)}
          >
            <Plus className="h-4 w-4" />
            Add Manually
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No reviews yet. Fetch from Booking.com or add manually.
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{review.reviewer_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{review.reviewer_country || '—'}</TableCell>
                    <TableCell>
                      {review.score ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-accent text-accent" />
                          <span className="text-sm font-medium">{review.score}</span>
                        </div>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {review.positive_text || review.review_title || '—'}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">{review.traveler_type || '—'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(review.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add Review Dialog */}
      <Dialog open={isAddingReview} onOpenChange={setIsAddingReview}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Review Manually</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Reviewer Name *</Label>
                <Input
                  value={newReview.reviewer_name}
                  onChange={(e) => setNewReview(p => ({ ...p, reviewer_name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>Country</Label>
                <Input
                  value={newReview.reviewer_country}
                  onChange={(e) => setNewReview(p => ({ ...p, reviewer_country: e.target.value }))}
                  placeholder="Kenya"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Score (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  step="0.1"
                  value={newReview.score}
                  onChange={(e) => setNewReview(p => ({ ...p, score: e.target.value }))}
                  placeholder="9.0"
                />
              </div>
              <div>
                <Label>Traveler Type</Label>
                <Input
                  value={newReview.traveler_type}
                  onChange={(e) => setNewReview(p => ({ ...p, traveler_type: e.target.value }))}
                  placeholder="Couple, Family, Solo..."
                />
              </div>
            </div>
            <div>
              <Label>Review Title</Label>
              <Input
                value={newReview.review_title}
                onChange={(e) => setNewReview(p => ({ ...p, review_title: e.target.value }))}
                placeholder="Amazing experience!"
              />
            </div>
            <div>
              <Label>Positive Comments</Label>
              <Textarea
                value={newReview.positive_text}
                onChange={(e) => setNewReview(p => ({ ...p, positive_text: e.target.value }))}
                placeholder="What did the guest like?"
                rows={3}
              />
            </div>
            <div>
              <Label>Negative Comments</Label>
              <Textarea
                value={newReview.negative_text}
                onChange={(e) => setNewReview(p => ({ ...p, negative_text: e.target.value }))}
                placeholder="Any complaints? (optional)"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Stay Date</Label>
                <Input
                  value={newReview.stay_date}
                  onChange={(e) => setNewReview(p => ({ ...p, stay_date: e.target.value }))}
                  placeholder="January 2025"
                />
              </div>
              <div>
                <Label>Room Type</Label>
                <Input
                  value={newReview.room_type}
                  onChange={(e) => setNewReview(p => ({ ...p, room_type: e.target.value }))}
                  placeholder="Amaranth Suite"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingReview(false)}>Cancel</Button>
              <Button onClick={handleAddReview} disabled={createReview.isPending}>
                {createReview.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Add Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
