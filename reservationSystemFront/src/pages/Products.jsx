import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductCards = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/products');
        
        // Check if response is a string and try to parse it
        let productsData = [];
        if (typeof res.data === 'string') {
          try {
            productsData = JSON.parse(res.data);
          } catch (parseError) {
            console.error('Failed to parse JSON string', parseError);
            throw new Error('Invalid products data format');
          }
        } else if (Array.isArray(res.data)) {
          productsData = res.data;
        } else if (res.data.products && Array.isArray(res.data.products)) {
          productsData = res.data.products;
        }

        if (!Array.isArray(productsData)) {
          throw new Error('Products data is not an array');
        }

        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!products.length) return <div className="text-center py-8">No products available</div>;

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Our Products</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Product Image */}
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={product.image ? `/uploads/${product.image}` : '/default.png'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.countInStock === 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    SOLD OUT
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Title and Rating */}
                <div className="mb-2">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">310</span>
                  </div>
                </div>

                {/* Product Features */}
                <div className="text-sm text-gray-600 mb-3">
                  <p>100% cotton - Light weight - Best finish</p>
                  <p>Unique design - {product.category || 'Unisex'} - Casual</p>
                </div>

                {/* Description Preview */}
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {product.description || "There are many variations of passages available..."}
                </p>

                {/* Price and Actions */}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-lg font-bold text-orange-500">${product.priceInPoints.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">${(product.priceInPoints * 1.5).toFixed(2)}</span>
                    </div>
                    <span className="text-xs text-green-600">Free shipping</span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <button className="text-gray-600 hover:text-orange-500 font-medium">
                      DETAILS
                    </button>
                    <button className="text-gray-600 hover:text-orange-500 font-medium">
                      ADD TO WISHLIST
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCards;