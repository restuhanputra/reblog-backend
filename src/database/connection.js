import mongoose from 'mongoose';

const connection = async (url) => {
  try {
    mongoose.set('strictQuery', false);
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    consola.success('Database connected');
  } catch (error) {
    consola.error(`Error: ${error.message}`);
  }
};

export default connection;
