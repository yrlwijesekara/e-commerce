import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEnvelope, FaTrash, FaEye, FaReply } from 'react-icons/fa';

export default function ContactManagement() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [filter, setFilter] = useState('all'); // all, unread, read, replied

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                import.meta.env.VITE_BACKEND_URL + '/api/contacts',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setContacts(response.data.contacts);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            toast.error('Failed to load contact messages');
        } finally {
            setLoading(false);
        }
    };

    const updateContactStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/contacts/${id}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            setContacts(contacts.map(contact => 
                contact._id === id ? { ...contact, status } : contact
            ));
            
            toast.success(`Contact marked as ${status}`);
        } catch (error) {
            console.error('Error updating contact status:', error);
            toast.error('Failed to update contact status');
        }
    };

    const deleteContact = async (id) => {
        if (!confirm('Are you sure you want to delete this contact message?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/contacts/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            setContacts(contacts.filter(contact => contact._id !== id));
            toast.success('Contact message deleted successfully');
            
            if (selectedContact?._id === id) {
                setSelectedContact(null);
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            toast.error('Failed to delete contact message');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'unread': return 'bg-red-100 text-red-800';
            case 'read': return 'bg-yellow-100 text-yellow-800';
            case 'replied': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredContacts = contacts.filter(contact => {
        if (filter === 'all') return true;
        return contact.status === filter;
    });

    const getStatusCounts = () => {
        return {
            all: contacts.length,
            unread: contacts.filter(c => c.status === 'unread').length,
            read: contacts.filter(c => c.status === 'read').length,
            replied: contacts.filter(c => c.status === 'replied').length
        };
    };

    const statusCounts = getStatusCounts();

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xl font-semibold text-gray-700">Loading contact messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[var(--color-secondary)] to-[color-mix(in_srgb,var(--color-secondary)_50%,white)] p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Contact Messages</h1>
                    <button
                        onClick={fetchContacts}
                        className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-4 py-2 rounded-lg hover:shadow-lg transition duration-300"
                    >
                        Refresh
                    </button>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 shadow-lg">
                    {[
                        { key: 'all', label: 'All', count: statusCounts.all },
                        { key: 'unread', label: 'Unread', count: statusCounts.unread },
                        { key: 'read', label: 'Read', count: statusCounts.read },
                        { key: 'replied', label: 'Replied', count: statusCounts.replied }
                    ].map(({ key, label, count }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-300 ${
                                filter === key
                                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {label} ({count})
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Contact List */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white">
                            <h2 className="text-xl font-semibold">Messages ({filteredContacts.length})</h2>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {filteredContacts.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    <FaEnvelope className="mx-auto text-4xl mb-2 opacity-50" />
                                    <p>No messages found</p>
                                </div>
                            ) : (
                                filteredContacts.map((contact) => (
                                    <div
                                        key={contact._id}
                                        onClick={() => {
                                            setSelectedContact(contact);
                                            if (contact.status === 'unread') {
                                                updateContactStatus(contact._id, 'read');
                                            }
                                        }}
                                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition duration-300 ${
                                            selectedContact?._id === contact._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-gray-800 truncate">{contact.name}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                                                {contact.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {contact.subject || 'No subject'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {new Date(contact.createdAt).toLocaleDateString()} at {' '}
                                            {new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="lg:col-span-2">
                        {selectedContact ? (
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="p-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-2xl font-semibold">{selectedContact.name}</h2>
                                            <p className="opacity-90">{selectedContact.email}</p>
                                            <p className="text-sm opacity-75 mt-1">
                                                {new Date(selectedContact.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedContact.status)} bg-white`}>
                                            {selectedContact.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Subject</h3>
                                        <p className="text-gray-600">{selectedContact.subject || 'No subject provided'}</p>
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Message</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => updateContactStatus(selectedContact._id, 'replied')}
                                            disabled={selectedContact.status === 'replied'}
                                            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaReply />
                                            <span>Mark as Replied</span>
                                        </button>

                                        <button
                                            onClick={() => updateContactStatus(selectedContact._id, selectedContact.status === 'read' ? 'unread' : 'read')}
                                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                        >
                                            <FaEye />
                                            <span>{selectedContact.status === 'read' ? 'Mark Unread' : 'Mark Read'}</span>
                                        </button>

                                        <button
                                            onClick={() => deleteContact(selectedContact._id)}
                                            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                                        >
                                            <FaTrash />
                                            <span>Delete</span>
                                        </button>

                                        <button
                                            onClick={() => window.open(`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Your message'}`)}
                                            className="flex items-center space-x-2 bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg hover:shadow-lg transition duration-300"
                                        >
                                            <FaEnvelope />
                                            <span>Reply via Email</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg flex items-center justify-center h-96">
                                <div className="text-center text-gray-500">
                                    <FaEnvelope className="mx-auto text-6xl mb-4 opacity-50" />
                                    <p className="text-xl">Select a message to view details</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}