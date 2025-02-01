const server = require("./app.js");
const { env } = require("./config");

const PORT = env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGTERM", async () => {
  await server.close(() => {
    console.log("Process terminated");
  });
});
