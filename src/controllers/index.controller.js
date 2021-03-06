const indexCtrl = {};

// Model
const Product = require('../models/Product');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const fs = require('fs-extra');

// Controllers
indexCtrl.renderNewProductForm = (req, res) => {
    res.render('admin/products/add');
};

indexCtrl.saveNewProduct = async (req, res) => {
    try {
        // Receive Frontend Data
        const { name, price, description } = req.body;
        // Uploaded Image Information
        const imagePath = req.file.path;
        // Uploaded Image Information from Cloudinary
        const result = await cloudinary.v2.uploader.upload(imagePath);
        // Creating a new Product Document for Mongodb
        const newProduct = new Product({ name, price, description, imagePath: result.url });
        // Saving the newProduct to the database
        await newProduct.save();
        // Deleting the Image from our Server
        await fs.unlink(imagePath);
        // Send Response to the Client
        res.redirect('/');
    }
    catch (e) {
        console.log(e)
    }
};

indexCtrl.renderProducts = async (req, res) => {
    const products = await Product.find();
    res.render('admin/products/list', { products });
};

indexCtrl.deleteProduct = async (req, res) => {
    const { productId } = req.params;
    console.log(productId)
    await Product.findByIdAndDelete(productId);
    res.redirect('/admin/products');
};

module.exports = indexCtrl;