import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Photo from "../models/photoModel.js";

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      succedded: true,
      user
    });
  } catch (error) {
    let errors = {};

    if (error.code === 11000) {
      errors.emails = "Email is already in use";
    }
    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
    }

    res.status(500).json({
      succedded: false,
      errors,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    let same = false;

    if (user) {
      same = await bcrypt.compare(password, user.password);
    } else {
      return res.status(401).json({
        succedded: false,
        error: "There is no such user",
      });
    }

    if (same) {
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });

      res.redirect("/users/dashboard");
    } else {
      res.status(401).json({
        succedded: false,
        error: "Password are not matched",
      });
    }
  } catch (error) {
    res.status(500).json({
      succedded: false,
      error: error,
    });
  }
};

const getDashboardPage = async (req, res) => {
  const photos = await Photo.find({ user: res.locals.user._id });
  const user = await User.findById({ _id: res.locals.user._id }).populate(["followings", "followers"]);
  res.render("dashboard", { link: "dashboard", photos, user });
};

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: res.locals.user._id } });
    res.status(200).render("users", { users, link: "users" });
  } catch (error) {
    res.status(500).json({
      succedded: false,
      error: error,
    });
  }
};

const getAUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    const inFollowers = user.followers.some(follower => {
      return follower.equals(res.locals.user._id);
    });
    const photos = await Photo.find({ user: user._id });
    res.status(200).render("user", { user, photos, link: "user", inFollowers });
  } catch (error) {
    res.status(500).json({
      succedded: false,
      error: error,
    });
  }
};

const follow = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { followers: res.locals.user._id } },
      { new: true }
    );

    user = await User.findByIdAndUpdate(
      { _id: res.locals.user._id },
      { $push: { followings: req.params.id } },
      { new: true }
    );

    res.status(200).redirect("back");
  } catch (error) {
    res.status(500).json({
      succedded: false,
      error: error,
    });
  }
};


const unfollow = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $pull: { followers: res.locals.user._id } },
      { new: true }
    );

    user = await User.findByIdAndUpdate(
      { _id: res.locals.user._id },
      { $pull: { followings: req.params.id } },
      { new: true }
    );

    res.status(200).redirect("back");
  } catch (error) {
    res.status(500).json({
      succedded: false,
      error: error,
    });
  }
};

export { createUser, loginUser, getDashboardPage, getAllUsers, getAUser, follow, unfollow };
