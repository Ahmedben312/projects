import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../slices/cartSlice";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    let query = `/api/products?search=${search}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    axios.get(query).then((res) => setProducts(res.data));
  }, [search, category, minPrice, maxPrice]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Product Catalog</h1>
        {/* Filters */}
        <div className="bg-white p-4 rounded shadow mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/4 p-2 border rounded mr-2"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded mr-2"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="p-2 border rounded mr-2 w-20"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="p-2 border rounded w-20"
          />
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded shadow p-4">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-2"
                />
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-2xl font-bold text-green-600">
                  ${product.price}
                </p>
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full mt-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
