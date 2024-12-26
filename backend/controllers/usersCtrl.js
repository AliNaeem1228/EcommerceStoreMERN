import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import Otp from "../model/OTP.js";
import sendMail from "../utils/Emails.js";
import generateOTP from "../utils/GenerateOtp.js";

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

    // checks if otp is there and matches the hash value then updates the user verified status to true and returns the updated user
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
