import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.ObjectId,
            ref: "Category",
            required: true,
        },
        quantity: {
            type: Number,
         
        },
        photo: {
            data: Buffer,
            contentType: String,
        },
        shipping: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Products", productSchema);