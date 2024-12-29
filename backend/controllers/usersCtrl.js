import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import Otp from "../model/OTP.js";
import sendMail from "../utils/Emails.js";
import generateOTP from "../utils/GenerateOtp.js";
import PasswordResetToken from "../model/PasswordResetToken.js";

export const registerUserCtrl = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  res.status(201).json({
    status: "success",
    message: "User Registered Successfully",
    data: user,
  });
});

export const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userFound = await User.findOne({
    email,
  });
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    if (!userFound.isVerified) {
      res.json({
        message: "User is not Verified",
        verified: userFound.isVerified,
        user: userFound,
      });
    } else if (userFound.isVerified) {
      res.json({
        status: "success",
        message: "User logged in successfully",
        userFound,
        token: generateToken(userFound?._id),
        verified: userFound.isVerified,
        _id: userFound._id,
      });
    }
  } else {
    throw new Error("Invalid login credentials");
  }
});

export const getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userAuthId).populate("orders");
  res.json({
    status: "success",
    message: "User profile fetched successfully",
    user,
  });
});

export const updateShippingAddresctrl = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    phone,
    country,
  } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        phone,
        country,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "User shipping address updated successfully",
    user,
  });
});

export const verifyOtp = async (req, res) => {
  try {
    const isValidUserId = await User.findById(req.body.userId);

    if (!isValidUserId) {
      return res.status(404).json({
        message: "User not Found, for which the otp has been generated",
      });
    }

    const isOtpExisting = await Otp.findOne({ user: isValidUserId._id });

    if (!isOtpExisting) {
      return res.status(404).json({ message: "Otp not found" });
    }

    if (isOtpExisting.expiresAt < new Date()) {
      await Otp.findByIdAndDelete(isOtpExisting._id);
      return res.status(400).json({ message: "Otp has been expired" });
    }

    if (
      isOtpExisting &&
      (await bcrypt.compare(req.body.otp, isOtpExisting.otp))
    ) {
      await Otp.findByIdAndDelete(isOtpExisting._id);
      const userFound = await User.findByIdAndUpdate(
        isValidUserId._id,
        { isVerified: true },
        { new: true }
      );
      return res.json({
        status: "success",
        message: "User verified in successfully",
        userFound,
        token: generateToken(userFound?._id),
        verified: userFound.isVerified,
        _id: userFound._id,
      });
    }

    return res.status(400).json({ message: "Otp is invalid or expired" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some Error occured" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const existingUser = await User.findById(req.body.user);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await Otp.deleteMany({ user: existingUser._id });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newOtp = new Otp({
      user: req.body.user,
      otp: hashedOtp,
      expiresAt: Date.now() + parseInt("120000"),
    });
    await newOtp.save();

    await sendMail(
      existingUser.email,
      `OTP Verification for Your Account`,
      `Your One-Time Password (OTP) for account verification is: <b>${otp}</b>.</br>Do not share this OTP with anyone for security reasons`
    );

    res.status(201).json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({
      message: "Some error occured while resending otp, please try again later",
    });
    console.log(error);
  }
};

export const forgotPassword = async (req, res) => {
  let newToken;
  try {
    const isExistingUser = await User.findOne({ email: req.body.email });

    if (!isExistingUser) {
      return res
        .status(404)
        .json({ message: "Provided email does not exists" });
    }

    await PasswordResetToken.deleteMany({ user: isExistingUser._id });

    const passwordResetToken = generateToken(isExistingUser?._id);

    const hashedToken = await bcrypt.hash(passwordResetToken, 10);

    newToken = new PasswordResetToken({
      user: isExistingUser._id,
      token: passwordResetToken,
      expiresAt: Date.now() + parseInt("120000"),
    });
    await newToken.save();

    await sendMail(
      isExistingUser.email,
      "Password Reset Link for Your Account",
      `<p>Dear ${isExistingUser.name},

        We received a request to reset the password for your account. If you initiated this request, please use the following link to reset your password:</p>
        
        <p><a href=${process.env.FRONTEND}/reset-password/${isExistingUser._id}/${passwordResetToken} target="_blank">Reset Password</a></p>
        
        <p>This link is valid for a limited time. If you did not request a password reset, please ignore this email. Your account security is important to us.
        
        Thank you,
        </p>`
    );

    res
      .status(200)
      .json({ message: `Password Reset link sent to ${isExistingUser.email}` });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occured while sending password reset mail" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const isExistingUser = await User.findById(req.body.userId);

    if (!isExistingUser) {
      return res.status(404).json({ message: "User does not exists" });
    }

    const isResetTokenExisting = await PasswordResetToken.findOne({
      user: isExistingUser._id,
    });

    if (!isResetTokenExisting) {
      return res.status(404).json({ message: "Reset Link is Not Valid" });
    }

    if (isResetTokenExisting.expiresAt < new Date()) {
      await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);
      return res.status(404).json({ message: "Reset Link has been expired" });
    }

    if (isResetTokenExisting && isResetTokenExisting.expiresAt > new Date()) {
      await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);

      await User.findByIdAndUpdate(isExistingUser._id, {
        password: await bcrypt.hash(req.body.password, 10),
      });
      return res.status(200).json({ message: "Password Updated Successfuly" });
    }

    return res.status(404).json({ message: "Reset Link has been expired" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Error occured while resetting the password, please try again later",
    });
  }
};
