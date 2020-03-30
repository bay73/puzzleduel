dbPassword = 'mongodb+srv://pd_auth_admin:'+ encodeURIComponent(process.env.DB_PASS) + '@pd-auth-dtqjz.mongodb.net/test?retryWrites=true';

module.exports = {
    mongoURI: dbPassword
};
