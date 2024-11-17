export class SessionsController {
  static error = (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).json({ error: `Error al autenticar` });
  };

  static;
}
