import { registerUser, verifyUserPreview, loginUser } from "../services/userService.js";
import { sendSuccess } from "../utils/response.js";

const registerUserHandler = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    sendSuccess(res, 201, {
      id: user._id,
      accountId: user.accountId,
      fullName: user.fullName,
      nin: user.nin,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    next(error);
  }
};

const verifyUserHandler = async (req, res, next) => {
  try {
    const preview = await verifyUserPreview(req.params.identifier);
    sendSuccess(res, 200, preview);
  } catch (error) {
    next(error);
  }
};

const loginUserHandler = async (req, res, next) => {
  try {
    const user = await loginUser(req.body);
    sendSuccess(res, 200, user);
  } catch (error) {
    next(error);
  }
};

export { registerUserHandler, verifyUserHandler, loginUserHandler };
