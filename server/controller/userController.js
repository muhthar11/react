const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  saveRegister: async (req, res) => {
    try {
      const userExists = await User.findOne({ email: req.body.email });
      if (userExists) {
        return res
          .status(200)
          .send({ message: "user alrady exists", success: true });
      }
      const password = req.body.password;
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      req.body.password = hashedPassword;
      const newuser = new User(req.body);
      await newuser.save();

      return res
        .status(200)
        .send({ message: "user registered successfully", success: true });
    } catch (err) {
      return res.status(500).send({ messsage: err.message, success: false });
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(200)
          .send({ message: "user deos not exit", success: false });
      }
      const isMatch = await bcryptjs.compare(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(200)
          .send({ message: "incorrect password", success: false });
      } else {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
        });
        return res
          .status(200)
          .send({ message: "successfully login", success: true, token: token });
      }
    } catch (err) {
      return res.status(500).send({ message: err.message, success: false });
    }
  },

  getUserInfoById: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.userId });
      if (!user) {
        return res
          .status(200)
          .send({ message: "User does not exist", success: false });
      }
      const application = await Application.findOne({ userId: req.userId });
      return res.status(200).send({
        success: true,
        data: { name: user.name, email: user.email },
        application: application,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(200)
        .send({ message: "Error get user info", success: false });
    }
  },

  //   getUserInfoById: async (req, res) => {
  //     try {
  //       const user = await User.findOne({ _id: req.body.userId });
  //       if (!user) {
  //         return res
  //           .status(200)
  //           .send({ message: "user not found", success: false });
  //       } else {
  //         return res.status(200).send({ success: true, data: user });
  //       }
  //     } catch (err) {
  //       return res.status(500).send({ message: err.message, success: false });
  //     }
  //   },
};
