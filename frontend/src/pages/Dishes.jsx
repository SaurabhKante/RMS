import React, { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import { useAppContext } from "../context/AppContext";


import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Minus, 
  Trash2, 
  UtensilsCrossed, 
  Receipt, 
  Coins, 
  CreditCard, 
  Smartphone, 
  Users, 
  BookOpen, 
  Sparkles,
  Calendar,
  IndianRupee,
  X,
  FileSpreadsheet
} from 'lucide-react';
  
const Dishes = () => {
  const { 
    dishes, 
    tables, 
    cartItems,  
    activeCartTableId, 
    setActiveCartTableId,
    addToCart, 
    removeFromCart, 
    adjustQuantity, 
    clearCart,
    specialInstructions,
    setSpecialInstructions,
    discount,
    setDiscount,
    addOrderToTable,
    addTransaction,
    addDue
  } = useAppContext();
  const Navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [menuSearch, setMenuSearch] = useState('');
  
  // Settle Modal state
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState('Card');
  
  // Alternative Due Booking Modal state inside settlement
  const [isAddDueBooking, setIsAddDueBooking] = useState(false);
  const [dueCustName, setDueCustName] = useState('');
  const [dueCustContact, setDueCustContact] = useState('');

  const currentTable = tables.find(t => t.id === activeCartTableId) || tables[0];

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.dish.price * item.quantity), 0);
  const taxPercent = 5; // CGST/SGST 5%
  const taxAmount = parseFloat((subtotal * (taxPercent / 100)).toFixed(2));
  const finalTotal = parseFloat(Math.max(0, subtotal - discount + taxAmount).toFixed(2));

  // Category Filtering
  const filteredDishes = dishes.filter(dish => {
    const matchesCat = activeTab === 'All' || dish.category === activeTab;
    const matchesSearch = dish.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                          dish.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSettleConfirm = () => {
    if (cartItems.length === 0) return;

    // Add transaction to history
    addTransaction({
      tableNo: currentTable.name,
      amount: finalTotal,
      paymentMode: paymentMode,
      status: 'Settled'
    });

    // Update table info
    addOrderToTable(currentTable.id, finalTotal, cartItems.reduce((sum, item) => sum + item.quantity, 0));

    // Reset
    clearCart();
    setIsSettleModalOpen(false);
    alert(`Payment of ₹${finalTotal.toLocaleString('en-IN')} settled successfully via ${paymentMode}. Orders updated!`);
  };

  const handleBookAsDue = (e) => {
    e.preventDefault();
    if (!dueCustName || !dueCustContact) {
      alert("Customer name and contact number are required.");
      return;
    }

    // Add to dues state
    addDue({
      customerName: dueCustName,
      contact: dueCustContact,
      tableRef: currentTable.name,
      dueAmount: finalTotal
    });

    // Reset states
    setIsAddDueBooking(false);
    setIsSettleModalOpen(false);
    clearCart();

    alert(`Entire bill of ₹${finalTotal.toLocaleString('en-IN')} has been booked under ${dueCustName}'s due ledger. Table status updated.`);
  };
  return (
    <>
      <DashboardHeader
        searchPlaceholder="Search Dishes"
        buttonText="Manage Dishes"
        onSearch={(value) => setMenuSearch(value)}
        onButtonClick={() => Navigate("/dishes/manage")}
      />

     {/* Dynamic Splits Page: Menu left, Cart right */}
        <div className="flex-grow flex flex-col xl:flex-row overflow-hidden">
          
          {/* LEFT SECTION: Interactive Grid of Dishes */}
          <main className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Table context setup */}
            <div className="bg-white p-4 rounded-xl border border-[#bfc8c9]/40 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0d5e65]/10 text-[#00454b] rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-sans font-bold text-sm text-[#0b1c30]">
                    Active Table: {currentTable?.name}
                  </h2>
                  <p className="text-xs text-[#6f797a]">
                    Select Table above to route bookings
                  </p>
                </div>
              </div>

              {/* Selector to shift active table editing */}
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs text-[#3f484a] font-medium">Switch Session:</span>
                <select
                  id="table-session-selector"
                  value={activeCartTableId}
                  onChange={(e) => {
                    setActiveCartTableId(e.target.value);
                    clearCart();
                  }}
                  className="bg-white border border-[#bfc8c9] rounded-md px-3 py-1.5 font-sans text-xs text-[#0b1c30] font-semibold outline-none focus:border-[#00454b]"
                >
                  {tables.map(tbl => (
                    <option key={tbl.id} value={tbl.id}>
                      {tbl.name} ({tbl.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Menu categories Sub Head tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1.5">
              {['All', 'Starters', 'Main', 'Drinks', 'Desserts'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 font-sans text-xs font-extrabold rounded-full border transition-all ${
                    activeTab === cat 
                      ? 'bg-[#00454b] text-white border-[#00454b]' 
                      : 'bg-white text-[#3f484a] border-[#bfc8c9] hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDishes.map(dish => {
                const isSelected = cartItems.some(item => item.dish.id === dish.id);
                return (
                  <div 
                    key={dish.id} 
                    className={`bg-white rounded-xl border overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow relative ${
                      !dish.isAvailable ? 'opacity-65' : ''
                    } ${isSelected ? 'border-2 border-[#00454b]' : 'border-[#bfc8c9]/40'}`}
                  >
                    {!dish.isAvailable && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <span className="bg-[#ba1a1a] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded tracking-widest shadow-sm">
                          SOLD OUT TODAY
                        </span>
                      </div>
                    )}

                    <div className="p-4 flex gap-4">
                      {/* Image Thumbnail */}
                      <div className="w-20 h-20 bg-[#eff4ff] border border-[#bfc8c9]/20 rounded-lg overflow-hidden shrink-0">
                        <img 
                          src={dish.image} 
                          alt={dish.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Content side */}
                      <div className="flex-grow space-y-1">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-sans font-bold text-sm text-[#0b1c30] line-clamp-1">{dish.name}</h4>
                          <span className="font-sans font-extrabold text-xs text-[#00454b] shrink-0">₹{dish.price}</span>
                        </div>
                        <p className="font-sans text-[11px] text-[#6f797a] leading-normal line-clamp-2">{dish.description}</p>
                        
                        {/* Tags list */}
                        {dish.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {dish.tags.map(t => (
                              <span key={t} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                t === 'Popular' 
                                  ? 'bg-[#ffebee] text-red-700' 
                                  : t === 'Vegetarian' 
                                  ? 'bg-[#e8f5e9] text-green-700' 
                                  : 'bg-[#0d5e65]/10 text-[#00454b]'
                              }`}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Trigger Footer add button */}
                    <div className="p-3 bg-gray-50 border-t border-[#bfc8c9]/25 flex justify-end">
                      <button
                        onClick={() => addToCart(dish)}
                        disabled={!dish.isAvailable}
                        className="p-1 px-3 bg-[#0d5e65]/10 hover:bg-[#00454b] hover:text-white rounded-md text-[#00454b] font-sans text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add item
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>

          {/* RIGHT PANEL: Current Booking Cart */}
          <section id="menu-current-booking-cart" className="w-full xl:w-[380px] bg-white border-t xl:border-t-0 xl:border-l border-[#bfc8c9] p-6 flex flex-col justify-between shrink-0">
            <div className="flex-1 flex flex-col min-h-0 space-y-4">
              <div className="flex items-center justify-between border-b border-[#bfc8c9]/35 pb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="text-[#00454b] h-5 w-5" />
                  <h3 className="font-sans font-bold text-sm text-[#0b1c30]">Current Order</h3>
                </div>
                <button 
                  onClick={clearCart}
                  className="text-xs text-[#ba1a1a] hover:underline font-bold"
                >
                  Clear Cart
                </button>
              </div>

              {/* Cart Items list */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[350px] xl:max-h-none">
                {cartItems.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center text-[#bfc8c9]">
                    <UtensilsCrossed className="h-10 w-10 mb-2" />
                    <p className="text-xs text-[#6f797a]">Empty Basket</p>
                    <p className="text-[10px] text-[#bfc8c9] mt-0.5">Add dishes from the menu to populate bill.</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.dish.id} className="flex items-center justify-between p-3 bg-[#f8f9ff] border border-[#bfc8c9]/25 rounded-xl">
                      <div className="flex-grow max-w-[200px]">
                        <h5 className="font-sans font-bold text-xs text-[#0b1c30] truncate">{item.dish.name}</h5>
                        <p className="font-sans text-[11px] text-[#00454b] font-semibold mt-0.5">
                          ₹{(item.dish.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Quantity adjustment panel */}
                      <div className="flex items-center gap-2.5 bg-white p-1 rounded-lg border border-[#bfc8c9]/30 shrink-0">
                        <button 
                          onClick={() => adjustQuantity(item.dish.id, -1)}
                          className="p-1 hover:bg-gray-100 rounded text-[#3f484a]"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-mono text-xs font-bold text-[#0b1c30] w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => adjustQuantity(item.dish.id, 1)}
                          className="p-1 hover:bg-gray-100 rounded text-[#3f484a]"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button 
                        onClick={() => removeFromCart(item.dish.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded ml-1 transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Special instructions segment */}
              <div className="space-y-1 pb-3">
                <label className="block text-xs font-bold text-[#6f797a] uppercase">Special Instructions</label>
                <textarea
                  id="checkout-special-instructions"
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Allergy warning, extra chilly, gluten-free base..."
                  className="w-full px-3 py-2 bg-gray-50 border border-[#bfc8c9]/50 rounded-lg text-xs hover:border-[#bfc8c9] focus:bg-white outline-none font-sans"
                />
              </div>
            </div>

            {/* Calculations segment */}
            <div className="border-t border-[#bfc8c9]/40 pt-4 space-y-3 bg-white">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#6f797a]">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {/* Discount field block */}
                <div className="flex justify-between items-center text-[#6f797a]">
                  <span>Discount (₹)</span>
                  <input
                    type="number"
                    value={discount || ''}
                    onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-20 pl-2 pr-1 py-0.5 bg-gray-50 border border-[#bfc8c9]/50 rounded font-mono text-right text-xs text-[#0b1c30] outline-none"
                    placeholder="0"
                  />
                </div>

                <div className="flex justify-between text-[#6f797a]">
                  <span>Tax (CGST & SGST 5%)</span>
                  <span className="font-mono">₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="h-[1px] bg-[#bfc8c9]/25 my-1"></div>

                <div className="flex justify-between text-base font-bold text-[#0b1c30]">
                  <span>Total</span>
                  <span className="font-mono text-[#00454b]">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                id="cart-payment-settle-trigger"
                onClick={() => {
                  if (cartItems.length === 0) {
                    alert("Basket is empty. Select menu items before triggering settlement.");
                    return;
                  }
                  setIsSettleModalOpen(true);
                }}
                disabled={cartItems.length === 0}
                className="w-full py-3 bg-[#00454b] text-white hover:bg-[#0d5e65] font-sans text-sm font-bold rounded-lg transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Settle Payment
              </button>
            </div>
          </section>

        </div>

        {/* Payment Settlement Modal Dialog */}
        {isSettleModalOpen && (
          <div className="fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-xs z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl border border-[#bfc8c9]/50 animate-in fade-in zoom-in-95">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-sans font-bold text-base text-[#0b1c30]">Settle Payment — {currentTable?.name}</h3>
                <button 
                  onClick={() => { 
                    setIsSettleModalOpen(false); 
                    setIsAddDueBooking(false); 
                  }} 
                  className="text-[#6f797a] hover:text-[#0b1c30]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {!isAddDueBooking ? (
                <div className="space-y-6">
                  {/* Summary of due */}
                  <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#bfc8c9]/20 text-center">
                    <p className="text-xs text-[#6f797a] font-bold uppercase tracking-wider">Amount Due</p>
                    <h2 className="text-3xl font-extrabold text-[#00454b] mt-1 font-mono">
                      ₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h2>
                  </div>

                  {/* Payment Methods Grid */}
                  <div className="space-y-2">
                    <p className="font-sans text-xs font-bold text-[#6f797a] uppercase tracking-wide">Select Payment Method</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setPaymentMode('Cash')}
                        className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all h-20 ${
                          paymentMode === 'Cash' 
                            ? 'border-2 border-[#00454b] bg-[#dce9ff]/20' 
                            : 'border-[#bfc8c9]/35 hover:bg-gray-50'
                        }`}
                      >
                        <Coins className="h-5 w-5 text-[#00454b]" />
                        <span className="font-sans text-xs font-bold text-[#0b1c30] mt-1">Cash</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMode('Card')}
                        className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all h-20 ${
                          paymentMode === 'Card' 
                            ? 'border-2 border-[#00454b] bg-[#dce9ff]/20' 
                            : 'border-[#bfc8c9]/35 hover:bg-gray-50'
                        }`}
                      >
                        <CreditCard className="h-5 w-5 text-[#00454b]" />
                        <span className="font-sans text-xs font-bold text-[#0b1c30] mt-1">Visa/Card</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMode('UPI')}
                        className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all h-20 ${
                          paymentMode === 'UPI' 
                            ? 'border-2 border-[#00454b] bg-[#dce9ff]/20' 
                            : 'border-[#bfc8c9]/35 hover:bg-gray-50'
                        }`}
                      >
                        <Smartphone className="h-5 w-5 text-[#00454b]" />
                        <span className="font-sans text-xs font-bold text-[#0b1c30] mt-1">UPI (GPay/PhonePe)</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMode('Split')}
                        className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all h-20 ${
                          paymentMode === 'Split' 
                            ? 'border-2 border-[#00454b] bg-[#dce9ff]/20' 
                            : 'border-[#bfc8c9]/35 hover:bg-gray-50'
                        }`}
                      >
                        <X className="h-5 w-5 text-[#00454b]" />
                        <span className="font-sans text-xs font-bold text-[#0b1c30] mt-1">Split Bill</span>
                      </button>
                    </div>
                  </div>

                  <div className="h-[1px] bg-[#bfc8c9]/30"></div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleSettleConfirm}
                      className="w-full py-3 bg-[#0d5e65] text-white hover:bg-[#00454b] font-sans text-xs font-bold rounded-lg transition-all"
                    >
                      Confirm Payment
                    </button>
                    
                    <button
                      onClick={() => setIsAddDueBooking(true)}
                      className="w-full py-3 border border-[#9d4300] text-[#9d4300] hover:bg-orange-50 font-sans text-xs font-bold rounded-lg transition-all"
                    >
                      Add to Customer Due / Account
                    </button>
                  </div>
                </div>
              ) : (
                /* Due Booking inner panel Form */
                <form onSubmit={handleBookAsDue} className="space-y-4">
                  <div className="bg-orange-50 p-4 border border-orange-200 rounded-lg">
                    <p className="text-xs text-orange-900 leading-normal">
                      This will book the sum of <b>₹{finalTotal.toLocaleString('en-IN')}</b> directly into the Customer Dues ledger.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#3f484a] uppercase">Customer Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. John Doe"
                      value={dueCustName}
                      onChange={(e) => setDueCustName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#bfc8c9] rounded-lg text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#3f484a] uppercase">Contact Number</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="+91 99999 88888"
                      value={dueCustContact}
                      onChange={(e) => setDueCustContact(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#bfc8c9] rounded-lg text-sm outline-none font-mono"
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button 
                      type="button" 
                      onClick={() => setIsAddDueBooking(false)}
                      className="flex-1 py-2 border border-[#bfc8c9] text-xs font-bold rounded-lg hover:bg-gray-50 text-[#3f484a]"
                    >
                      Back to Mode selection
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-2 bg-[#9d4300] text-white text-xs font-bold rounded-lg hover:bg-[#863c05]"
                    >
                      Book Due & Close Table
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      
    

    </>
  );
};

export default Dishes;