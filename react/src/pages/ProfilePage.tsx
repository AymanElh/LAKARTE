import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Upload, 
  Download,
  Eye,
  Filter
} from 'lucide-react';

import { authService, User as UserType } from '../services/authService';
import { orderService, Order } from '../services/orderService';

const ProfilePage: React.FC = () => {
  // const { t } = useTranslation(); // TODO: Add translations
  const navigate = useNavigate();
  
  const [user, setUser] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'profile' | 'orders'>('profile');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [uploadingPayment, setUploadingPayment] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const filterStatus = statusFilter === 'all' ? undefined : statusFilter;
      const response = await orderService.getUserOrders(filterStatus);
      
      if (response.success) {
        setOrders(response.data);
      } else {
        setError(response.message || 'Failed to load orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (selectedTab === 'orders') {
      fetchOrders();
    }
  }, [selectedTab, fetchOrders]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await authService.getUser();
      setUser(userData);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentProofUpload = async (orderId: number, file: File) => {
    try {
      setUploadingPayment(orderId);
      const response = await orderService.uploadPaymentProof(orderId, file);
      
      if (response.success) {
        // Refresh orders to show updated status
        fetchOrders();
        alert('Payment proof uploaded successfully!');
      } else {
        alert(response.message || 'Failed to upload payment proof');
      }
    } catch (err) {
      console.error('Error uploading payment proof:', err);
      alert('Failed to upload payment proof');
    } finally {
      setUploadingPayment(null);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <Package className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-xl text-gray-600">Manage your account and orders</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="w-4 h-4 inline-block mr-2" />
                Profile Information
              </button>
              <button
                onClick={() => setSelectedTab('orders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="w-4 h-4 inline-block mr-2" />
                My Orders
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {selectedTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
              
              {user && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <p className="text-lg text-gray-900">{user.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <p className="text-lg text-gray-900">{user.email}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member Since
                      </label>
                      <p className="text-lg text-gray-900">{formatDate(user.created_at)}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Verified
                      </label>
                      <p className="text-lg text-gray-900">
                        {user.email_verified_at ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {selectedTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Orders</h2>
                
                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {ordersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                  <button
                    onClick={() => navigate('/packs')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Browse Packs
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Placed on {formatDate(order.created_at)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${orderService.getStatusColor(order.status)}`}>
                            {orderService.getStatusLabel(order.status)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Pack</p>
                          <p className="text-sm text-gray-900">{order.pack?.name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Template</p>
                          <p className="text-sm text-gray-900">{order.template?.name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Quantity</p>
                          <p className="text-sm text-gray-900">{order.quantity}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Total Price</p>
                          <p className="text-sm text-gray-900">
                            {order.pack ? (order.pack.price * order.quantity).toFixed(2) : '0'} MAD
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Color</p>
                          <p className="text-sm text-gray-900 capitalize">{order.color}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Orientation</p>
                          <p className="text-sm text-gray-900 capitalize">{order.orientation}</p>
                        </div>
                      </div>

                      {/* Payment Upload for Pending Orders */}
                      {order.status === 'pending' && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-sm text-yellow-800 mb-3">
                            <strong>Payment Required:</strong> Please upload your payment proof to proceed with your order.
                          </p>
                          
                          <input
                            type="file"
                            id={`payment-${order.id}`}
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handlePaymentProofUpload(order.id, file);
                              }
                            }}
                          />
                          
                          <button
                            onClick={() => document.getElementById(`payment-${order.id}`)?.click()}
                            disabled={uploadingPayment === order.id}
                            className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
                          >
                            <Upload className="w-4 h-4" />
                            <span>
                              {uploadingPayment === order.id ? 'Uploading...' : 'Upload Payment Proof'}
                            </span>
                          </button>
                        </div>
                      )}

                      {/* Files Section */}
                      {(order.logo_path || order.brief_path || order.payment_proof_path) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Files:</p>
                          <div className="flex flex-wrap gap-2">
                            {order.logo_path && (
                              <a
                                href={`http://localhost:8080/storage/${order.logo_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                              >
                                <Eye className="w-4 h-4" />
                                <span>Logo</span>
                              </a>
                            )}
                            {order.brief_path && (
                              <a
                                href={`http://localhost:8080/storage/${order.brief_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                              >
                                <Download className="w-4 h-4" />
                                <span>Brief</span>
                              </a>
                            )}
                            {order.payment_proof_path && (
                              <a
                                href={`http://localhost:8080/storage/${order.payment_proof_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-800"
                              >
                                <Eye className="w-4 h-4" />
                                <span>Payment Proof</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
