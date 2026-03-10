import { createExpressApp } from "../express/index";

const PORT = Number(process.env.PORT || 3105);

const app = createExpressApp();

export { app };

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`pInk API (Express) running on http://localhost:${PORT}`);
  });
}
