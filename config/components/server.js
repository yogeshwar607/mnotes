const joi = require('joi');

const envVarsSchema = joi.object({
        NODE_ENV: joi.string()
            .allow(['development', 'production', 'test', 'provision'])
            .required(),
        PORT: joi.number()
            .required(),
    }).unknown()
    .required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    isTest: envVars.NODE_ENV === 'test',
    isDevelopment: envVars.NODE_ENV === 'development',
    port: envVars.PORT,
    jwtSecret: envVars.JWT_SECRET,
    fxappid: envVars.FxRate_AppID,
};

module.exports = config;