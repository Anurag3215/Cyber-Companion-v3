import dotenv from 'dotenv';
import { createApp } from './app.js';

dotenv.config();

const app = createApp();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Cyber Companion API] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
