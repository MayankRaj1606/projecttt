import slugify from "slugify"
import productModel from "../models/productModels.js"
import userModel from "../models/userModel.js";
import fs from 'fs'

export const createProductController = async (req, res) => {


    try {

        const { name, slug, description, email, category, quantity, shipping } = req.fields
        const { photo } = req.files

        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is Required' })
            case !description:
                return res.status(500).send({ error: 'Description is Required' })
            case !email:
                return res.status(500).send({ error: 'Price is Required' })
            case !category:
                return res.status(500).send({ error: 'category is Required' })
            // case !photo || photo.size > 2000000:
            //     return res.status(500).send({ error: 'Photo is Required and should be less than 2mb' })
            case !quantity:
                return res.status(500).send({ error: 'Quantity is Required' })
            case !shipping:
                return res.status(500).send({ error: 'Shipping is Required' })
        }

        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save()
        res.status(201).send({
            success: true,
            message: 'Product Created Successfully',
            products,
        })

    } catch (error) {

        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in creating Product'
        })

    }
}




//get all product
export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            messsage: "Products",
            count: products.length,
            products,
        })
    } catch (error) {

        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Finding Products',
        })
    }
};





// Fetching Single Product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate('category')
        res.status(200).send({
            success: true,
            messsage: "Single Product Fetched",
            product
        })

    } catch (error) {

        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Finding Products',
        })
    }
};

//Get Photo
export const productPhotoController = async (req, res) => {
    try {
      const product = await productModel.findById(req.params.pid).select("photo");
      if (product.photo.data) {
        res.set("Content-type", product.photo.contentType);
        return res.status(200).send(product.photo.data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Erorr while getting photo",
        error,
      });
    }
  };

//delete controller
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Product Deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error,
        });
    }
};



//update Controller

export const updateProductController = async (req, res) => {
    try {
        const { name, description, email, category, quantity, shipping } =
            req.fields;
        const { photo } = req.files;
        //alidation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !email:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 2000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Updte product",
        });
    }
};


//Update Name Controller

export const updateNameProductController = async (req, res) => {
    try {
        const { name } = req.body; // Extract only the name field

        if (!name) {
            return res.status(400).send({ error: "Name is required" });
        }

        const product = await productModel.findByIdAndUpdate(
            req.params.pid,
            { name },
            { new: true }
        );

        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        res.status(200).send({
            success: true,
            message: "Product name updated successfully",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while updating product name",
            error,
        });
    }
};

//update (user)

export const updateuserProductController = async (req, res) => {
    try {
        const { name, description, email, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // Validation
        if (!name) return res.status(400).send({ error: "Name is required" });
        if (!description) return res.status(400).send({ error: "Description is required" });
        if (!email) return res.status(400).send({ error: "Email is required" });
        // if (!category) return res.status(400).send({ error: "Category is required" });
        // if (!quantity) return res.status(400).send({ error: "Quantity is required" });
        if (photo && photo.size > 2000000) {
            return res.status(400).send({ error: "Photo should be less than 2MB" });
        }

        // Find and update the product by ID
        const product = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields },
            { new: true }
        );

        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        // Handle photo update
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
            await product.save();
        }

        res.status(200).send({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error while updating product",
            error,
        });
    }
}; 




//filters
export const productFiltersController = async (req, res) => {
    try {
      const { checked, radio } = req.body;
      let args = {};
      if (checked.length > 0) args.category = checked;
      if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
      const products = await productModel.find(args);
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Filtering Products",
        error,
      });
    }
  };

  // product count
export const productCountController = async (req, res) => {
    try {
      const total = await productModel.find({}).estimatedDocumentCount();
      res.status(200).send({
        success: true,
        total,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Error in product count",
        error,
        success: false,
      });
    }
  };
  
  // product list base on page
  export const productListController = async (req, res) => {
    try {
      const perPage = 2;
      const page = req.params.page ? req.params.page : 1;
      const products = await productModel
        .find({})
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "error in per page ctrl",
        error,
      });
    }
  };


  export const getAllUsersController = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await userModel.find({}).sort({ createdAt: -1 });

        // Send response with users' data
        res.status(200).send({
            success: true,
            message: "Users fetched successfully",
            count: users.length,
            users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in fetching users",
        });
    }
};