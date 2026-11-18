// Address of a database. It can be set by the environment variable (tests use it to run with a temporary database),
// by default it is the production database.
function mongoUri(variable, defaultUri) {
  if (process.env[variable]) {
    return process.env[variable];
  }
  if (process.env.NODE_ENV == 'test') {
    // Tests should never be connected to the production databases.
    throw new Error(variable + ' should be set when NODE_ENV is test');
  }
  return defaultUri;
}

const dbAuthURI = mongoUri('MONGO_AUTH_URI', 'mongodb+srv://pd_auth_admin:'+ encodeURIComponent(process.env.DB_AUTH_PASS) + '@pd-auth.dtqjz.mongodb.net/?retryWrites=true&w=majority&appName=PD-Auth');
const dbLogUri = mongoUri('MONGO_LOG_URI', 'mongodb+srv://pd_logs_admin:'+ encodeURIComponent(process.env.DB_LOG_PASS) + '@cluster0.ic02t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
const dbDataUri = mongoUri('MONGO_DATA_URI', 'mongodb+srv://pd_data_admin:'+ encodeURIComponent(process.env.DB_DATA_PASS) + '@cluster0.i3igs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

module.exports = {
  mongoAuthURI: dbAuthURI,
  mongoDataURI: dbDataUri,
  mongoLogURI: dbLogUri,
  recaptcha: {
    siteKey: '6Lcr5-kUAAAAAFUWp_nBJkXnoWWW0DbJR7CMxHmF',
    secret: process.env.CAPTCHA_KEY
  },
  email: {
    service: 'Mail.Ru',
    auth: {
      user: 'puzzleduel.club@mail.ru',
      pass: process.env.EMAIL_PASS
    }
  }
};
