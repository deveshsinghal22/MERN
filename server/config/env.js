let env = process.env.NODE_ENV || 'local';
let envConfig = {
    local: {
        siteUrl: 'http://localhost:3000',
        port: 3100,
        googleAuth: {
            clientID: 'your google client Id',
            clientSecret: 'your CS',
            callbackUrl: '/api/auth/google/callback'
        },
        mongoURI: 'mongodb://localhost:27017/AccMeals',
        sessionSecret: 'HU5ncOByrR',
    },
    development: {
        //hope for the best
    },
    production: {
        //hope for the best
    }
};
module.exports = envConfig[env];