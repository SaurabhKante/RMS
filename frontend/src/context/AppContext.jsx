import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext(undefined);
export const AppProvider = ({ children }) => {
 const initialDishes = [
  {
    id: 'd1',
    name: 'Quinoa Power Bowl',
    price: 450,
    description: 'High-protein salad with lemon vinaigrette.',
    category: 'Starters',
    isAvailable: true,
    tags: ['Vegetarian'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkNVKnOqGM_4GauD4uZ7XNyiZd-_D3NDMVdFFUuROPxPaakCewooI5FjGIkemRoBYSMcUXOYZuiGVyCY8gm_mEE5ESbZptXBU6a4wR-f7bDute4D6GTIxRTTFFGE6WcEFHfJtHRRrcflNVbGZrrpJFQmpuZ3D4PE39WVXKMMxQRVGwgb88BS71iznw_UBtDdaG-iuq2MGrtprZuVvl6v_Ckw-WCmDZrOXFDO4Kv91WblFgwQQbit9AYdV5sd0cFHE6i8NVYeYqyuA'
  },
  {
    id: 'd2',
    name: 'Margherita Pizza',
    price: 580,
    description: 'Sourdough base with San Marzano tomatoes.',
    category: 'Main',
    isAvailable: true,
    tags: ['Vegetarian', 'Popular'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbJ4bLPiNLXb5YhdmJfewuUeazoLMJ5i1MLyq3ld0I63uv8fHSU10efr6If_4uJWiUuqcAmoAb8vbe9XCMFdGeQwWugohnIgOz08xu3RB4GQsYeZFz5naJ0dcGjCmn4jzjZfUAeuQ_J8eiXkfQMpesrcYo6E49qXqzzZmp8-2U17SSuI1MYlVm7YuHC2l-ONLY5kWnjeaaZts4jAPCmOahwUL_3-1Anu2d3LQIh5CpQjLaCPfhG9744taTyblX1eSls4lanaBpNJ8'
  },
  {
    id: 'd3',
    name: 'Signature Wagyu',
    price: 890,
    description: 'Double-patty wagyu with truffle mayo.',
    category: 'Main',
    isAvailable: true,
    tags: ['Popular'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGaIGoJjkjw2025UxJT24e3hsctSCiRxJpo8l40fvr7bfbJWkoEYSn7xXhX1Ob41ax4JxYovmC01t9qB0XjIT0ExSujVineBZXRZXT1g53Wq7gS5QN41orzXBCfV8LbBinv8ygLoVkI39Sjw99qnDJw6VTlwMnLkaVVF1irQguWWPPVfL9GF0TMAGruteQ7sf_IC2Tb_LRpFni6Ol-YQKnN0FO9v842kL7wizf-xdaNWNReVpX3LlY6-CH4egLGQFoQufnuKeyp2k'
  },
  {
    id: 'd4',
    name: 'Grilled Salmon',
    price: 750,
    description: 'Pan-seared with seasonal vegetables.',
    category: 'Main',
    isAvailable: true,
    tags: ['Featured'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpiNIP3FFQ7nDhYN-RUf2yaSJ5sYacZeCWUISTs9ZsqnZ-B3AhpA2tdW7ae2tT6j-_wiD18Chf4xal9uhq6kqAUFw7FfUUH7f6tzonyBGvrJqdZCT7oMt4M9V1jXgnjjx535H9aEvPbS_dkvpRUZh4BcxHF-dNw3CHzIBa1DQqN-JpOvjbf-eT42S6Tlb9kSOFkzEDkZBBnc1zxOM3O-TO_qvkk625pOYYRM4Rbn-bB50uLj7jPiMEcoFNhjuZB1FZEZWX2I6qLH8'
  },
  {
    id: 'd5',
    name: 'Choco Glaze',
    price: 220,
    description: 'Freshly baked artisan donuts (2pc).',
    category: 'Desserts',
    isAvailable: true,
    tags: [],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeyuLClytdRn8Z7Yy4CgIdSw2cWEKALisagEbwWSb-Zfiah5NTllWacPCIz6XBTiz-s-6M-QtSRDfP45M7U4KKDbezXEFEC7QbnRI3a2Oez_5KDqO7OzuHzytkL9TyXFq80Iz_07cxb2bl9HxwwdggRzfGwvosN2yefzAs5szWbCo-Na7Y4K6wN8KTgjC29WWE-YJIGR069cbB-gCAoGQGrbmNgq3vRE5C7Qmw0UYWwNw2MPxajRbxaz2OALQQJJ0q2ASvc_3hpaY'
  },
  {
    id: 'd6',
    name: 'Cucumber Gin Fizz',
    price: 420,
    description: 'Refreshing house-infused gin tonic.',
    category: 'Drinks',
    isAvailable: true,
    tags: [],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCDSPgja4ygy1lmVxINC4xaLB2uBAG3v7wf8PG0GR2KcKN0r14UgFOJJXVs-gBunHOS2dqy-WEv7iyIiz63UFyxn1Wa0OjEf_UiioUKf8N6cMCTdhj-U6yX6SXvKtv9oGz7I3lGIH9LRKB0RwFE06EUvaRk2sJuJEn8ywLjVt2hvjnKuXiIzdZnt_z6z_weEFP5vENiE5Qs1uQBSGXroObRpB04_WF-ZKYSnukCyrOC7ULAgy5N8J7QcDW-fYsuh4rts8izkbR1og'
  },
  {
    id: 'd7',
    name: 'Truffle Mushroom Risotto',
    price: 620,
    description: 'Creamy arborio rice with truffles and wild mushrooms.',
    category: 'Main',
    isAvailable: true,
    tags: ['Popular'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrqwxlYVmmmXvnkCcIqxVhoxo-xbgX-xK_vZX9WkH94BKckEdN40cwwP_XXTYIlyi5rm6XOYk4yNll2pA6_i5P9myydtkXh5hgLTH9I2H7rPWUd18v1EaUans4q4h-44JP2zUWHZQKuHgfxvhifYLLBCtS43yf3DAC_wPE9XPGQcdu0BJ07ztsa4TLwD_aOiykI-ue8FgqtyB9P8ay1O1XN4Tc1NwqqC2iE8o_bdpgCqodXks5iTMu5idMXkwD55kXJzXl7dRts0c'
  },
  {
    id: 'd8',
    name: 'Pan-Seared Sea Bass',
    price: 950,
    description: 'Delicate sea bass crusted with herbs and white wine lemon glaze.',
    category: 'Main',
    isAvailable: true,
    tags: ['Featured'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFr9Qiwfthwa7-st953agpFYYhRMYDkjDghoJAo1SISqjXBuCrn0k_TorIVi5vEIyQF7h7K8vkvEaQhClztWfnJo5uc_3UHpT4tTFcdpgN_zhPdzfkld2Zxlbmz9z76npzbXbEzZTvtvI_boQMMkErSyX1TUFkiTLoQ56qo3R8kflX2Vavy4zv6KArd3e0FT0xgloKNTwuiNhmLeurPnnIR-n0cmLiIq2rQBmT6i9NkKFWOJIs1pcBfLgPZFQYjsEIQrn1o2Qy_OA'
  },
  {
    id: 'd9',
    name: 'Signature Pepperoni Pizza',
    price: 640,
    description: 'Spicy pepperoni slices over perfectly baked sourdough crust.',
    category: 'Main',
    isAvailable: true,
    tags: ['Popular'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWj4wGLVh8VBBUGKbYiYtTJUnwrVC9o6aowxR0CWR8qXG88oy3ibIOCnXpbQjsgSO_mo9rTIjnyhPUrX110a3oZvftWQtBtsU_xKNBOsneHF9_r9HVIvzyodS9nMby2z6TeSt_BwcPSlQe6I-ea6h3xZAuLhQ-kJkklaxaBuvGd0FGy6z8ltQIGSuOfpCstpjI1CProkROTZvGWXXhyO0hSit8MoqUXLN2DEBXe27CuEbj7WObcZsrV8DjInjlZjE_NB_jn2RsIIc'
  }
];
const initialTables = [
  {
    id: 't1',
    name: 'Table 01',
    seats: 4,
    status: 'Occupied',
    seatedTime: '45m seated',
    totalAmount: 124.50,
    itemsOrderCount: 6,
    guestsAvatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuClNACxCt2z5muTZWa_xEMelJsdRqBnXWbF7eYkmlfTtZuTqZR0ozotVutcUtpEmiEmZrWY4LT_u8ZPDiu7Af3_fmooBjtUKbwkgpO2I5GSudsrjvHxy_GRajOPtFibLWRGBRnfoZHcXep_8ImycT5T5YPx-pe81KRfkUzkh5q2haU2_VtBqlPJ-gMFr_seuyjp1hpu9_YS_TmbxHZD2TmJqn-DbgarqP3ahHjkg7jZe9XFyhz4C4PyuIQ5ysG4lo2YHY1IWSNVaEc',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4gzfwfUChcaKmgaGlQ4Jxtx2TRhuaBcroh-o66vP0qfFumdUZQxqFtmmbuGIR4DHz6M3MQh2h3Sf7lt68yiGzgM5s9433u-AeMT-UvoHRwBsJidOPQZ3YnjI558ZRg7UqT1N-dSXv47UXduWs7TYslyi4eMiynRqPA2bVi7rFl31tYe3FoHpeSU1R9UaeSyPWJi_ndpI6ESzjaMmtKQvQwULKAAqhfXu4wC0VAFOZ2UsCxtp2F8vAUTOIOkdGLigAIU8TZkgRsfo'
    ]
  },
  {
    id: 't2',
    name: 'Table 02',
    seats: 2,
    status: 'Available'
  },
  {
    id: 't5',
    name: 'Table 05',
    seats: 6,
    status: 'Billing',
    seatedTime: '1h 20m seated',
    totalAmount: 342.10,
    itemsOrderCount: 14
  },
  {
    id: 't8',
    name: 'Table 08',
    seats: 4,
    status: 'Reserved',
    reservedName: 'Miller Party',
    reservedTime: '7:30 PM (in 15m)'
  },
  {
    id: 't3',
    name: 'Table 03',
    seats: 2,
    status: 'Occupied',
    seatedTime: '12m seated',
    totalAmount: 42.00,
    itemsOrderCount: 2
  },
  {
    id: 't11',
    name: 'Table 11',
    seats: 4,
    status: 'Occupied',
    seatedTime: '58m seated',
    totalAmount: 186.00,
    itemsOrderCount: 11
  },
  {
    id: 't4',
    name: 'Table 04',
    seats: 4,
    status: 'Available'
  },
  {
    id: 't6',
    name: 'Table 06',
    seats: 6,
    status: 'Available'
  },
  {
    id: 't7',
    name: 'Table 07',
    seats: 2,
    status: 'Available'
  },
  {
    id: 't9',
    name: 'Table 09',
    seats: 4,
    status: 'Available'
  },
  {
    id: 't10',
    name: 'Table 10',
    seats: 2,
    status: 'Available'
  },
  {
    id: 't12',
    name: 'Table 12',
    seats: 8,
    status: 'Available'
  }
];
const initialDues = [
  { id: 'due1', customerName: 'Rohan Sharma', contact: '+91 98765 43210', tableRef: 'T-14', dueAmount: 2450 },
  { id: 'due2', customerName: 'Ananya Gupta', contact: '+91 88223 11445', tableRef: 'T-04', dueAmount: 1120 },
  { id: 'due3', customerName: 'Suresh Iyer', contact: '+91 77665 44332', tableRef: 'Home Delivery', dueAmount: 4890 }
];

const initialExpenses = [
  { id: 'exp1', date: '24 Oct 2023', category: 'Inventory', amount: 12400, paymentMode: 'UPI (Business)', notes: 'Vegetable supply for weekend rush' },
  { id: 'exp2', date: '24 Oct 2023', category: 'Utility', amount: 4200, paymentMode: 'Cash', notes: 'Electricity Bill - Oct' },
  { id: 'exp3', date: '23 Oct 2023', category: 'Maintenance', amount: 1500, paymentMode: 'Petty Cash', notes: 'Plumbing repair in kitchen' },
  { id: 'exp4', date: '23 Oct 2023', category: 'Inventory', amount: 8000, paymentMode: 'Bank Transfer', notes: 'Dairy products weekly payment' }
];

const initialTransactions = [
  { id: '#TRX-9482-A', tableNo: 'T-14 (Fine Dining)', amount: 4250, paymentMode: 'UPI (PhonePe)', status: 'Settled', time: 'Nov 07, 14:22 PM' },
  { id: '#TRX-9481-C', tableNo: 'T-02 (Patio)', amount: 1840, paymentMode: 'Cash', status: 'Settled', time: 'Nov 07, 13:58 PM' },
  { id: '#TRX-9480-S', tableNo: 'T-09 (Booth)', amount: 12400, paymentMode: 'Split (Card/Cash)', status: 'Pending', time: 'Nov 07, 13:45 PM' },
  { id: '#TRX-9479-K', tableNo: 'T-22 (Lounge)', amount: 650, paymentMode: 'Card', status: 'Settled', time: 'Nov 07, 12:30 PM' },
  { id: '#TRX-9478-L', tableNo: 'T-05 (Main)', amount: 2100, paymentMode: 'UPI (GPay)', status: 'Settled', time: 'Nov 07, 11:15 AM' }
];

const mockUser = {
  email: 'manager@hotelix.com',
  restaurantName: 'Hotelix Luxury Dining',
  managerName: 'Admin User',
  phone: '+91 99999 88888'
};
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hotelix_user');
    return saved ? JSON.parse(saved) : mockUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('hotelix_auth') === 'true' || true; // Setup default true for sandbox easy access, but route protected
  });


 const [dishes, setDishes] = useState(initialDishes);
 const [tables, setTables] = useState(() => {
    const saved = localStorage.getItem('hotelix_tables');
    //api call to fetch tables can be placed here and returned if exists, else fallback to localstorage or initialTables
    return saved ? JSON.parse(saved) : initialTables;
  });



  const [dues, setDues] = useState(() => {
    const saved = localStorage.getItem('hotelix_dues');
    return saved ? JSON.parse(saved) : initialDues;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('hotelix_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('hotelix_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  // Basket State for Ordering / Billing Page
  const [cartItems, setCartItems] = useState([]);
  const [activeCartTableId, setActiveCartTableId] = useState('t1'); // Default Table 01 as in mock image
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    localStorage.setItem('hotelix_user', JSON.stringify(user));
    localStorage.setItem('hotelix_auth', isAuthenticated ? 'true' : 'false');
  }, [user, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('hotelix_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('hotelix_dishes', JSON.stringify(dishes));
  }, [dishes]);

  useEffect(() => {
    localStorage.setItem('hotelix_dues', JSON.stringify(dues));
  }, [dues]);

  useEffect(() => {
    localStorage.setItem('hotelix_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('hotelix_transactions', JSON.stringify(transactions));
  }, [transactions]);

// Context functions for order management and table status updates

  const addOrderToTable = (tableId, orderTotal, itemsCount) => {
    setTables(prev => prev.map(tbl => {
      if (tbl.id === tableId) {
        const existingAmount = tbl.totalAmount || 0;
        const existingCount = tbl.itemsOrderCount || 0;
        return {
          ...tbl,
          status: 'Occupied',
          seatedTime: tbl.seatedTime || '5m seated',
          totalAmount: parseFloat((existingAmount + orderTotal).toFixed(2)),
          itemsOrderCount: existingCount + itemsCount
        };
      }
      return tbl;
    }));
  };



 const addToCart = (dish) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.dish.id === dish.id);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], quantity: next[existingIdx].quantity + 1 };
        return next;
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const removeFromCart = (dishId) => {
    setCartItems(prev => prev.filter(item => item.dish.id !== dishId));
  };

  const adjustQuantity = (dishId, change) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.dish.id === dishId) {
          const nextQuantity = item.quantity + change;
          return { ...item, quantity: Math.max(1, nextQuantity) };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setSpecialInstructions('');
    setDiscount(0);
  };

//context functions for Dish Management Page
  const addDish = (newDish) => {
    const nextId = `d${dishes.length + 1}`;
    setDishes(prev => [...prev, { ...newDish, id: nextId }]);
  };

  const updateDish = (updatedDish) => {
    setDishes(prev => prev.map(d => d.id === updatedDish.id ? updatedDish : d));
  };

  const deleteDish = (id) => {
    setDishes(prev => prev.filter(d => d.id !== id));
  };

  const toggleDishAvailability = (id) => {
    setDishes(prev => prev.map(d => d.id === id ? { ...d, isAvailable: !d.isAvailable } : d));
  };

return (
    <AppContext.Provider
      value={{
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
  
    addDish,
    updateDish,
    deleteDish,
    toggleDishAvailability,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {  
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
