const Joi = require('joi');

const envSchema = Joi.object({
    PORT: Joi.number().port().required(),
    BASE_URL: Joi.string().uri().required(),
    STATIC_URL: Joi.string().uri().optional(),
    FRONTEND_URL: Joi.string().uri().required(),
    ALLOWED_ORIGINS: Joi.string().required(),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

    MONGODB_URI: Joi.string().uri().required(),
    DATABASE_NAME: Joi.string().required(),

    JWT_SECRET: Joi.string().min(16).required(),
    JWT_ALGORITHM: Joi.string().default('HS256'),
    JWT_REFRESH_SECRET: Joi.string().min(16).optional(),
    SALT_ROUNDS: Joi.number().integer().min(10).max(15).default(10),
    ACCESS_TOKEN_EXPIRE: Joi.string().default('15m'),
    REFRESH_TOKEN_EXPIRE: Joi.string().default('7d'),
    RESET_TOKEN_EXPIRE: Joi.number().default(15),
    ACCESS_TOKEN_AGE: Joi.number().optional(),
    RESET_TOKEN_AGE: Joi.number().optional(),

    AUTH_BASE: Joi.string().valid('cookie', 'token').default('cookie'),

    AWS_ACCESS_KEY_ID: Joi.when('STORAGE_TYPE', { is: Joi.string().exist().pattern(/s3/), then: Joi.string().required(), otherwise: Joi.string().optional() }),
    AWS_SECRET_ACCESS_KEY: Joi.when('STORAGE_TYPE', { is: Joi.string().exist().pattern(/s3/), then: Joi.string().required(), otherwise: Joi.string().optional() }),
    AWS_REGION: Joi.when('STORAGE_TYPE', { is: Joi.string().exist().pattern(/s3/), then: Joi.string().required(), otherwise: Joi.string().optional() }),
    AWS_BUCKET: Joi.when('STORAGE_TYPE', { is: Joi.string().exist().pattern(/s3/), then: Joi.string().required(), otherwise: Joi.string().optional() }),
    STORAGE_TYPE: Joi.string().custom((val, helpers) => {
        const types = val.split(',').map(t => t.trim());
        const invalid = types.filter(t => !['s3', 'public'].includes(t));
        if (invalid.length) return helpers.error('any.invalid');
        return val;
    }).optional(),

    MAIL_MAILER: Joi.string().optional(),
    MAIL_HOST: Joi.string().optional(),
    MAIL_PORT: Joi.number().port().optional(),
    MAIL_USERNAME: Joi.string().optional(),
    MAIL_PASSWORD: Joi.string().optional(),
    MAIL_FROM_ADDRESS: Joi.string().email().optional(),
    MAIL_FROM_NAME: Joi.string().default('App'),
    MAIL_ENCRYPTION: Joi.string().valid('tls', 'ssl', 'none').default('tls'),

    OAUTH_PROVIDERS: Joi.string().optional(),
    GOOGLE_CLIENT_ID: Joi.when('OAUTH_PROVIDERS', { is: Joi.string().exist().pattern(/google/), then: Joi.string().required(), otherwise: Joi.string().optional() }),
    GOOGLE_CLIENT_SECRET: Joi.when('OAUTH_PROVIDERS', { is: Joi.string().exist().pattern(/google/), then: Joi.string().required(), otherwise: Joi.string().optional() }),
    GOOGLE_CALLBACK_URL: Joi.when('OAUTH_PROVIDERS', { is: Joi.string().exist().pattern(/google/), then: Joi.string().uri().required(), otherwise: Joi.string().uri().optional() }),
    FACEBOOK_APP_ID: Joi.when('OAUTH_PROVIDERS', { is: Joi.string().exist().pattern(/facebook/), then: Joi.string().required(), otherwise: Joi.string().optional() }),
    FACEBOOK_APP_SECRET: Joi.when('OAUTH_PROVIDERS', { is: Joi.string().exist().pattern(/facebook/), then: Joi.string().required(), otherwise: Joi.string().optional() }),
    FACEBOOK_CALLBACK_URL: Joi.when('OAUTH_PROVIDERS', { is: Joi.string().exist().pattern(/facebook/), then: Joi.string().uri().required(), otherwise: Joi.string().uri().optional() }),
}).unknown();

const { error, value } = envSchema.validate(process.env);

if (error) {
    console.error(`[Config] Validation error: ${error.message}`);
    module.exports = null;
} else {

module.exports = {
    PORT: value.PORT,
    NODE_ENV: value.NODE_ENV,
    BASE_URL: value.BASE_URL,
    STATIC_URL: (value.STATIC_URL || value.BASE_URL).replace(/\/$/, ''),
    FRONTEND_URL: value.FRONTEND_URL.replace(/\/$/, ''),
    ALLOWED_ORIGINS: value.ALLOWED_ORIGINS.split(',').map(o => o.trim()),

    // DataBase
    MONGODB_URI: value.MONGODB_URI,
    DATABASE_NAME: value.DATABASE_NAME,

    JWT_SECRET: value.JWT_SECRET,
    JWT_ALGORITHM: value.JWT_ALGORITHM,
    JWT_REFRESH_SECRET: value.JWT_REFRESH_SECRET || value.JWT_SECRET,
    SALT_ROUNDS: value.SALT_ROUNDS,
    ACCESS_TOKEN_EXPIRE: value.ACCESS_TOKEN_EXPIRE,
    REFRESH_TOKEN_EXPIRE: value.REFRESH_TOKEN_EXPIRE,
    RESET_TOKEN_EXPIRE: value.RESET_TOKEN_EXPIRE,
    ACCESS_TOKEN_AGE: value.ACCESS_TOKEN_AGE,
    RESET_TOKEN_AGE: value.RESET_TOKEN_AGE,

    AUTH_BASE: value.AUTH_BASE,

    // AWS
    AWS_ACCESS_KEY_ID: value.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: value.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: value.AWS_REGION,
    AWS_BUCKET: value.AWS_BUCKET,
    STORAGE_TYPE: value.STORAGE_TYPE ? value.STORAGE_TYPE.split(',').map(t => t.trim()) : [],

    // MAIL
    MAIL_MAILER: value.MAIL_MAILER,
    MAIL_HOST: value.MAIL_HOST,
    MAIL_PORT: value.MAIL_PORT,
    MAIL_USERNAME: value.MAIL_USERNAME,
    MAIL_PASSWORD: value.MAIL_PASSWORD,
    MAIL_FROM_ADDRESS: value.MAIL_FROM_ADDRESS,
    MAIL_FROM_NAME: value.MAIL_FROM_NAME,
    MAIL_ENCRYPTION: value.MAIL_ENCRYPTION,

    // OAUTH
    OAUTH_PROVIDERS: value.OAUTH_PROVIDERS ? value.OAUTH_PROVIDERS.split(',').map(p => p.trim()) : [],
    GOOGLE_CLIENT_ID: value.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: value.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: value.GOOGLE_CALLBACK_URL,
    FACEBOOK_APP_ID: value.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET: value.FACEBOOK_APP_SECRET,
    FACEBOOK_CALLBACK_URL: value.FACEBOOK_CALLBACK_URL,
};

}