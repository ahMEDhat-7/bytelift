import app from "./config/app";
import { init } from "./config/db";

(() => {
  app.listen(process.env.PORT, () => {
    init();
    console.log(`Server up on ${process.env.PORT}`);
  });
})();
