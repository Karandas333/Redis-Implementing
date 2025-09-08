const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ,
  },
  password: process.env.REDIS_PASSWORD ,
});



client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  await client.connect();
  console.log("HOST: ", process.env.REDIS_HOST);
  console.log("PORT: ", process.env.REDIS_PORT);
  console.log("PASSWORD: ", process.env.REDIS_PASSWORD);
  console.log("✅ Redis connected!");
})();

module.exports = client;
