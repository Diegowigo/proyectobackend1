import jwt from "jsonwebtoken";
import config from "../config/config.js";
import UsersDTO from "../dto/UsersDTO.js";

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
      let token = jwt.sign(
        {
          id: req.user._id,
          email: req.user.email,
          first_name: req.user.first_name,
          role: req.user.role,
          cart: req.user.cart,
        },
        config.SECRET,
        { expiresIn: 3600 }
      );

      const userDTO = new UsersDTO(req.user);

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

  static async current(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      const response = {
        id: req.user.id,
        email: req.user.email,
        first_name: req.user.first_name,
        role: req.user.role,
      };

      if (req.user.cart) {
        response.cart = req.user.cart;
      }

      res.status(200).json({
        message: "Información del usuario obtenida exitosamente",
        user: response,
      });
    } catch (error) {
      console.error("Error en estrategia current:", error);
      res
        .status(500)
        .json({ error: "Error inesperado al obtener información del usuario" });
    }
  }

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

  static async logout(req, res) {
    res.clearCookie("currentUser");
    const { web } = req.query;
    if (web) {
      return res.redirect(`/login?mensaje=¡Logout exitoso!`);
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ mensaje: "¡Logout exitoso!" });
  }
}
