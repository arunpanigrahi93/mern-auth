import mongoose from "mongoose";

const userSchema = new mongoose.connect({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  isAccountVerified: { type: Boolean, default: false },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
});

//insted of create model every time it checks user model present or not
const userModel = mongoose.Model.user || mongoose.model("user", userSchema);

export default userModel;
