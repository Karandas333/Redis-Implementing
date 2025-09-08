const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  await client.connect();
  console.log("✅ Redis connected!");
})();

module.exports = client;

