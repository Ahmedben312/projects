import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [review, setReview] = useState({ rating: 1, comment: "" });
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    axios.get(`/api/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to submit a review");
      return;
    }
    try {
      await axios.post("/api/reviews", { ...review, product: id });
      setReview({ rating: 1, comment: "" });
      // Refresh product
      const updated = await axios.get(`/api/products/${id}`);
      setProduct(updated.data);
    } catch (err) {
      alert("Failed to submit review");
    }
  };

  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded shadow">
        <div className="grid md:grid-cols-2 gap-4 p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <p className="text-4xl font-bold text-green-600 mt-4">
              ${product.price}
            </p>
            <button
              onClick={() =>
                dispatch(addToCart({ productId: id, quantity: 1 }))
              }
              className="w-full mt-4 bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div className="p-4 border-t">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {product.reviews?.map((r) => (
            <div key={r._id} className="border-b pb-2 mb-2">
              <p className="font-semibold">
                {r.user?.name || "Anonymous"}: {r.rating}/5
              </p>
              <p>{r.comment}</p>
            </div>
          ))}
          {user && (
            <form onSubmit={handleReviewSubmit} className="mt-4">
              <select
                value={review.rating}
                onChange={(e) =>
                  setReview({ ...review, rating: parseInt(e.target.value) })
                }
                className="p-2 border rounded mr-2"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <textarea
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
                placeholder="Your review..."
                className="w-full p-2 border rounded mt-2"
                required
              />
              <button
                type="submit"
                className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
