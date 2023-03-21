export const config = {
  expressPort: Number(process.env.SERVER_PORT ?? 8080),
  redisHost: process.env.REDIS_HOST ?? 'localhost',
  redisPort: Number(process.env.REDIS_PORT ?? 6379) ?? 6379,
  redisUsername: process.env.REDIS_USERNAME,
  redisPassword: process.env.REDIS_PASSWORD
}
