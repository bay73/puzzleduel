dbAuthURI = 'mongodb+srv://pd_auth_admin:'+ encodeURIComponent(process.env.DB_AUTH_PASS) + '@pd-auth.dtqjz.mongodb.net/?retryWrites=true&w=majority&appName=PD-Auth';
dbLogUri = 'mongodb+srv://pd_logs_admin:'+ encodeURIComponent(process.env.DB_LOG_PASS) + '@cluster0.ic02t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
dbDataUri = 'mongodb+srv://pd_data_admin:'+ encodeURIComponent(process.env.DB_DATA_PASS) + '@cluster0.i3igs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';



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
