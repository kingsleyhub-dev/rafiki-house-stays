import { useState } from 'react';
import { CreditCard, Lock, Phone, Loader2, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaymentFormProps {
  totalAmount: number;
  onPaymentSuccess: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export function PaymentForm({ totalAmount, onPaymentSuccess, onCancel, isProcessing }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMpesaProcessing, setIsMpesaProcessing] = useState(false);
  const [mpesaSent, setMpesaSent] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const formatPhoneInput = (value: string) => {
    return value.replace(/[^0-9]/g, '').substring(0, 12);
  };

  /** Convert 07XX, +2547XX, 2547XX → 2547XXXXXXXX */
  const toSafaricomFormat = (phone: string): string => {
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7')) {
      cleaned = '254' + cleaned;
    }
    return cleaned;
  };

  const validateCardForm = () => {
    const newErrors: Record<string, string> = {};
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber || cleanCardNumber.length < 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    if (!expiryDate || expiryDate.length < 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else {
      const [month, year] = expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    if (!cvv || cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    if (!cardholderName.trim()) {
      newErrors.cardholderName = 'Please enter the cardholder name';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMpesaForm = () => {
    const newErrors: Record<string, string> = {};
    const formatted = toSafaricomFormat(mpesaPhone);
    if (!formatted || formatted.length < 12) {
      newErrors.mpesaPhone = 'Please enter a valid phone number (e.g., 0712345678)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMpesaPay = async () => {
    if (!validateMpesaForm()) return;

    setIsMpesaProcessing(true);
    setErrors({});

    try {
      const phoneNumber = toSafaricomFormat(mpesaPhone);
      const { data, error } = await supabase.functions.invoke('mpesa-pay', {
        body: { phoneNumber, amount: totalAmount },
      });

      if (error) {
        throw new Error(error.message || 'Failed to initiate M-Pesa payment');
      }

      if (data?.ResponseCode === '0') {
        setMpesaSent(true);
        toast({
          title: 'STK Push Sent!',
          description: 'Please check your phone for the M-Pesa PIN prompt and enter your PIN to complete payment.',
        });
        // After a short delay, proceed with booking
        setTimeout(() => {
          onPaymentSuccess();
        }, 5000);
      } else {
        const errorMsg = data?.errorMessage || data?.ResponseDescription || 'M-Pesa request failed';
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      console.error('M-Pesa error:', err);
      toast({
        title: 'Payment Failed',
        description: err.message || 'Could not initiate M-Pesa payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsMpesaProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      if (validateCardForm()) {
        onPaymentSuccess();
      }
    } else {
      handleMpesaPay();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const processing = isProcessing || isMpesaProcessing;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Notice */}
      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
        <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm text-muted-foreground">Secure payment powered by SSL encryption</span>
      </div>

      {/* Payment Methods Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Select Payment Method
        </h3>

        <Tabs value={paymentMethod} onValueChange={(v) => { setPaymentMethod(v as 'card' | 'mpesa'); setErrors({}); setMpesaSent(false); }}>
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="card" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CreditCard className="h-4 w-4" />
              <span>Card</span>
            </TabsTrigger>
            <TabsTrigger value="mpesa" className="flex items-center gap-2 data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white">
              <Phone className="h-4 w-4" />
              <span>M-Pesa</span>
            </TabsTrigger>
          </TabsList>

          {/* Card Payment Form */}
          <TabsContent value="card" className="space-y-4 mt-4">
            <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className={errors.cardholderName ? 'border-destructive' : ''}
                />
                {errors.cardholderName && <p className="text-xs text-destructive">{errors.cardholderName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className={`pr-12 ${errors.cardNumber ? 'border-destructive' : ''}`}
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                {errors.cardNumber && <p className="text-xs text-destructive">{errors.cardNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                    className={errors.expiryDate ? 'border-destructive' : ''}
                  />
                  {errors.expiryDate && <p className="text-xs text-destructive">{errors.expiryDate}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').substring(0, 4))}
                    maxLength={4}
                    className={errors.cvv ? 'border-destructive' : ''}
                  />
                  {errors.cvv && <p className="text-xs text-destructive">{errors.cvv}</p>}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 py-3 bg-muted/20 rounded-lg border border-border">
              <span className="text-xs text-muted-foreground">Accepted:</span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
            </div>
          </TabsContent>

          {/* M-Pesa Payment Form */}
          <TabsContent value="mpesa" className="space-y-4 mt-4">
            <div className="p-4 bg-[#4CAF50]/10 border border-[#4CAF50]/30 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#4CAF50] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">M-Pesa STK Push</h4>
                  <p className="text-xs text-muted-foreground">Lipa na M-Pesa — Instant prompt to your phone</p>
                </div>
              </div>

              <div className="bg-background/50 rounded-lg p-3">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-muted-foreground">Amount to pay:</span>
                  <span className="font-bold text-[#4CAF50]">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>

            {mpesaSent ? (
              <div className="flex flex-col items-center gap-3 p-6 bg-[#4CAF50]/5 border border-[#4CAF50]/20 rounded-lg text-center">
                <CheckCircle className="h-10 w-10 text-[#4CAF50]" />
                <div>
                  <h4 className="font-semibold text-foreground">STK Push Sent!</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Check your phone for the M-Pesa prompt and enter your PIN to complete payment.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                  <div className="relative">
                    <Input
                      id="mpesaPhone"
                      placeholder="e.g., 0712345678"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(formatPhoneInput(e.target.value))}
                      maxLength={12}
                      className={`pl-10 ${errors.mpesaPhone ? 'border-destructive' : ''}`}
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.mpesaPhone && <p className="text-xs text-destructive">{errors.mpesaPhone}</p>}
                  <p className="text-xs text-muted-foreground">
                    You'll receive an M-Pesa prompt on this number. Enter your PIN to pay.
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <h5 className="font-medium text-xs mb-2 flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 text-[#4CAF50]" />
                    How it works:
                  </h5>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Enter your M-Pesa phone number above</li>
                    <li>Tap "Pay with M-Pesa" below</li>
                    <li>Check your phone for the payment prompt</li>
                    <li>Enter your M-Pesa PIN to confirm</li>
                  </ol>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 space-y-3 border-t border-border">
        <Button
          type="submit"
          className={`w-full gap-2 ${paymentMethod === 'mpesa' ? 'bg-[#4CAF50] hover:bg-[#43A047] text-white' : ''}`}
          size="lg"
          disabled={processing || mpesaSent}
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : mpesaSent ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Awaiting Confirmation...
            </>
          ) : paymentMethod === 'mpesa' ? (
            <>
              <Phone className="h-4 w-4" />
              Pay with M-Pesa — {formatPrice(totalAmount)}
            </>
          ) : (
            `Pay ${formatPrice(totalAmount)}`
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onCancel}
          disabled={processing}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
