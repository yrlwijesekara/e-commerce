import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import loginBg from '/loginbg.jpg';
import Footer from '../components/footer';


export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [latestProducts, setLatestProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Carousel images (you can replace these with actual product images or promotional banners)
  const carouselImages = [
    '/loginbg.jpg',
    '/loginbg.jpg',
    '/loginbg.jpg',
    '/loginbg.jpg'
  ];

  const carouselTexts = [
    { title: "Premium Cosmetics", subtitle: "Discover our latest collection of beauty products" },
    { title: "Skincare Essentials", subtitle: "Nourish your skin with our premium skincare range" },
    { title: "Makeup Magic", subtitle: "Transform your look with our professional makeup line" },
    { title: "Beauty Accessories", subtitle: "Complete your beauty routine with our tools & accessories" }
  ];

  useEffect(() => {
    fetchLatestProducts();
    fetchReviews();
    
    // Auto-slide carousel
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  const fetchLatestProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      const apiUrl = import.meta.env.VITE_BACKEND_URL + '/api/products/latest';
      console.log('Fetching latest products from:', apiUrl);
      console.log('Backend URL env var:', import.meta.env.VITE_BACKEND_URL);
      
      const response = await axios.get(apiUrl);
      console.log('Latest products response status:', response.status);
      console.log('Latest products response data:', response.data);
      
      if (response.data && response.data.products) {
        setLatestProducts(response.data.products);
        console.log('Set latest products:', response.data.products.length, 'products');
      } else {
        setLatestProducts([]);
        console.log('No products in response data');
      }
      setProductsLoading(false);
    } catch (error) {
      console.error('Error fetching latest products:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to load latest products';
      if (error.response?.status === 500) {
        errorMessage = 'Server error - please try again later';
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server - please check if backend is running';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setProductsError(errorMessage);
      setLatestProducts([]);
      setProductsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/reviews');
      setReviews(response.data.reviews.slice(0, 6)); // Get first 6 reviews
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-xl ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">
      {/* Hero Carousel Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-opacity-50"></div>
        
        {/* Carousel Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full max-w-6xl mx-auto">
            {/* Carousel Image */}
            <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
              <img
                src={carouselImages[currentSlide]}
                alt={`Slide ${currentSlide + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0  to-[color-mix(in_srgb,var(--color-accent)_70%,transparent)]"></div>
              
              {/* Carousel Text */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-8">
                <h1 className="text-6xl font-bold mb-4 animate-fade-in">
                  {carouselTexts[currentSlide].title}
                </h1>
                <p className="text-xl mb-8 max-w-2xl">
                  {carouselTexts[currentSlide].subtitle}
                </p>
                <Link to="/products" className="bg-white text-[var(--color-primary)] px-8 py-3 rounded-full font-semibold text-lg hover:bg-opacity-90 transition duration-300">
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition duration-300"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition duration-300"
            >
              ›
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition duration-300 ${
                    currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="relative py-16 bg-white bg-opacity-95">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest Products</h2>
            <p className="text-gray-600 text-lg">Discover our newest additions to our beauty collection</p>
          </div>

          {productsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg mb-4">{productsError}</p>
              <button 
                onClick={fetchLatestProducts}
                className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-6 py-3 rounded-lg hover:shadow-lg transition duration-300"
              >
                Try Again
              </button>
            </div>
          ) : latestProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">No products available at the moment</p>
              <Link 
                to="/products"
                className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-6 py-3 rounded-lg hover:shadow-lg transition duration-300"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
                <div className="h-64 bg-gradient-to-br from-[var(--color-secondary)] to-[color-mix(in_srgb,var(--color-secondary)_50%,white)] flex items-center justify-center">
                  {product.image && product.image[0] ? (
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">No Image Available</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-[var(--color-primary)]">${product.price}</span>
                      {product.labelledprice > product.price && (
                        <span className="text-sm text-gray-500 line-through">${product.labelledprice}</span>
                      )}
                    </div>
                    <Link
                      to={`/product-overview/${product.productId}`}
                      className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-4 py-2 rounded-lg hover:shadow-lg transition duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {!productsLoading && !productsError && latestProducts.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-8 py-3 rounded-full font-semibold text-lg hover:shadow-lg transition duration-300"
            >
              View All Products
            </Link>
          </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="relative py-16 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-secondary)_30%,white)] to-[color-mix(in_srgb,var(--color-accent)_20%,white)] bg-opacity-95">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 text-lg">Read genuine reviews from our satisfied customers</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-800">{review.name}</h4>
                        <div className="flex">{renderStars(review.rating || 5)}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{review.message}"</p>
                    <div className="mt-4 text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  to="/review"
                  className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-8 py-3 rounded-full font-semibold text-lg hover:shadow-lg transition duration-300"
                >
                  Write a Review
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-16 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-opacity-95">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Beauty Routine?</h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Join thousands of satisfied customers who have discovered the perfect products for their beauty needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-[var(--color-primary)] px-8 py-3 rounded-full font-semibold text-lg hover:bg-opacity-90 transition duration-300"
            >
              Shop All Products
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-[var(--color-primary)] transition duration-300"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
