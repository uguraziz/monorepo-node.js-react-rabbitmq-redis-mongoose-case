import { hashPassword, comparePassword } from '../../utils/crypto.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { generateTokenHash } from '../../utils/crypto.js';
import { config } from '../../config/env.js';
import { publishEvent } from '../../events/publisher.js';
import { authRepository } from './repository.js';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const authService = {
  async requestOTP(email) {
    const user = await authRepository.findByEmail(email);
    
    if (!user) {
      const hashedPassword = await hashPassword('temp-password');
      const newUser = await authRepository.create({
        email,
        password: hashedPassword,
        isVerified: false,
      });
      
      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + config.otp.expiresIn * 1000);
      
      await authRepository.updateOtp(email, otpCode, expiresAt);
      
      await publishEvent('auth.otp.requested', 'otp.requested', {
        email,
        otp: otpCode,
      });
      
      if (config.nodeEnv === 'development') {
        return { message: 'OTP gönderildi', otp: otpCode };
      }
      
      return { message: 'OTP gönderildi' };
    }
    
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + config.otp.expiresIn * 1000);
    
    await authRepository.updateOtp(email, otpCode, expiresAt);
    
    await publishEvent('auth.otp.requested', 'otp.requested', {
      email,
      otp: otpCode,
    });
    
    if (config.nodeEnv === 'development') {
      return { message: 'OTP gönderildi', otp: otpCode };
    }
    
    return { message: 'OTP gönderildi' };
  },
  
  async verifyOTP(email, otpCode) {
    const user = await authRepository.findByEmail(email);
    
    if (!user || !user.otp) {
      throw new Error('OTP bulunamadı');
    }
    
    if (user.otp.code !== otpCode) {
      throw new Error('Geçersiz OTP');
    }
    
    if (new Date() > user.otp.expiresAt) {
      throw new Error('OTP süresi dolmuş');
    }
    
    await authRepository.verifyUser(email);
    
    const accessToken = signAccessToken({ id: user._id.toString(), email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ id: user._id.toString() });
    const hashedRefreshToken = generateTokenHash(refreshToken);
    
    await authRepository.createSession({
      userId: user._id,
      refreshToken: hashedRefreshToken,
      lastActivity: new Date(),
    });
    
    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  },
  
  async refreshToken(refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);
    
    const user = await authRepository.findById(decoded.id);
    
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }
    
    const sessions = await authRepository.findUserSessions(user._id);
    
    let validSession = null;
    for (const session of sessions) {
      try {
        const isValid = await comparePassword(refreshToken, session.refreshToken);
        if (isValid) {
          validSession = session;
          break;
        }
      } catch (error) {
        continue;
      }
    }
    
    if (!validSession) {
      throw new Error('Geçersiz refresh token');
    }
    
    const newAccessToken = signAccessToken({ id: user._id.toString(), email: user.email, role: user.role });
    const newRefreshToken = signRefreshToken({ id: user._id.toString() });
    const newHashedRefreshToken = generateTokenHash(newRefreshToken);
    
    await authRepository.deleteSession(validSession.refreshToken);
    await authRepository.createSession({
      userId: user._id,
      refreshToken: newHashedRefreshToken,
      lastActivity: new Date(),
    });
    
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },
  
  async logout(refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await authRepository.findById(decoded.id);
      
      if (user) {
        const sessions = await authRepository.findUserSessions(user._id);
        
        for (const session of sessions) {
          try {
            const isValid = await comparePassword(refreshToken, session.refreshToken);
            if (isValid) {
              await authRepository.deleteSession(session.refreshToken);
              return { message: 'Çıkış yapıldı' };
            }
          } catch (error) {
            continue;
          }
        }
      }
    } catch (error) {
    }
    
    return { message: 'Çıkış yapıldı' };
  },
  
  async logoutAll(userId) {
    await authRepository.deleteUserSessions(userId);
    return { message: 'Tüm oturumlar kapatıldı' };
  },
};

