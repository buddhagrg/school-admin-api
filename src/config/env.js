const env = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  csrfTokenSecret: process.env.CSRF_TOKEN_SECRET,
  jwtAccessTokenTimeInMS: process.env.JWT_ACCESS_TOKEN_TIME_IN_MS,
  jwtRefreshTokenTimeInMS: process.env.JWT_REFRESH_TOKEN_TIME_IN_MS,
  csrfTokenTimeInMS: process.env.CSRF_TOKEN_TIME_IN_MS,
  mailAuthUser: process.env.MAIL_AUTH_USER,
  mailAuthPassword: process.env.MAIL_AUTH_PWD,
  emailVerificationTokenSecret: process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
  emailVerificationTokenTimeInMS:
    process.env.EMAIL_VERIFICATION_TOKEN_TIME_IN_MS,
  pwdCreateSecret: process.env.PASSWORD_CREATE_SECRET,
  pwdSetupTokenTimeInMS: process.env.PASSWORD_SETUP_TOKEN_TIME_IN_MS,
  pwdSetupTokenSecret: process.env.PASSWORD_SETUP_TOKEN_SECRET,
  uiRoute: process.env.UI_ROUTE,
  apiRoute: process.env.API_ROUTE,
  cookieDomain: process.env.COOKIE_DOMAIN,
  resendApiKey: process.env.RESEND_API_KEY,
};

module.exports = { env };
