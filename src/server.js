import consola from 'consola';
import app from './app';
import connectDb from './database/connection.js';
import config from './config/index.js';

try {
  app.listen(config.PORT, () => {
    connectDb(config.MONGO_URI);
    consola.success(`Server listening on port ${config.PORT}`);
  });
} catch (error) {
  consola.error(`Servr error: ${error.message}`);
}
