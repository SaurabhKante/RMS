import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/baseUrl";

const AppContext = createContext(undefined);

// Initial fallback data
const initialTables = [
  {
    id: "t1",
    name: "Table 01",
    seats: 4,
    status: "Occupied",
    seatedTime: "45m seated",
    totalAmount: 124.5,
    itemsOrderCount: 6,
    guestsAvatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuClNACxCt2z5muTZWa_xEMelJsdRqBnXWbF7eYkmlfTtZuTqZR0ozotVutcUtpEmiEmZrWY4LT_u8ZPDiu7Af3_fmooBjtUKbwkgpO2I5GSudsrjvHxy_GRajOPtFibLWRGBRnfoZHcXep_8ImycT5T5YPx-pe81KRfkUzkh5q2haU2_VtBqlPJ-gMFr_seuyjp1hpu9_YS_TmbxHZD2TmJqn-DbgarqP3ahHjkg7jZe9XFyhz4C4PyuIQ5ysG4lo2YHY1IWSNVaEc",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4gzfwfUChcaKmgaGlQ4Jxtx2TRhuaBcroh-o66vP0qfFumdUZQxqFtmmbuGIR4DHz6M3MQh2h3Sf7lt68yiGzgM5s9433u-AeMT-UvoHRwBsJidOPQZ3YnjI558ZRg7UqT1N-dSXv47UXduWs7TYslyi4eMiynRqPA2bVi7rFl31tYe3FoHpeSU1R9UaeSyPWJi_ndpI6ESzjaMmtKQvQwULKAAqhfXu4wC0VAFOZ2UsCxtp2F8vAUTOIOkdGLigAIU8TZkgRsfo",
    ],
  },
  {
    id: "t2",
    name: "Table 02",
    seats: 2,
    status: "Available",
  },
  {
    id: "t5",
    name: "Table 05",
    seats: 6,
    status: "Billing",
    seatedTime: "1h 20m seated",
    totalAmount: 342.1,
    itemsOrderCount: 14,
  },
  {
    id: "t8",
    name: "Table 08",
    seats: 4,
    status: "Reserved",
    reservedName: "Miller Party",
    reservedTime: "7:30 PM (in 15m)",
  },
  {
    id: "t3",
    name: "Table 03",
    seats: 2,
    status: "Occupied",
    seatedTime: "12m seated",
    totalAmount: 42.0,
    itemsOrderCount: 2,
  },
  {
    id: "t11",
    name: "Table 11",
    seats: 4,
    status: "Occupied",
    seatedTime: "58m seated",
    totalAmount: 186.0,
    itemsOrderCount: 11,
  },
  {
    id: "t4",
    name: "Table 04",
    seats: 4,
    status: "Available",
  },
  {
    id: "t6",
    name: "Table 06",
    seats: 6,
    status: "Available",
  },
  {
    id: "t7",
    name: "Table 07",
    seats: 2,
    status: "Available",
  },
  {
    id: "t9",
    name: "Table 09",
    seats: 4,
    status: "Available",
  },
  {
    id: "t10",
    name: "Table 10",
    seats: 2,
    status: "Available",
  },
  {
    id: "t12",
    name: "Table 12",
    seats: 8,
    status: "Available",
  },
];

const initialDues = [
  {
    id: "due1",
    customerName: "Rohan Sharma",
    contact: "+91 98765 43210",
    tableRef: "T-14",
    dueAmount: 2450,
  },
  {
    id: "due2",
    customerName: "Ananya Gupta",
    contact: "+91 88223 11445",
    tableRef: "T-04",
    dueAmount: 1120,
  },
  {
    id: "due3",
    customerName: "Suresh Iyer",
    contact: "+91 77665 44332",
    tableRef: "Home Delivery",
    dueAmount: 4890,
  },
];

const initialExpenses = [
  {
    id: "exp1",
    date: "24 Oct 2023",
    category: "Inventory",
    amount: 12400,
    paymentMode: "UPI (Business)",
    notes: "Vegetable supply for weekend rush",
  },
  {
    id: "exp2",
    date: "24 Oct 2023",
    category: "Utility",
    amount: 4200,
    paymentMode: "Cash",
    notes: "Electricity Bill - Oct",
  },
  {
    id: "exp3",
    date: "23 Oct 2023",
    category: "Maintenance",
    amount: 1500,
    paymentMode: "Petty Cash",
    notes: "Plumbing repair in kitchen",
  },
  {
    id: "exp4",
    date: "23 Oct 2023",
    category: "Inventory",
    amount: 8000,
    paymentMode: "Bank Transfer",
    notes: "Dairy products weekly payment",
  },
];

const initialTransactions = [
  {
    id: "#TRX-9482-A",
    tableNo: "T-14 (Fine Dining)",
    amount: 4250,
    paymentMode: "UPI (PhonePe)",
    status: "Settled",
    time: "Nov 07, 14:22 PM",
  },
  {
    id: "#TRX-9481-C",
    tableNo: "T-02 (Patio)",
    amount: 1840,
    paymentMode: "Cash",
    status: "Settled",
    time: "Nov 07, 13:58 PM",
  },
  {
    id: "#TRX-9480-S",
    tableNo: "T-09 (Booth)",
    amount: 12400,
    paymentMode: "Split (Card/Cash)",
    status: "Pending",
    time: "Nov 07, 13:45 PM",
  },
  {
    id: "#TRX-9479-K",
    tableNo: "T-22 (Lounge)",
    amount: 650,
    paymentMode: "Card",
    status: "Settled",
    time: "Nov 07, 12:30 PM",
  },
  {
    id: "#TRX-9478-L",
    tableNo: "T-05 (Main)",
    amount: 2100,
    paymentMode: "UPI (GPay)",
    status: "Settled",
    time: "Nov 07, 11:15 AM",
  },
];

const mockUser = {
  email: "manager@hotelix.com",
  restaurantName: "Hotelix Luxury Dining",
  managerName: "Admin User",
  phone: "+91 99999 88888",
};

// App Provider
export const AppProvider = ({ children }) => {
  
  // User / Authentication
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("hotelix_user");
    return saved ? JSON.parse(saved) : mockUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("hotelix_auth") === "true" || true;
  });

  
  // Dish API State
  const [dishes, setDishes] = useState([]);

  const [parentDishes, setParentDishes] = useState([]);

  const [dishesLoading, setDishesLoading] = useState(false);

  const [parentDishesLoading, setParentDishesLoading] = useState(false);

  
  // Other State
  const [tables, setTables] = useState(() => {
    const saved = localStorage.getItem("hotelix_tables");
    return saved ? JSON.parse(saved) : initialTables;
  });

  const [dues, setDues] = useState(() => {
    const saved = localStorage.getItem("hotelix_dues");
    return saved ? JSON.parse(saved) : initialDues;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("hotelix_expenses");
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("hotelix_transactions");
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  
  // Cart State
  const [cartItems, setCartItems] = useState([]);

  const [activeCartTableId, setActiveCartTableId] = useState("t1");

  const [specialInstructions, setSpecialInstructions] = useState("");

  const [discount, setDiscount] = useState(0);

  
  // Fetch Parent Dishes
  const token = localStorage.getItem("token");

  // Fetch Parent Dishes
const fetchParentDishes = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token is required to fetch parent dishes.");
    return;
  }

  try {
    setParentDishesLoading(true);

    const response = await axios.get(
      `${BASE_URL}/dish/v1/get-all-parents`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data?.success) {
      setParentDishes(response.data.data || []);
    } else {
      setParentDishes([]);
    }
  } catch (error) {
    console.error(
      "Error fetching parent dishes:",
      error.response?.data || error.message
    );

    setParentDishes([]);
  } finally {
    setParentDishesLoading(false);
  }
};

useEffect(() => {
  fetchParentDishes();
}, []);


  // Fetch All Child Dishes
 const fetchDishes = async (parentDishId = null) => {
  if (!token) {
    console.error("Token is required to fetch dishes.");
    return;
  }

  try {
    setDishesLoading(true);

    const url = parentDishId
      ? `${BASE_URL}/dish/v1/get-childs/${parentDishId}`
      : `${BASE_URL}/dish/v1/get-all-childs`;

    console.log("Fetching dishes from:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data?.success) {
      const formattedDishes = (response.data.data || []).map(
        (dish) => ({
          id: dish.dishId,
          name: dish.dishName,
          price: Number(dish.price) || 0,
          description: dish.description || "",
          image: dish.imageUrl || "",
          tags: dish.tags
            ? dish.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            : [],
          category: "",
          isAvailable: true,
        })
      );

      setDishes(formattedDishes);
    } else {
      setDishes([]);
    }
  } catch (error) {
    console.error("Error fetching dishes:", error);
    setDishes([]);
  } finally {
    setDishesLoading(false);
  }
};

useEffect(() => {
  fetchDishes();
}, []);
  // Local Storage
  useEffect(() => {
    localStorage.setItem("hotelix_user", JSON.stringify(user));

    localStorage.setItem("hotelix_auth", isAuthenticated ? "true" : "false");
  }, [user, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("hotelix_tables", JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem("hotelix_dues", JSON.stringify(dues));
  }, [dues]);

  useEffect(() => {
    localStorage.setItem("hotelix_expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("hotelix_transactions", JSON.stringify(transactions));
  }, [transactions]);

  
  // Order / Table Functions
  

  const addOrderToTable = (tableId, orderTotal, itemsCount) => {
    setTables((prev) =>
      prev.map((tbl) => {
        if (tbl.id === tableId) {
          const existingAmount = tbl.totalAmount || 0;
          const existingCount = tbl.itemsOrderCount || 0;

          return {
            ...tbl,
            status: "Occupied",
            seatedTime: tbl.seatedTime || "5m seated",
            totalAmount: parseFloat((existingAmount + orderTotal).toFixed(2)),
            itemsOrderCount: existingCount + itemsCount,
          };
        }

        return tbl;
      }),
    );
  };

  
  // Cart Functions
  

  const addToCart = (dish) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.dish.id === dish.id);

      if (existingIdx > -1) {
        const next = [...prev];

        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + 1,
        };

        return next;
      }

      return [
        ...prev,
        {
          dish,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (dishId) => {
    setCartItems((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const adjustQuantity = (dishId, change) => {
    setCartItems((prev) => {
      return prev.map((item) => {
        if (item.dish.id === dishId) {
          const nextQuantity = item.quantity + change;

          return {
            ...item,
            quantity: Math.max(1, nextQuantity),
          };
        }

        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setSpecialInstructions("");
    setDiscount(0);
  };

  
  // Dish Management Functions
  const addDish = async (newDish) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const payload = {
      dishName: newDish.name,
      description: newDish.description || "",
      price: Number(newDish.price),
      imageUrl: newDish.image || "",
      parentDishId: Number(newDish.parentDishId),
      tags: Array.isArray(newDish.tags)
        ? newDish.tags.join(",")
        : newDish.tags || "",
    };

    const response = await axios.post(
      `${BASE_URL}/dish/v1/add-child-dish`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;

    if (!result.success) {
      throw new Error(result.message || "Failed to add dish");
    }

    // Refresh dishes from backend
    await fetchDishes();

    return result;
  } catch (error) {
    console.error(
      "Add dish error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to add dish"
    );
  }
};

  const updateDish = async (updatedDish) => {
  try {

    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const payload = {
      dishId: updatedDish.id,
      dishName: updatedDish.name,
      description: updatedDish.description,
      price: Number(updatedDish.price),
      imageUrl: updatedDish.image || "",
      tags: Array.isArray(updatedDish.tags)
        ? updatedDish.tags.join(",")
        : updatedDish.tags || "",
    };

    const response = await axios.put(
      `${BASE_URL}/dish/v1/update-child-dish`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = response.data;

    if (!result.success) {
      throw new Error(result.message || "Failed to update dish");
    }

    // Update frontend state with backend response
    const updatedData = result.data;

    setDishes((prev) =>
      prev.map((dish) =>
        dish.id === updatedData.dishId
          ? {
              ...dish,
              id: updatedData.dishId,
              name: updatedData.dishName,
              description: updatedData.description || "",
              price: Number(updatedData.price) || 0,
              image: updatedData.imageUrl || "",
              tags: updatedData.tags
                ? updatedData.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                : [],
            }
          : dish
      )
    );

    return result;
  } catch (error) {
    console.error(
      "Update dish error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to update dish"
    );
  }
};

  const deleteDish = async (childDishId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response = await axios.delete(
      `${BASE_URL}/dish/v1/remove-child-dish/${childDishId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = response.data;

    if (!result.success) {
      throw new Error(result.message || "Failed to delete dish");
    }

    // Remove from current UI immediately
    setDishes((prev) =>
      prev.filter((dish) => dish.id !== childDishId)
    );

    return result;
  } catch (error) {
    console.error(
      "Delete dish error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to delete dish"
    );
  }
};

  const toggleDishAvailability = (id) => {
    setDishes((prev) =>
      prev.map((dish) =>
        dish.id === id
          ? {
              ...dish,
              isAvailable: !dish.isAvailable,
            }
          : dish,
      ),
    );
  };

  const updateParentDish = async (parentDishId, parentDishName) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${BASE_URL}/dish/v1/update-parent-dish/${parentDishId}`,
      parentDishName,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain", // <-- Changed to text/plain
        },
      }
    );

    const result = response.data;

    if (!result.success) {
      throw new Error(result.message || "Failed to update category");
    }

    // Refresh parent categories
    await fetchParentDishes();

    return result;
  } catch (error) {
    console.error(
      "Update parent dish error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to update category"
    );
  }
};

const deleteParentDish = async (parentDishId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${BASE_URL}/dish/v1/remove-parent-dish/${parentDishId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = response.data;

    if (!result.success) {
      throw new Error(result.message || "Failed to delete category");
    }

    // Refresh parent categories
    await fetchParentDishes();

    // Refresh All dishes
    await fetchDishes();

    return result;
  } catch (error) {
    console.error(
      "Delete parent dish error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to delete category"
    );
  }
};

  
  // Context
  return (
    <AppContext.Provider
      value={{
        // User
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,

        // Dishes API
        dishes,
        parentDishes,
        dishesLoading,
        parentDishesLoading,
        fetchDishes,

        // Tables
        tables,

        // Cart
        cartItems,
        activeCartTableId,
        setActiveCartTableId,
        addToCart,
        removeFromCart,
        adjustQuantity,
        clearCart,

        // Billing
        specialInstructions,
        setSpecialInstructions,
        discount,
        setDiscount,

        // Orders
        addOrderToTable,

        // Dish management
        addDish,
        updateDish,
        deleteDish,
        toggleDishAvailability,

        // Other application data
        dues,
        setDues,
        expenses,
        setExpenses,
        transactions,
        setTransactions,

        updateParentDish,
    deleteParentDish,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};



// Custom Hook
export const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};
