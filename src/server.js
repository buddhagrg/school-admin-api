import { app as server } from './app.js';
import { env } from './config/index.js';

const PORT = env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  await server.close(() => {
    console.log('Process terminated');
  });
});
