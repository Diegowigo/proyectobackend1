import bcrypt from "bcrypt";

export const generateHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validateHash = (pass, hash) => bcrypt.compareSync(pass, hash);

export const processErrors = (res, error) => {
  console.log(error);
  res.setHeader("Content-Type", "application/json");
  return res.status(500).json({
    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
    detail: `${error.message}`,
  });
};
