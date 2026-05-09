import 'dotenv/config'; // This now works because dotenv is installed

export default {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};