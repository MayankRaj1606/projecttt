import CategoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const createCategoryController = async (req, res) => {

    try {

        const { name } = req.body;
        if (!name) {
            return res.status(401).send({ message: 'Name is Required' })

        }
        const existingCategory = await CategoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'Category Already Exists'
            })
        }
        const category = await new CategoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({
            success: true,
            message: 'New Category Created',
            category
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Category'
        })
    };
};


//Update Category Controller
export const updateCategoryController = async (req, res) => {
    try {

        const { name } = req.body
        const { id } = req.params
        const category = await CategoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        res.status(200).send({
            success: true,
            message: 'Category Updated Succesfully',
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while Updating Category'
        })
    }
};


// get all category

export const categoryController = async (req, res) => {

    try {

        const category = await CategoryModel.find({})
        res.status(200).send({
            success: true,
            message: false,
            message: 'All Categories List',
            category
        })

    } catch (error) {

        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting all categories'
        })

    }
};

//single category
export const singleCategoryController = async (req, res) => {


    try {

        const category = await CategoryModel.findOne({ slug: req.params.slug })
        res.status(200).send({
            success: true,
            message: 'Get Single Category Successfull',
            category
        })

    } catch (error) {

        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting single category'
        })

    }
};

//delete category
export const deleteCategoryController = async (req, res) => {
    try {

        const { id } = req.params
        await CategoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: 'Category deleted Succesfully'

        })

    } catch (error) {

        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while deleting  category'
        })

    }
}