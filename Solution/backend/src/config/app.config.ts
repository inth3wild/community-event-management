import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const environment = {
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || '3000',
};

// Ensure all required enviironment variables are set
const requiredEnvironmentVariables = ['JWT_SECRET'];

requiredEnvironmentVariables.forEach((variable) => {
  if (
    !environment.hasOwnProperty(variable) ||
    environment[variable as keyof typeof environment] === undefined
  ) {
    throw new Error(
      `Required environment variable '${variable}' is not set in the .env file`
    );
  }
});
