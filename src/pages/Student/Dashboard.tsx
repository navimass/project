import React, { useState, useEffect } from 'react';
import { Clock, Search, Filter, Plus, Minus, Star, ShoppingCart, X, Package, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../../components/Layout/Header';
import { MenuItem, CartItem, Order } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [updatingCart, setUpdatingCart] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItems();
    fetchCartItems();
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          menu_item:menu_items(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items:order_items(
            *,
            menu_item:menu_items(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const addToCart = async (menuItem: MenuItem) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const existingItem = cartItems.find(item => item.menu_item_id === menuItem.id);

      if (existingItem) {
        await updateCartQuantity(existingItem.id, existingItem.quantity + 1);
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            menu_item_id: menuItem.id,
            quantity: 1
          });

        if (error) throw error;
        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateCartQuantity = async (cartItemId: string, quantity: number) => {
    if (updatingCart === cartItemId) return;
    
    setUpdatingCart(cartItemId);
    try {
      if (quantity <= 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', cartItemId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', cartItemId);

        if (error) throw error;
      }

      await fetchCartItems();
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    } finally {
      setUpdatingCart(null);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setCheckoutLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const totalAmount = cartItems.reduce((sum, item) => sum + (item.menu_item.price * item.quantity), 0);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: 'pending',
          payment_status: 'completed'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: item.menu_item.price
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (orderItemsError) throw orderItemsError;

      for (const item of cartItems) {
        const { error: updateError } = await supabase
          .from('menu_items')
          .update({ 
            quantity_available: item.menu_item.quantity_available - item.quantity 
          })
          .eq('id', item.menu_item_id);

        if (updateError) throw updateError;
      }

      const { error: clearCartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (clearCartError) throw clearCartError;

      await fetchCartItems();
      await fetchMenuItems();

      setIsCartOpen(false);
      alert('Order placed successfully! You will be notified when it\'s ready.');

    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setCheckoutLoading(false);
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

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.menu_item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-spinner w-12 h-12 mx-auto mb-4"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title={activeTab === 'menu' ? 'Menu' : 'Your Orders'}
        showCart={activeTab === 'menu'}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors font-heading ${
                activeTab === 'menu'
                  ? 'border-violet-400 text-violet-300'
                  : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/30'
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors font-heading ${
                activeTab === 'orders'
                  ? 'border-violet-400 text-violet-300'
                  : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/30'
              }`}
            >
              Your Orders
            </button>
          </nav>
        </div>

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <>
            {/* Search and Filter */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search for food items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 glass-input focus-glass font-body"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 glass-input focus-glass appearance-none font-body"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800 text-white">
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="glass-menu-item overflow-hidden">
                  <div className="relative">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 glass px-2 py-1 rounded-lg flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-white font-body">{item.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-white font-heading">{item.name}</h3>
                      <span className="text-2xl font-bold text-violet-300 font-heading">₹{item.price}</span>
                    </div>
                    <p className="text-white/70 mb-4 font-body">{item.description}</p>
                    <div className="flex items-center justify-between text-sm text-white/60 mb-4 font-body">
                      <span>Serves: {item.serves}</span>
                      <span>Available: {item.quantity_available}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white/80 font-body">{item.canteen_name}</span>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={item.quantity_available <= 0}
                        className="flex items-center space-x-2 btn-primary-glass px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4 glow-soft">
                  <Search className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2 font-heading">No items found</h3>
                <p className="text-white/60 font-body">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white font-heading">Your Orders</h2>
              <div className="glass px-4 py-2 rounded-lg">
                <span className="text-sm text-white/70 font-body">Total Orders: </span>
                <span className="font-semibold text-white font-heading">{orders.length}</span>
              </div>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="glass-spinner w-8 h-8"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4 glow-soft">
                  <Package className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2 font-heading">No orders yet</h3>
                <p className="text-white/60 mb-4 font-body">Your orders will appear here after you place them</p>
                <button
                  onClick={() => setActiveTab('menu')}
                  className="btn-primary-glass px-6 py-2 rounded-lg"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="glass-card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white font-heading">
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <p className="text-sm text-white/60 font-body">
                          {new Date(order.created_at).toLocaleDateString()} at{' '}
                          {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white font-heading">₹{order.total_amount}</p>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize font-body">{order.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-white mb-3 font-heading">Items:</h4>
                      <div className="space-y-3">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 p-3 glass rounded-lg">
                            <img
                              src={item.menu_item.image_url}
                              alt={item.menu_item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-white font-heading">{item.menu_item.name}</h5>
                              <p className="text-sm text-white/60 font-body">{item.menu_item.canteen_name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-white font-heading">x{item.quantity}</p>
                              <p className="text-sm text-white/60 font-body">₹{item.price * item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.status === 'ready' && (
                      <div className="notification-glass border border-green-400/30 p-4">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                          <span className="text-green-300 font-medium font-body">Your order is ready for pickup!</span>
                        </div>
                      </div>
                    )}

                    {order.status === 'processing' && (
                      <div className="notification-glass border border-blue-400/30 p-4">
                        <div className="flex items-center">
                          <Package className="w-5 h-5 text-blue-400 mr-2" />
                          <span className="text-blue-300 font-medium font-body">Your order is being prepared</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 modal-overlay" 
            onClick={() => setIsCartOpen(false)} 
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md sidebar-glass flex flex-col">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white font-heading">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white/60" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2 font-heading">Your cart is empty</h3>
                  <p className="text-white/60 font-body">Add some delicious items to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="glass p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.menu_item.image_url}
                          alt={item.menu_item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-white font-heading">{item.menu_item.name}</h4>
                          <p className="text-sm text-white/60 font-body">₹{item.menu_item.price}</p>
                          <p className="text-xs text-white/50 font-body">{item.menu_item.canteen_name}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            disabled={updatingCart === item.id}
                            className="w-8 h-8 flex items-center justify-center rounded-full glass hover:glow-soft transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>
                          <span className="w-8 text-center font-medium text-white font-heading">
                            {updatingCart === item.id ? '...' : item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            disabled={updatingCart === item.id}
                            className="w-8 h-8 flex items-center justify-center rounded-full glass hover:glow-soft transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-white/10 p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-white font-heading">Total:</span>
                  <span className="text-2xl font-bold text-violet-300 font-heading">₹{cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full btn-primary-glass py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;