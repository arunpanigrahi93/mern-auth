import userModel from "../models/userModel.js";

// Controller to get user data
export const getUserData = async (req, res) => {
  try {
    // Extract userId from the authenticated user (set in middleware)
    const { id: userId } = req.user;

    // Find user in the database by ID
    const user = await userModel.findById(userId);

    // If user is not found, return response
    if (!user) {
      res.json({ success: false, message: "user not found" });
    }

    // Send back selected user details (not exposing sensitive info)
    res.send(user);
    res.json({
      success: true,
      getUserData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (err) {
    // Handle errors (e.g., DB errors, unexpected exceptions)
    res.json({ success: false, message: err.message });
  }
};
