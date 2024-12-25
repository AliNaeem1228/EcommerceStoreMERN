import asyncHandler from "express-async-handler";
import Size from "../model/Size.js";

export const createSizeCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const sizeFound = await Size.findOne({ name });
  if (sizeFound) {
    throw new Error("size already exists");
  }

  const size = await Size.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.json({
    status: "success",
    message: "size created successfully",
    size,
  });
});

export const getAllSizesCtrl = asyncHandler(async (req, res) => {
  const sizes = await Size.find();
  res.json({
    status: "success",
    message: "sizes fetched successfully",
    sizes,
  });
});

export const getSingleSizeCtrl = asyncHandler(async (req, res) => {
  const size = await Size.findById(req.params.id);
  res.json({
    status: "success",
    message: "size fetched successfully",
    size,
  });
});

export const updateSizeCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const size = await Size.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "size updated successfully",
    size,
  });
});

export const deleteSizeCtrl = asyncHandler(async (req, res) => {
  await Size.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "size deleted successfully",
  });
});
