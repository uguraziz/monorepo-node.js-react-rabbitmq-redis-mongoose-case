import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth.js';
import { OtpForm } from '../components/OtpForm.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { Input } from '../../../components/ui/input.jsx';
import { Label } from '../../../components/ui/label.jsx';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email');
  const { requestOTP, login } = useAuth();
  const navigate = useNavigate();
  
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await requestOTP(email);
      if (response.otp) {
        console.log('🔐 OTP Kodu (Development):', response.otp);
        alert(`OTP Kodu: ${response.otp}\n\n(Bu sadece development modunda gösterilir)`);
      }
      setStep('otp');
    } catch (error) {
      alert(error.message);
    }
  };
  
  const handleOtpSubmit = async (otp) => {
    try {
      await login(email, otp);
      navigate('/projects');
    } catch (error) {
      alert(error.message);
    }
  };
  
  if (step === 'otp') {
    return <OtpForm email={email} onSubmit={handleOtpSubmit} />;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Giriş Yap</h1>
        <p className="text-muted-foreground mt-2">E-posta adresinize gönderilen OTP ile giriş yapın</p>
      </div>
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="ornek@email.com"
          />
        </div>
        <Button type="submit" className="w-full">
          OTP Gönder
        </Button>
      </form>
    </div>
  );
};

