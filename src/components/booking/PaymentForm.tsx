import { useState } from 'react';
import { CreditCard, Lock, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  const formatPhoneNumber = (value: string) => {
    return value.replace(/[^0-9]/g, '').substring(0, 12);
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
    
    if (!mpesaPhone || mpesaPhone.length < 10) {
      newErrors.mpesaPhone = 'Please enter a valid M-Pesa phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      if (validateCardForm()) {
        onPaymentSuccess();
      }
    } else {
      if (validateMpesaForm()) {
        onPaymentSuccess();
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

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
        
        <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'card' | 'mpesa')}>
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
                {errors.cardholderName && (
                  <p className="text-xs text-destructive">{errors.cardholderName}</p>
                )}
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
                {errors.cardNumber && (
                  <p className="text-xs text-destructive">{errors.cardNumber}</p>
                )}
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
                  {errors.expiryDate && (
                    <p className="text-xs text-destructive">{errors.expiryDate}</p>
                  )}
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
                  {errors.cvv && (
                    <p className="text-xs text-destructive">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Accepted Cards */}
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
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">M-Pesa Payment</h4>
                  <p className="text-xs text-muted-foreground">Lipa na M-Pesa</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm bg-background/50 rounded-lg p-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Paybill Number:</span>
                  <span className="font-bold text-foreground">400200</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Account Number:</span>
                  <span className="font-bold text-foreground">40075137</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-bold text-[#4CAF50]">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
              <div className="relative">
                <Input
                  id="mpesaPhone"
                  placeholder="0712345678"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(formatPhoneNumber(e.target.value))}
                  maxLength={12}
                  className={`pl-10 ${errors.mpesaPhone ? 'border-destructive' : ''}`}
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.mpesaPhone && (
                <p className="text-xs text-destructive">{errors.mpesaPhone}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter your M-Pesa registered phone number. You will receive a payment prompt.
              </p>
            </div>

            {/* M-Pesa Instructions */}
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#4CAF50]" />
                How to pay via M-Pesa:
              </h5>
              <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
                <li>Go to M-Pesa on your phone</li>
                <li>Select "Lipa na M-Pesa"</li>
                <li>Select "Pay Bill"</li>
                <li>Enter Paybill: <strong className="text-foreground">400200</strong></li>
                <li>Enter Account: <strong className="text-foreground">40075137</strong></li>
                <li>Enter Amount: <strong className="text-foreground">{formatPrice(totalAmount)}</strong></li>
                <li>Enter your M-Pesa PIN and confirm</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 space-y-3 border-t border-border">
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing Payment...' : `Pay ${formatPrice(totalAmount)}`}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
