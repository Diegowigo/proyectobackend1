export const auth = (permissions = []) => {
  return (req, res, next) => {
    if (!Array.isArray(permissions)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: `Error en permisos de la ruta` });
    }

    permissions = permissions.map((p) => p.toLowerCase());
    if (permissions.includes("public")) {
      return next();
    }

    if (!req.user || !req.user.role) {
      res.setHeader("Content-Type", "application/json");
      return res.status(401).json({ error: `No hay usuarios autenticados` });
    }

    if (!permissions.includes(req.user.role.toLowerCase())) {
      res.setHeader("Content-Type", "application/json");
      return res.status(403).json({
        error: `No tiene privilegios suficientes para acceder al recurso solicitado`,
      });
    }

    next();
  };
};

// import jwt from "jsonwebtoken";
// import { config } from "../config/config.js";

// export const auth = (req, res, next) => {
//   console.log(req.cookies);

//   if (!req.cookies.tokenCookie) {
//     res.setHeader("Content-Type", "application/json");
//     return res.status(401).json({ error: `Unauthorized - no llega token` });
//   }

//   let token = req.cookies.tokenCookie;
//   try {
//     req.user = jwt.verify(token, config.SECRET);
//   } catch (error) {
//     res.setHeader("Content-Type", "application/json");
//     return res.status(401).json({ error: `${error.message}` });
//   }

//   next();
// };
