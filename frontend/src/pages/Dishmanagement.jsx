import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import DashboardHeader from '../components/DashboardHeader';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Edit, 
  LayoutGrid, 
  List, 
  AlertTriangle, 
  Check, 
  X, 
  UtensilsCrossed, 
  ChevronRight,
  TrendingUp,
  Flame,
  ArrowLeft
} from 'lucide-react';

export default function DishManagement() {
  const navigate = useNavigate();
  const { 
    dishes, 
    addDish, 
    updateDish, 
    deleteDish, 
    toggleDishAvailability 
  } = useAppContext();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('GRID');

  // Modals state
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  // Form states
  const [dishName, setDishName] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [dishCategory, setDishCategory] = useState('Main');
  const [dishDescription, setDishDescription] = useState('');
  const [dishImageUrl, setDishImageUrl] = useState('');
  const [dishTagsInput, setDishTagsInput] = useState(''); // comma-separated

  const handleAddDishSubmit = (e) => {
    e.preventDefault();
    const priceVal = parseFloat(dishPrice);
    if (isNaN(priceVal) || priceVal <= 0) {
      alert("Please enter a valid positive price.");
      return;
    }

    const tagsArr = dishTagsInput
      ? dishTagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      : [];

    const defaultImg = dishImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200';

    if (editingDish) {
      // Editing
      updateDish({
        ...editingDish,
        name: dishName,
        price: priceVal,
        category: dishCategory,
        description: dishDescription,
        image: defaultImg,
        tags: tagsArr
      });
      setEditingDish(null);
    } else {
      // Creating
      addDish({
        name: dishName,
        price: priceVal,
        category: dishCategory,
         description: dishDescription,
        isAvailable: true,
        image: defaultImg,
        tags: tagsArr
      });
    }

    // Reset
    setDishName('');
    setDishPrice('');
    setDishDescription('');
    setDishImageUrl('');
    setDishTagsInput('');
    setIsAddDishOpen(false);
  };

  const handleEditTrigger = (dish) => {
    setEditingDish(dish);
    setDishName(dish.name);
    setDishPrice(dish.price.toString());
    setDishCategory(dish.category);
    setDishDescription(dish.description);
    setDishImageUrl(dish.image);
    setDishTagsInput(dish.tags.join(', '));
    setIsAddDishOpen(true);
  };

  const handleCancelForm = () => {
    setEditingDish(null);
    setDishName('');
    setDishPrice('');
    setDishDescription('');
    setDishImageUrl('');
    setDishTagsInput('');
    setIsAddDishOpen(false);
  };

  // Categories helper counts
  const countByCategory = (cat) => {
    if (cat === 'All') return dishes.length;
    return dishes.filter(d => d.category === cat || (cat === 'Appetizers' && d.category === 'Starters')).length;
  };

  // Searching & Category filtering
  const filteredDishes = dishes.filter(dish => {
    const matchesCategory = 
      activeCategoryFilter === 'All' || 
      dish.category === activeCategoryFilter ||
      (activeCategoryFilter === 'Appetizers' && dish.category === 'Starters');
      
    const matchesSearch = 
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCategory && matchesSearch;
  });

  const categoryHeadlines = {
    'All': 'All Operational Dishes',
    'Appetizers': 'Appetizers & Starters',
    'Starters': 'Appetizers & Starters',
    'Main': 'Main Course Dishes',
    'Drinks': 'Refreshments & Beverages',
    'Desserts': 'Artesanal Desserts'
  };

  return (
    <div id="dish-management-dashboard-view" className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen">
      

         <DashboardHeader
        searchPlaceholder="Search Dishes"
        buttonText="Add New Dish"
        onSearch={(value => setSearchQuery(value))}
        onButtonClick={() => setIsAddDishOpen(true)}
      />

        {/* Master Work Split Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-8 gap-8">
          
          {/* LEFT COLUMN: Categories bar list */}
          <aside className="w-full lg:w-[260px] flex flex-col gap-6 shrink-0">
            {/* Category selection */}
            <div className="bg-white p-4 rounded-xl border border-[#bfc8c9]/40 shadow-xs">
              <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#6f797a] px-2 mb-3">Menu Categories</p>
              <div className="space-y-1">
                {['All', 'Appetizers', 'Main', 'Drinks', 'Desserts'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg font-sans text-xs font-semibold transition-colors ${
                      activeCategoryFilter === cat 
                        ? 'bg-[#0d5e65]/10 text-[#0d5e65]' 
                        : 'text-[#3f484a] hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat === 'Appetizers' ? 'Appetizers (Starters)' : cat}</span>
                    <span className="text-[10px] bg-[#bfc8c9]/30 text-[#0b1c30] px-2 py-0.5 rounded-full">
                      {countByCategory(cat)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Kitchen Alert Box
            {/* <div className="bg-red-50 p-5 rounded-xl border border-red-200 shadow-xs space-y-3">
              <div className="flex gap-2 items-start text-red-800">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <div>
                  <h4 className="font-sans font-bold text-xs">Kitchen Alerts</h4>
                  <p className="text-[11px] opacity-90 mt-1">3 dishes are running low on ingredients.</p>
                </div>
              </div>
              <button 
                onClick={() => alert("Ingredient levels check: Truffle mushrooms stock [Low], Wagyu buns [Low], Sea Bass [Low]. Stock delivery scheduled tomorrow morning.")}
                className="w-full py-1.5 bg-[#ba1a1a] hover:bg-red-800 text-white font-sans text-[11px] font-bold rounded transition-colors"
              >
                Review Inventory
              </button>
            </div>} */}
          </aside> 

          {/* RIGHT COLUMN: Grid Content space */}
          <main className="flex-grow space-y-6">
            
            {/* Headline and display settings toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-[#bfc8c9]/40">
              <div>
                <h2 className="font-sans font-extrabold text-base text-[#0b1c30]">
                  {categoryHeadlines[activeCategoryFilter]}
                </h2>
                <p className="text-xs text-[#6f797a] mt-0.5">Manage details and configure availability</p>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center gap-2 border border-[#bfc8c9]/35 rounded-lg p-1 bg-gray-50 shrink-0">
                <button
                  onClick={() => setViewMode('GRID')}
                  className={`p-1.5 rounded transition-all ${
                    viewMode === 'GRID' ? 'bg-white shadow-xs text-[#00454b]' : 'text-[#6f797a] hover:text-[#0b1c30]'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('LIST')}
                  className={`p-1.5 rounded transition-all ${
                    viewMode === 'LIST' ? 'bg-white shadow-xs text-[#00454b]' : 'text-[#6f797a] hover:text-[#0b1c30]'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Dish Display Content */}
            {viewMode === 'GRID' ? (
              /* Grid Layout Mode */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDishes.map(dish => (
                  <div 
                    key={dish.id} 
                    className={`bg-white rounded-xl border overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow relative ${
                      !dish.isAvailable ? 'border-red-200' : 'border-[#bfc8c9]/45'
                    }`}
                  >
                    {!dish.isAvailable && (
                      <div className="absolute top-2 left-2 z-20">
                        <span className="bg-[#ba1a1a] text-white text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wider">
                          SOLD OUT
                        </span>
                      </div>
                    )}

                    {/* Image space with overlay */}
                    <div className="h-40 bg-gray-100 border-b border-[#bfc8c9]/20 relative overflow-hidden">
                      <img 
                        src={dish.image} 
                        alt={dish.name} 
                        className={`w-full h-full object-cover transition-all ${!dish.isAvailable ? 'grayscale opacity-50' : ''}`}
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Top Action Toggle switches on the cover */}
                      <div className="absolute top-3 right-3 flex items-center justify-center p-1 px-2.5 rounded-full bg-black/50 backdrop-blur-xs">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={dish.isAvailable}
                            onChange={() => toggleDishAvailability(dish.id)}
                            className="sr-only peer"
                          />
                          <div className="w-7 h-4 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#aaeef6]"></div>
                          <span className="ml-1.5 font-sans text-[9px] text-[#aaeef6] font-extrabold uppercase">
                            {dish.isAvailable ? 'In stock' : 'Out'}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Content text */}
                    <div className="p-5 flex-grow space-y-3">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-sans font-bold text-sm text-[#0b1c30] line-clamp-1">{dish.name}</h4>
                        <span className="font-sans font-extrabold text-sm text-[#00454b]">₹{dish.price}</span>
                      </div>
                      
                      <p className="font-sans text-xs text-[#6f797a] leading-relaxed line-clamp-2">{dish.description}</p>
                      
                      {/* Tags list */}
                      {dish.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {dish.tags.map(t => (
                            <span key={t} className="text-[9px] font-extrabold px-2 py-0.5 bg-[#eff4ff] text-[#00454b] rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Edit/Delete Trigger buttons */}
                    <div className="p-3 bg-gray-50 border-t border-[#bfc8c9]/25 flex gap-2">
                      <button
                        onClick={() => handleEditTrigger(dish)}
                        className="flex-1 py-1 px-3 border border-[#bfc8c9] hover:bg-gray-100 hover:text-[#0b1c30] text-[#3f484a] font-sans text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${dish.name} entirely from the branch menu database?`)) {
                            deleteDish(dish.id);
                          }
                        }}
                        className="py-1 px-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List Simple Row Layout Mode */
              <div className="bg-white rounded-xl border border-[#bfc8c9]/45 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#bfc8c9]/30 text-xs font-bold text-[#6f797a] uppercase tracking-wider bg-[#f8f9ff]">
                        <th className="p-4">Dish Details</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-right">Price</th>
                        <th className="p-4">Status / Active</th>
                        <th className="p-4 text-center">Settings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#bfc8c9]/20 text-xs text-[#0b1c30]">
                      {filteredDishes.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-[#6f797a]">
                            No dishes matching selection.
                          </td>
                        </tr>
                      ) : (
                        filteredDishes.map(dish => (
                          <tr key={dish.id} className="hover:bg-[#eff4ff]/20 transition-all">
                            <td className="p-4">
                              <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-gray-100 border border-[#bfc8c9]/15 rounded-lg overflow-hidden shrink-0">
                                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <div>
                                  <h4 className="font-sans font-bold text-sm text-[#0b1c30]">{dish.name}</h4>
                                  <p className="font-sans text-[11px] text-[#6f797a] mt-0.5 line-clamp-1">{dish.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded-full bg-[#bfc8c9]/30 text-[10px] font-bold">
                                {dish.category}
                              </span>
                            </td>
                            <td className="p-4 text-right font-mono font-bold text-[#00454b]">₹{dish.price}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleDishAvailability(dish.id)}
                                  className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase ${
                                    dish.isAvailable 
                                      ? 'bg-green-100 text-[#2c613c]' 
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {dish.isAvailable ? 'Available' : 'Sold out'}
                                </button>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="inline-flex gap-2">
                                <button onClick={() => handleEditTrigger(dish)} className="p-1 px-2 border border-[#bfc8c9] rounded hover:bg-gray-100">
                                  Edit
                                </button>
                                <button onClick={() => deleteDish(dish.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Master Dialog Form overlay for Adding / Editing Category Dishes */}
        {isAddDishOpen && (
          <div className="fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-xs z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl border border-[#bfc8c9]/50 animate-in fade-in zoom-in-95">
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-bold text-base text-[#0b1c30]">
                  {editingDish ? 'Edit Dish Details' : 'Add New Menu Item'}
                </h3>
                <button onClick={handleCancelForm} className="text-[#6f797a] hover:text-[#0b1c30]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddDishSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#3f484a] uppercase">Dish Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Signature Truffle Burger"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#bfc8c9] rounded-lg text-xs outline-none focus:ring-[#00454b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#3f484a] uppercase">Price (₹)</label>
                    <input 
                      type="number" 
                      required 
                      placeholder="580"
                      value={dishPrice}
                      onChange={(e) => setDishPrice(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#bfc8c9] rounded-lg text-xs outline-none focus:ring-[#00454b]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#3f484a] uppercase">Category</label>
                    <select 
                      value={dishCategory}
                      onChange={(e) => setDishCategory(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#bfc8c9] rounded-lg text-xs outline-none focus:ring-[#00454b]"
                    >
                      <option value="Starters">Starters (Appetizers)</option>
                      <option value="Main">Main Course</option>
                      <option value="Drinks">Beverages (Drinks)</option>
                      <option value="Desserts">Desserts</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#3f484a] uppercase">Description</label>
                  <textarea 
                    rows={2}
                    required
                    placeholder="Brief recipe details..."
                    value={dishDescription}
                    onChange={(e) => setDishDescription(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#bfc8c9] rounded-lg text-xs outline-none focus:ring-[#00454b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#3f484a] uppercase">Image Url (Optional)</label>
                  <input 
                    type="url" 
                    placeholder="https://gourmet.link/image.jpg"
                    value={dishImageUrl}
                    onChange={(e) => setDishImageUrl(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#bfc8c9] rounded-lg text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#3f484a] uppercase">Tags (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="Vegetarian, Spicy, Popular"
                    value={dishTagsInput}
                    onChange={(e) => setDishTagsInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#bfc8c9] rounded-lg text-xs outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={handleCancelForm}
                    className="flex-1 py-1.5 border border-[#bfc8c9] text-xs font-bold rounded-lg hover:bg-gray-50 text-[#3f484a]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-1.5 bg-[#00454b] text-white text-xs font-bold rounded-lg hover:bg-[#0d5e65]"
                  >
                    {editingDish ? 'Update Dish' : 'Publish Dish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
  
  );
}




  



