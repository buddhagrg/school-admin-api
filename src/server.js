import { app } from './app.js';
import { db, env } from './config/index.js';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function shutdown() {
  console.log('Shutting down...');

  //force exit if not closed within 10 seconds
  const timeout = setTimeout(() => {
    console.log('Forcing shutdown');
    process.exit(1);
  }, 10000);

  try {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
    await db.end();

    clearTimeout(timeout);
    console.log('shutdown complete');
    process.exit(0);
  } catch (error) {
    console.log('shutdown error: ', err);
    process.exit(1);
  }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
