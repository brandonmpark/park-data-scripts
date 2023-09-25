// eslint-disable-next-line import/prefer-default-export, import/no-mutable-exports
export let MONGODB_URI: string;
switch (process.env.NODE_ENV) {
    case "test":
        MONGODB_URI = Bun.env.TEST_MONGODB_URI ?? "";
        break;
    case "development":
        MONGODB_URI = Bun.env.DEVELOPMENT_MONGODB_URI ?? "";
        break;
    case "production":
        MONGODB_URI = Bun.env.PRODUCTION_MONGODB_URI ?? "";
        break;
    default:
        MONGODB_URI = Bun.env.TEST_MONGODB_URI ?? "";
}

