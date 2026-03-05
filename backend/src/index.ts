import app from "./config/app.ts";
import { init } from "./config/db.ts";

(() => {
  app.listen(process.env.PORT, () => {
    init();
    console.log(`Server up on ${process.env.PORT}`);
  });
})();
