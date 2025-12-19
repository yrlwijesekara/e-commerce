import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + '/api/contacts',
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    subject: formData.subject.trim(),
                    message: formData.message.trim()
                }
            );
            
            toast.success(response.data.message || 'Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error sending contact message:', error);
            const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[color-mix(in_srgb,var(--color-secondary)_30%,white)] py-10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">Contact Us</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        We'd love to hear from you! Get in touch with us for any questions, 
                        feedback, or inquiries about our beauty products.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                                    placeholder="What's this about?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows={6}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                                    placeholder="Tell us how we can help you..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        {/* Contact Details */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] p-3 rounded-full">
                                        <FaMapMarkerAlt className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-lg">Address</h3>
                                        <p className="text-gray-600">123 Beauty Street<br />City, State 12345<br />United States</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] p-3 rounded-full">
                                        <FaPhone className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-lg">Phone</h3>
                                        <p className="text-gray-600">(555) 123-4567</p>
                                        <p className="text-gray-600">Mon - Fri: 9AM - 8PM</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] p-3 rounded-full">
                                        <FaEnvelope className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-lg">Email</h3>
                                        <p className="text-gray-600">hello@beautystore.com</p>
                                        <p className="text-gray-600">support@beautystore.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] p-3 rounded-full">
                                        <FaClock className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-lg">Business Hours</h3>
                                        <p className="text-gray-600">Monday - Friday: 9AM - 8PM<br />Saturday: 10AM - 6PM<br />Sunday: 12PM - 5PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Follow Us</h2>
                            <p className="text-gray-600 mb-6">Stay connected with us on social media for the latest updates and beauty tips!</p>
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="w-12 h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
                                >
                                    <FaFacebook className="text-xl" />
                                </a>
                                <a
                                    href="#"
                                    className="w-12 h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
                                >
                                    <FaInstagram className="text-xl" />
                                </a>
                                <a
                                    href="#"
                                    className="w-12 h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
                                >
                                    <FaTwitter className="text-xl" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Help */}
                        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl shadow-2xl p-8 text-white">
                            <h2 className="text-3xl font-bold mb-4">Need Quick Help?</h2>
                            <p className="mb-6">Check out our frequently asked questions or reach out to our customer support team.</p>
                            <div className="space-y-3">
                                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 py-3 px-6 rounded-lg transition duration-300 text-left">
                                    📞 Call Customer Support
                                </button>
                                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 py-3 px-6 rounded-lg transition duration-300 text-left">
                                    💬 Live Chat (Coming Soon)
                                </button>
                                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 py-3 px-6 rounded-lg transition duration-300 text-left">
                                    ❓ View FAQs
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}   