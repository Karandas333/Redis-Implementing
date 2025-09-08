const express = require("express");
const compression = require("compression");
const client = require("./client"); // Redis client
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const PAGE_LIMIT = 25;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(compression());

// Helper: batch fetch products via Redis multi
// Helper: batch fetch products via Redis multi
async function getProductsByIds(ids) {
  if (!ids || ids.length === 0) return [];

  const multi = client.multi(); // Redis v4 multi
  ids.forEach((id) => multi.hGetAll(`product:${id}`));

  const results = await multi.exec(); // returns array of objects [{field: value}, ...]
  return results; // direct return, no [err, value] destructure
}


app.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || PAGE_LIMIT;
    const offset = (page - 1) * limit;

    // Sorted set से IDs निकालना
    const productIds = await client.zRange(
    "product_ids_sorted_set",
    offset,
    offset + limit - 1
    );

    // Batch fetch with multi
    const products = await getProductsByIds(productIds);

    // JSON / EJS render
    if (req.query.json === "true") {
    return res.json(products);
    }

    res.render("index", { products, page, limit });

  } catch (err) {
    console.error("Error in / route:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("👉 Use PM2 for multi-core: pm2 start server.js -i max");
});
