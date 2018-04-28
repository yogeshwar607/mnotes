process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'development') {
    process.env.PORT = 4700;
    process.env.LOGGER_LEVEL = 'debug';
    process.env.DB = 'masspay-v2-staging';
    process.env.DB_URI = 'localhost';
    process.env.JWT_SECRET = 'masspay-v2-backend';
} 
else if (process.env.NODE_ENV === 'staging') {
    process.env.PORT = 4700;
    process.env.LOGGER_LEVEL = 'info';
    process.env.DB = 'masspay-v2-staging';
    process.env.DB_URI = 'localhost';
    process.env.JWT_SECRET = 'masspay-v2-backend';
}

else if (process.env.NODE_ENV === 'production') {
    process.env.PORT = 4700;
    process.env.LOGGER_LEVEL = 'debug';
    process.env.DB = 'masspay-v2-production';
    process.env.DB_URI = 'localhost';
    process.env.JWT_SECRET = 'masspay-v2-backend';
}