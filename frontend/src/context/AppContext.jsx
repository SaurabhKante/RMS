import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { BASE_URL } from "../constants/baseUrl";

const AppContext = createContext(undefined);

// App Provider
export const AppProvider = ({ children }) => {
  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);

  const [activeCartTableId, setActiveCartTableId] = useState(null);

  const [cartItems, setCartItems] = useState([]);

  const [pendingOrder, setPendingOrder] = useState(null);
  const [pendingOrderLoading, setPendingOrderLoading] = useState(false);

  const [discount, setDiscount] = useState(0);

  // User / Authentication
  const [user, setUser] = useState(() => {
  const saved = localStorage.getItem("hotelix_user");
  return saved ? JSON.parse(saved) : null;
});

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("hotelix_auth") === "true" || true;
  });

  // Dish API State
  const [dishes, setDishes] = useState([]);

  const [parentDishes, setParentDishes] = useState([]);

  const [dishesLoading, setDishesLoading] = useState(false);

  const [parentDishesLoading, setParentDishesLoading] = useState(false);

  const fetchTables = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token is required to fetch tables.");
      return;
    }

    try {
      setTablesLoading(true);

      const response = await axios.get(`${BASE_URL}/table/v1/get-all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;

      console.log("Tables API Response:", result);

      if (result.success) {
        setTables(result.data || []);
      } else {
        setTables([]);
      }
    } catch (error) {
      console.error(
        "Error fetching tables:",
        error.response?.data || error.message,
      );

      setTables([]);
    } finally {
      setTablesLoading(false);
    }
  }, []);

  const [dues, setDues] = useState(() => {
  const saved = localStorage.getItem("hotelix_dues");
  return saved ? JSON.parse(saved) : [];
});

const [expenses, setExpenses] = useState(() => {
  const saved = localStorage.getItem("hotelix_expenses");
  return saved ? JSON.parse(saved) : [];
});

const [transactions, setTransactions] = useState(() => {
  const saved = localStorage.getItem("hotelix_transactions");
  return saved ? JSON.parse(saved) : [];
});

  const [specialInstructions, setSpecialInstructions] = useState("");

  // Fetch Parent Dishes
  const fetchParentDishes = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token is required to fetch parent dishes.");
      return;
    }

    try {
      setParentDishesLoading(true);

      const response = await axios.get(`${BASE_URL}/dish/v1/get-all-parents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Parent Dishes API Response:", response.data);

      if (response.data?.success) {
        setParentDishes(response.data.data || []);
      } else {
        setParentDishes([]);
      }
    } catch (error) {
      console.error(
        "Error fetching parent dishes:",
        error.response?.data || error.message,
      );

      setParentDishes([]);
    } finally {
      setParentDishesLoading(false);
    }
  }, []);

  const addDishToTableOrder = async (tableId, dishId) => {
    if (!tableId || !dishId) {
      console.error("tableId and dishId are required");
      return false;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/order/v1/add-dish/${tableId}/${dishId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = response.data;

      console.log("Add Dish Response:", result);

      if (result.success) {
        // Backend response contains data: null.
        // Fetch the updated order from backend.
        await fetchPendingOrder(tableId);

        return true;
      }

      alert(result.message || "Failed to add dish to order.");
      return false;
    } catch (error) {
      console.error(
        "Error adding dish to order:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert(
          error.response?.data?.message ||
          "Something went wrong while adding dish to order.",
        );
      }

      return false;
    }
  };

  const decreaseDishQuantity = async (tableId, dishId) => {
    if (!tableId || !dishId) {
      console.error("tableId and dishId are required");
      return false;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/order/v1/decrease/${tableId}/${dishId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = response.data;

      console.log("Decrease Dish Quantity Response:", result);

      if (result.success) {
        // Fetch latest order from backend
        await fetchPendingOrder(tableId);

        return true;
      }

      alert(result.message || "Failed to decrease dish quantity.");
      return false;
    } catch (error) {
      console.error(
        "Error decreasing dish quantity:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert(
          error.response?.data?.message ||
          "Something went wrong while decreasing dish quantity.",
        );
      }

      return false;
    }
  };

  const removeDishFromTableOrder = async (tableId, dishId) => {
    if (!tableId || !dishId) {
      console.error("tableId and dishId are required");
      return false;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Authentication token not found. Please login again.");
        return false;
      }

      const response = await axios.delete(
        `${BASE_URL}/order/v1/remove-dish/${tableId}/${dishId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = response.data;

      console.log("Remove Dish Response:", result);

      if (!result.success) {
        alert(result.message || "Failed to remove dish from order.");
        return false;
      }

      /*
       * Refresh the order after deleting the dish.
       *
       * fetchPendingOrder() will check whether
       * any items are remaining.
       */
      await fetchPendingOrder(tableId);

      return true;
    } catch (error) {
      console.error(
        "Error removing dish from order:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert(
          error.response?.data?.message ||
          "Something went wrong while removing dish from order."
        );
      }

      return false;
    }
  };

  const fetchPendingOrder = useCallback(async (tableId) => {
    const token = localStorage.getItem("token");

    if (!token || !tableId) {
      return;
    }

    try {
      setPendingOrderLoading(true);

      const response = await axios.get(
        `${BASE_URL}/order/v1/pending-order/${tableId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = response.data;

      console.log(`Pending order for table ${tableId}:`, result);

      if (result.success && result.data) {
        const order = result.data;

        setPendingOrder(order);

        const formattedCartItems = (order.orderItems || []).map((item) => ({
          dish: {
            id: item.dishId,
            name: item.dishName,
            price: Number(item.price) || 0,
            description: "",
            image: "",
            tags: [],
            category: "",
            isAvailable: true,
          },
          quantity: item.quantity,
        }));

        setCartItems(formattedCartItems);
        setDiscount(Number(order.discount) || 0);
      } else {
        setPendingOrder(null);
        setCartItems([]);
        setDiscount(0);
      }
    } catch (error) {
      console.error(
        `Error fetching pending order for table ${tableId}:`,
        error.response?.data || error.message,
      );

      setPendingOrder(null);
      setCartItems([]);
      setDiscount(0);
    } finally {
      setPendingOrderLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   if (activeCartTableId !== null) {
  //     console.log("Active table changed:", activeCartTableId);

  //     fetchPendingOrder(activeCartTableId);
  //   }
  // }, [activeCartTableId]);


  // Fetch All Child Dishes
  const fetchDishes = useCallback(async (parentDishId = null) => {
    const token = localStorage.getItem("token");

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
        const formattedDishes = (response.data.data || []).map((dish) => ({
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
        }));

        setDishes(formattedDishes);
      } else {
        setDishes([]);
      }
    } catch (error) {
      console.error(
        "Error fetching dishes:",
        error.response?.data || error.message,
      );

      setDishes([]);
    } finally {
      setDishesLoading(false);
    }
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

  const adjustQuantity = async (tableId, dishId, change) => {
    if (!tableId || !dishId) {
      console.error("tableId and dishId are required");
      return false;
    }

    if (change > 0) {
      return await addDishToTableOrder(tableId, dishId);
    }

    if (change < 0) {
      return await decreaseDishQuantity(tableId, dishId);
    }

    return false;
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
        },
      );

      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || "Failed to add dish");
      }

      // Refresh dishes from backend
      await fetchDishes();

      return result;
    } catch (error) {
      console.error("Add dish error:", error.response?.data || error.message);

      throw new Error(error.response?.data?.message || "Failed to add dish");
    }
  };

  const processPayment = async ({
    tableId,
    discount = 0,
    payments,
    dueDetails = null,
  }) => {
    if (!tableId) {
      alert("Table is required.");
      return false;
    }

    if (!payments || payments.length === 0) {
      alert("Please select a payment method.");
      return false;
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        tableId: Number(tableId),
        discount: Number(discount) || 0,

        payments: payments.map((payment) => ({
          paymentMethod: payment.paymentMethod,
          amount: Number(payment.amount),

          ...(payment.transactionId
            ? {
              transactionId: payment.transactionId,
            }
            : {}),
        })),

        ...(dueDetails
          ? {
            dueDetails: {
              customerName: dueDetails.customerName,
              mobileNumber: dueDetails.mobileNumber,
            },
          }
          : {}),
      };

      console.log("Processing payment:", payload);

      const response = await axios.post(
        `${BASE_URL}/payment/v1/process-payment`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = response.data;

      console.log("Payment Response:", result);

      if (result.success) {
        // Refresh pending order.
        // Backend should now return no pending order because
        // the order has been completed.
        await fetchPendingOrder(tableId);

        // Refresh tables so table status/amount is updated.
        await fetchTables();

        return result;
      }

      alert(result.message || "Payment processing failed.");
      return false;
    } catch (error) {
      console.error(
        "Process payment error:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert(
          error.response?.data?.message ||
          "Something went wrong while processing payment.",
        );
      }

      return false;
    }
  };

  const updateDish = async (updatedDish) => {
    try {
      const token = localStorage.getItem("token");

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

        // Add the selected parent/category ID
        parentDishId: updatedDish.parentDishId,
      };

      console.log("Updating dish payload:", payload);

      const response = await axios.put(
        `${BASE_URL}/dish/v1/update-child-dish`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      console.log("Update dish response:", result);

      if (!result.success) {
        throw new Error(
          result.message || "Failed to update dish"
        );
      }

      // Refresh dishes after successful update
      await fetchDishes();

      return result;

    } catch (error) {
      console.error(
        "Update dish error:",
        error.response?.data || error.message
      );

      throw new Error(
        error.response?.data?.message ||
        "Failed to update dish"
      );
    }
  };


  const deleteDish = async (childDishId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${BASE_URL}/dish/v1/remove-child-dish/${childDishId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || "Failed to delete dish");
      }

      // Remove from current UI immediately
      setDishes((prev) => prev.filter((dish) => dish.id !== childDishId));

      return result;
    } catch (error) {
      console.error(
        "Delete dish error:",
        error.response?.data || error.message,
      );

      throw new Error(error.response?.data?.message || "Failed to delete dish");
    }
  };

  const deletePendingOrder = async (tableId) => {
    if (!tableId) {
      console.error("tableId is required");
      return false;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${BASE_URL}/order/v1/delete-pending-order/${tableId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = response.data;

      console.log("Delete Pending Order Response:", result);

      if (result.success) {
        // Clear frontend pending order state
        setPendingOrder(null);
        setCartItems([]);
        setDiscount(0);
        setSpecialInstructions("");

        return true;
      }

      alert(result.message || "Failed to clear pending order.");
      return false;
    } catch (error) {
      console.error(
        "Delete pending order error:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert(
          error.response?.data?.message ||
          "Something went wrong while clearing the order.",
        );
      }

      return false;
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
        },
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
        error.response?.data || error.message,
      );

      throw new Error(
        error.response?.data?.message || "Failed to update category",
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
        },
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
        error.response?.data || error.message,
      );

      throw new Error(
        error.response?.data?.message || "Failed to delete category",
      );
    }
  };

  // ─── S3 Image Upload ───────────────────────────────────────────────────────
  /**
   * Uploads a dish image File to S3 via the backend upload endpoint.
   * Returns the public S3 URL string on success.
   * Throws an Error on failure.
   */
  const uploadDishImage = async (file) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${BASE_URL}/dish/v1/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const result = response.data;

      console.log("Upload dish image response:", result);

      if (!result.success) {
        throw new Error(result.message || "Image upload failed.");
      }

      // Backend returns: { data: { imageUrl: "https://..." } }
      const imageUrl = result.data?.imageUrl || result.data;

      if (!imageUrl) {
        throw new Error("No image URL returned from server.");
      }

      return imageUrl;
    } catch (error) {
      console.error(
        "Upload dish image error:",
        error.response?.data || error.message,
      );

      throw new Error(
        error.response?.data?.message || error.message || "Failed to upload image.",
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

        // Tables
        tables,
        tablesLoading,
        fetchTables,

        // Active Table
        activeCartTableId,
        setActiveCartTableId,

        // Pending Order
        pendingOrder,
        pendingOrderLoading,
        fetchPendingOrder,

        // Dishes API
        dishes,
        parentDishes,
        dishesLoading,
        parentDishesLoading,
        fetchDishes,
        fetchParentDishes,

        // Cart
        cartItems,
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
        deletePendingOrder,
        addDishToTableOrder,
        decreaseDishQuantity,
        removeDishFromTableOrder,
        processPayment,

        // Dish management
        addDish,
        updateDish,
        deleteDish,
        toggleDishAvailability,
        updateParentDish,
        deleteParentDish,
        uploadDishImage,

        // Other application data
        dues,
        setDues,
        expenses,
        setExpenses,
        transactions,
        setTransactions,
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
