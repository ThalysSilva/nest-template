export const tokens = {
  development: process.env.TOKEN_DEVELOPMENT,
};

export const jwtConstants = {
  tokenSecretKey: process.env.TOKEN_SECRET_KEY,
  refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN,
};
