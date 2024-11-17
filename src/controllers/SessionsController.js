import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { usersService } from "../repository/Users.service.js";

export class SessionsController {
  static error = (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).json({ error: `Error al autenticar` });
  };

  static register = (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json({
      payload: `Registro exitoso para ${req.user.first_name}`,
      user: req.user,
    });
  };

  static login = async (req, res) => {
    try {
      let token = jwt.sign(req.user, config.SECRET, { expiresIn: 3600 });

      let userDTO = await usersService.getBy({ _id: req.user._id });

      if (!userDTO) {
        return res.status(404).json({ message: "User not found" });
      }

      res.cookie("currentUser", token, { httpOnly: true });
      res.setHeader("Content-Type", "application/json");
      return res.status(201).json({
        payload: `Login exitoso para ${req.user.first_name}`,
        userLoggedIn: userDTO,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error during login", error: error.message });
    }
  };

  static current = async (req, res) => {
    let userDTO = await usersService.getBy({ _id: req.user._id });

    if (!userDTO) {
      return res.status(404).json({ message: "User not found" });
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ userLoggedIn: userDTO });
  };

  static callBackGithub = (req, res) => {
    const token = jwt.sign({ user: req.user }, config.SECRET, {
      expiresIn: "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      payload: "Login exitoso",
      userLoggedIn: req.user,
    });
  };
}
