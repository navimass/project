import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, CheckCircle, AlertCircle, Package, X, DollarSign, Users, Package2 } from 'lucide-react';
import Header from '../../components/Layout/Header';
import { MenuItem, Order } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());
  const [savingMenuItem, setSavingMenuItem] = useState(false);
  const [deletingMenuItem, setDeletingMenuItem] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    serves: '',
    canteen_name: '',
    quantity_available: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (editingItem) {
      setEditForm({
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price.toString(),
        image_url: editingItem.image_url,
        category: editingItem.category,
        serves: editingItem.serves.toString(),
        canteen_name: editingItem.canteen_name,
        quantity_available: editingItem.quantity_available.toString()
      });
    } else {
      setEditForm({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category: 'main_course',
        serves: '1',
        canteen_name: user?.full_name || '',
        quantity_available: '0'
      });
    }
  }, [editingItem, user]);

  const fetchOrders = async () => {
    try {
      if (!user?.full_name) {
        setLoading(false);
        return;
      }

      const { data: allOrders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (!allOrders || allOrders.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const userIds = [...new Set(allOrders.map(order => order.user_id))];
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .in('id', userIds);

      if (usersError) throw usersError;

      const orderIds = allOrders.map(order => order.id);
      const { data: orderItems, error: orderItemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          menu_item:menu_items(*)
        `)
        .in('order_id', orderIds);

      if (orderItemsError) throw orderItemsError;

      const userMap = new Map();
      users?.forEach(user => {
        userMap.set(user.id, user);
      });

      const relevantOrders = allOrders.filter(order => {
        const orderItemsForOrder = orderItems?.filter(item => item.order_id === order.id) || [];
        return orderItemsForOrder.some(item => 
          item.menu_item?.canteen_name === user.full_name
        );
      });

      const finalOrders = relevantOrders.map(order => {
        const userData = userMap.get(order.user_id);
        const canteenOrderItems = orderItems?.filter(item => 
          item.order_id === order.id && 
          item.menu_item?.canteen_name === user.full_name
        ) || [];

        const canteenTotal = canteenOrderItems.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );

        return {
          ...order,
          user: userData || null,
          order_items: canteenOrderItems,
          total_amount: canteenTotal
        };
      });

      setOrders(finalOrders);
    } catch (error) {
      console.error('Error in fetchOrders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      if (!user?.full_name) return;

      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('canteen_name', user.full_name)
        .order('name');

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const updateKey = `${orderId}-${status}`;
    
    if (updatingOrders.has(updateKey)) return;

    setUpdatingOrders(prev => new Set(prev).add(updateKey));
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(updateKey);
        return newSet;
      });
    }
  };

  const handleSaveMenuItem = async () => {
    if (savingMenuItem) return;

    if (!editForm.name.trim() || !editForm.description.trim()) return;

    const price = parseFloat(editForm.price);
    const serves = parseInt(editForm.serves);
    const quantityAvailable = parseInt(editForm.quantity_available);

    if (isNaN(price) || price <= 0 || isNaN(serves) || serves <= 0 || isNaN(quantityAvailable) || quantityAvailable < 0) return;

    setSavingMenuItem(true);

    try {
      const defaultImageUrl = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg';
      const imageUrl = editForm.image_url.trim() || defaultImageUrl;

      const menuItemData = {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        price: price,
        image_url: imageUrl,
        category: editForm.category || 'main_course',
        serves: serves,
        canteen_name: user?.full_name || '',
        quantity_available: quantityAvailable
      };

      let result;
      if (editingItem) {
        result = await supabase
          .from('menu_items')
          .update(menuItemData)
          .eq('id', editingItem.id)
          .select();
      } else {
        result = await supabase
          .from('menu_items')
          .insert([menuItemData])
          .select();
      }

      if (result.error) throw new Error(result.error.message);

      await fetchMenuItems();
      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
    } finally {
      setSavingMenuItem(false);
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (deletingMenuItem === itemId) return;
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    setDeletingMenuItem(itemId);

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    } finally {
      setDeletingMenuItem(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'ready': return 'status-ready';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const isOrderUpdating = (orderId: string, status: string) => {
    const updateKey = `${orderId}-${status}`;
    return updatingOrders.has(updateKey);
  };

  const formatStudentInfo = (orderUser: any) => {
    if (!orderUser) return 'Unknown Student';
    
    const name = orderUser.full_name || 'Unknown Name';
    const regNumber = orderUser.registration_number;
    
    return regNumber ? `${name} (${regNumber})` : name;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title={`${user?.full_name || 'Staff'} Dashboard`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors font-heading ${
                activeTab === 'orders'
                  ? 'border-violet-400 text-violet-300'
                  : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/30'
              }`}
            >
              Orders Management
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors font-heading ${
                activeTab === 'menu'
                  ? 'border-violet-400 text-violet-300'
                  : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/30'
              }`}
            >
              Menu Management
            </button>
          </nav>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white font-heading">Orders for {user?.full_name}</h2>
              <div className="flex space-x-4">
                <div className="glass px-4 py-2 rounded-lg">
                  <span className="text-sm text-white/70 font-body">Total Orders: </span>
                  <span className="font-semibold text-white font-heading">{orders.length}</span>
                </div>
                <div className="glass px-4 py-2 rounded-lg">
                  <span className="text-sm text-white/70 font-body">Pending: </span>
                  <span className="font-semibold text-yellow-400 font-heading">
                    {orders.filter(o => o.status === 'pending').length}
                  </span>
                </div>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4 glow-soft">
                  <Clock className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2 font-heading">No orders yet</h3>
                <p className="text-white/60 font-body">Orders for {user?.full_name} will appear here when students place them</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="glass-card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white font-heading">
                          Order #{order.id.slice(0, 8)}
                        </h4>
                        <p className="text-sm text-white/70 font-medium font-body">
                          {formatStudentInfo(order.user)}
                        </p>
                        <p className="text-sm text-white/60 font-body">
                          {new Date(order.created_at).toLocaleDateString()} at{' '}
                          {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white font-heading">₹{order.total_amount}</p>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize font-body">{order.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-medium text-white mb-2 font-heading">Items from {user?.full_name}:</h5>
                      <div className="space-y-2">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center glass p-2 rounded">
                            <span className="text-white/80 font-body">
                              {item.menu_item.name} x {item.quantity}
                            </span>
                            <span className="font-medium text-white font-heading">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'processing')}
                        disabled={order.status !== 'pending' || isOrderUpdating(order.id, 'processing')}
                        className="px-4 py-2 btn-primary-glass text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {isOrderUpdating(order.id, 'processing') ? 'Updating...' : 'Start Processing'}
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        disabled={order.status !== 'processing' || isOrderUpdating(order.id, 'ready')}
                        className="px-4 py-2 btn-secondary-glass text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {isOrderUpdating(order.id, 'ready') ? 'Updating...' : 'Mark Ready'}
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        disabled={order.status !== 'ready' || isOrderUpdating(order.id, 'completed')}
                        className="px-4 py-2 glass-button text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {isOrderUpdating(order.id, 'completed') ? 'Updating...' : 'Complete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white font-heading">Menu Items for {user?.full_name}</h2>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsEditModalOpen(true);
                }}
                className="flex items-center space-x-2 btn-primary-glass px-4 py-2 rounded-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="glass-menu-item overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-white font-heading">{item.name}</h3>
                      <span className="text-xl font-bold text-violet-300 font-heading">₹{item.price}</span>
                    </div>
                    <p className="text-white/70 mb-4 font-body">{item.description}</p>
                    <div className="flex items-center justify-between text-sm text-white/60 mb-2 font-body">
                      <span>Available: {item.quantity_available}</span>
                      <span>Serves: {item.serves}</span>
                    </div>
                    <div className="text-sm text-white/70 mb-4 font-body">
                      <span className="font-medium">Canteen:</span> {item.canteen_name}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsEditModalOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center space-x-2 btn-secondary-glass px-4 py-2 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        disabled={deletingMenuItem === item.id}
                        className="flex-1 flex items-center justify-center space-x-2 glass-button px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{deletingMenuItem === item.id ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {menuItems.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4 glow-soft">
                  <Plus className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2 font-heading">No menu items yet</h3>
                <p className="text-white/60 font-body">Add your first menu item for {user?.full_name} to get started</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit/Add Menu Item Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white font-heading">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                disabled={savingMenuItem}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2 font-body">Item Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 glass-input focus-glass font-body"
                  placeholder="Enter item name"
                  disabled={savingMenuItem}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2 font-body">Description *</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 glass-input focus-glass font-body"
                  placeholder="Enter item description"
                  disabled={savingMenuItem}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 font-body">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.price}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 glass-input focus-glass font-body"
                    placeholder="0.00"
                    disabled={savingMenuItem}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 font-body">
                    <Users className="w-4 h-4 inline mr-1" />
                    Serves *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.serves}
                    onChange={(e) => setEditForm(prev => ({ ...prev, serves: e.target.value }))}
                    className="w-full px-3 py-2 glass-input focus-glass font-body"
                    placeholder="1"
                    disabled={savingMenuItem}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 font-body">
                    <Package2 className="w-4 h-4 inline mr-1" />
                    Available Qty *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.quantity_available}
                    onChange={(e) => setEditForm(prev => ({ ...prev, quantity_available: e.target.value }))}
                    className="w-full px-3 py-2 glass-input focus-glass font-body"
                    placeholder="0"
                    disabled={savingMenuItem}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 font-body">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 glass-input focus-glass font-body"
                    disabled={savingMenuItem}
                  >
                    <option value="main_course">Main Course</option>
                    <option value="snacks">Snacks</option>
                    <option value="beverages">Beverages</option>
                    <option value="south_indian">South Indian</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 font-body">Canteen Name</label>
                  <input
                    type="text"
                    value={user?.full_name || ''}
                    className="w-full px-3 py-2 glass-input opacity-60 font-body"
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-white/50 mt-1 font-body">
                    Items will be added to your canteen automatically
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2 font-body">Image URL (Optional)</label>
                <input
                  type="text"
                  value={editForm.image_url}
                  onChange={(e) => setEditForm(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-3 py-2 glass-input focus-glass font-body"
                  placeholder="https://example.com/image.jpg"
                  disabled={savingMenuItem}
                />
                <p className="text-xs text-white/50 mt-1 font-body">Leave empty to use default image</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex space-x-4 p-6 border-t border-white/10">
              <button
                onClick={() => setIsEditModalOpen(false)}
                disabled={savingMenuItem}
                className="flex-1 px-4 py-2 btn-secondary-glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMenuItem}
                disabled={savingMenuItem}
                className="flex-1 px-4 py-2 btn-primary-glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingMenuItem ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;