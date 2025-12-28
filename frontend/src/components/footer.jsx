import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold mb-4">Beauty Store</h3>
                        <p className="text-gray-100 leading-relaxed">
                            Your ultimate destination for premium cosmetics, skincare, and beauty accessories. 
                            Transform your beauty routine with our carefully curated collection.
                        </p>
                       
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-100 hover:text-white hover:underline transition duration-300">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-100 hover:text-white hover:underline transition duration-300">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/review" className="text-gray-100 hover:text-white hover:underline transition duration-300">
                                    Write Review
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-100 hover:text-white hover:underline transition duration-300">
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-gray-100 hover:text-white hover:underline transition duration-300">
                                    Create Account
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold mb-4">Categories</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-100 hover:text-white hover:underline transition duration-300">
                                    Skincare
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-100 hover:text-white hover:underline transition duration-300">
                                    Makeup
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-100 hover:text-white hover:underline transition duration-300">
                                    Fragrances
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-100 hover:text-white hover:underline transition duration-300">
                                    Hair Care
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-100 hover:text-white hover:underline transition duration-300">
                                    Beauty Tools
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <FaMapMarkerAlt className="text-lg" />
                                <span className="text-gray-100">123 Beauty Street,Homagama,Sri Lnaka</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaPhone className="text-lg" />
                                <span className="text-gray-100">+94 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaEnvelope className="text-lg" />
                                <span className="text-gray-100">hello@beautystore.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaClock className="text-lg" />
                                <span className="text-gray-100">Mon - Fri: 9AM - 8PM</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-white border-opacity-20 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-100 text-sm">
                            &copy; 2025 Beauty Store. All rights reserved.
                        </div>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/privacy" className="text-gray-100 hover:text-white text-sm hover:underline transition duration-300">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-gray-100 hover:text-white text-sm hover:underline transition duration-300">
                                Terms of Service
                            </Link>
                            <Link to="/contact" className="text-gray-100 hover:text-white text-sm hover:underline transition duration-300">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}