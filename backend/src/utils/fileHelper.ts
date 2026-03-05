import { createHash } from "node:crypto";

const hashName = (originalName: string) => {
  //   const [fileName, ext] = originalName.split(".");
  const hash = createHash("sha256");
  hash.update(originalName);
  return `${hash.digest("hex")}`;
};

export { hashName };
