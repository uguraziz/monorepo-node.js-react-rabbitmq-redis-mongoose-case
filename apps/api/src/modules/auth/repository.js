import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  otp: { code: String, expiresAt: Date },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
  deviceInfo: { type: String },
  ipAddress: { type: String },
  lastActivity: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', UserSchema);
export const Session = mongoose.model('Session', SessionSchema);

export const authRepository = {
  async findByEmail(email) {
    return User.findOne({ email });
  },
  
  async create(userData) {
    const user = new User(userData);
    return user.save();
  },
  
  async findById(id) {
    return User.findById(id);
  },
  
  async updateOtp(email, otpCode, expiresAt) {
    return User.findOneAndUpdate(
      { email },
      { otp: { code: otpCode, expiresAt } },
      { new: true }
    );
  },
  
  async verifyUser(email) {
    return User.findOneAndUpdate(
      { email },
      { isVerified: true, $unset: { otp: 1 } },
      { new: true }
    );
  },
  
  async createSession(sessionData) {
    const session = new Session(sessionData);
    return session.save();
  },
  
  async findSessionByToken(refreshToken) {
    return Session.findOne({ refreshToken });
  },
  
  async findUserSessions(userId) {
    return Session.find({ userId });
  },
  
  async deleteSession(refreshToken) {
    return Session.deleteOne({ refreshToken });
  },
  
  async deleteUserSessions(userId, excludeToken = null) {
    const query = { userId };
    if (excludeToken) {
      query.refreshToken = { $ne: excludeToken };
    }
    return Session.deleteMany(query);
  },
};

