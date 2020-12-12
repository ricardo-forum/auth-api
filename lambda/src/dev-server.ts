import { createApi } from "./createApi";

const { PORT } = process.env;

createApi().listen(PORT, (err) => {
  if (!err) {
    console.log("");

    console.log("Server is running on http://localhost:" + PORT);
  } else {
    console.error(err);
  }
});
