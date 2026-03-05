import bcrypt from "bcryptjs";

const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

const verifyPassword = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export { hashPassword, verifyPassword };
