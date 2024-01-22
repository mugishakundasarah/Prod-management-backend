const router = require("express").Router();
const { productValidationSchema } = require("../utils/validation"); // Assuming validation schema is defined
const Product = require("../models/Product");

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const { error, value } = productValidationSchema.validate(data);

    if (error) {
      return res.json({ message: error.details[0].message, status: 400 });
    }

    // Assuming unique fields are handled in validation
    const newProduct = await Product.create(value);
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update an existing product
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { error, value } = productValidationSchema.validate(data);

    if (error) {
      return res.json({ message: error.details[0].message, status: 400 });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      await product.update(value);
      res.json({ message: "Product updated successfully", product });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      await product.destroy();
      res.json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get paginated products
router.get("/", async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const { count, rows: products } = await Product.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    const totalProducts = count;
    const totalPages = Math.ceil(totalProducts / pageSize);

    res.status(200).json({ products, totalProducts, totalPages });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
