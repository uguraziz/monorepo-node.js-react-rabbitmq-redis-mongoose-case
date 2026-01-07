import { useState } from 'react';
import { Button } from '../../../components/ui/button.jsx';
import { Input } from '../../../components/ui/input.jsx';
import { Label } from '../../../components/ui/label.jsx';

export const OtpForm = ({ email, onSubmit }) => {
  const [otp, setOtp] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      onSubmit(otp);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">OTP Doğrulama</h1>
        <p className="text-muted-foreground mt-2">
          {email} adresine gönderilen 6 haneli kodu girin
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">OTP Kodu</Label>
          <Input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            maxLength={6}
            className="text-center text-2xl tracking-widest"
            placeholder="000000"
          />
        </div>
        <Button type="submit" className="w-full" disabled={otp.length !== 6}>
          Doğrula
        </Button>
      </form>
    </div>
  );
};

