import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth"; // Import auth context
import UserMenu from "../../components/Layout/UserMenu";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [auth, setAuth] = useAuth(); // Get user info from context
  const userEmail = auth?.user?.email; // Get the logged-in user's email

  // Get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`);
      
      // Filter products based on the user's email
      const filteredProducts = data.products.filter(p => p.email === userEmail);
      setProducts(filteredProducts); // Set filtered products
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  // Delete product function
  const handleDelete = async (productId) => {
    try {
      let answer = window.prompt("Are you sure you want to delete this product? TYPE YES");
      if (answer !== "YES") {
        toast.error("Type Correctly");
        return;}
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/product/delete-product/${productId}`
      );
      if (data?.success) {
        toast.success("Product Deleted Successfully");
        // Refresh the product list after deletion
        getAllProducts();
      } else {
        toast.error(data?.message || "Failed to delete product");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    if (userEmail) {
      getAllProducts();
    }
  }, [userEmail]); // Re-run effect when user email changes

  return (
    <Layout>
      <div className="row">
        <div className="col-md-3">
          <UserMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">Your Complaints List</h1>
          <div className="d-flex flex-wrap">
            {products?.length > 0 ? (
              products.map((p) => (
                <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description}</p>
                    <h4 className="card-text text-dark">{p.shipping}</h4>
                    <button
                      className="btn btn-danger mt-2"
                      onClick={() => handleDelete(p._id)}
                    >
                      DELETE COMPLAINT
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No Complaints found for your account.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products; 