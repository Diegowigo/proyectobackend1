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
