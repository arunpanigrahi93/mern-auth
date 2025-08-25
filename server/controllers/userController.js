import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const user = await userModel.findById(userId);

    if (!user) {
      res.json({ success: false, message: "user not found" });
    }
    res.json({
      success: true,
      getUserData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
