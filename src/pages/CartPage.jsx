// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import "./CartPage.css";

// ---------------- Toast Component ----------------
const Toast = ({ message, type }) => (
  <div className={`toast toast-${type}`}>{message}</div>
);

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartExists, setCartExists] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 2500);
  };

  const storedUserId = localStorage.getItem("userId");
  const storedRole = localStorage.getItem("role");
  const userId = storedUserId ? parseInt(storedUserId, 10) : null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId) {
      setError("User not found. Please login again.");
      setLoading(false);
      return;
    }

    if (storedRole !== "BUYER") {
      setError("Only buyers have a cart.");
      setLoading(false);
      return;
    }

    checkCartExists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, storedRole]);

  // -------- Check if cart exists --------
  const checkCartExists = async () => {
    try {
      const res = await fetch(
        `http://localhost:8888/api/carts/exists/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      const exists =
        typeof data === "boolean" ? data : data?.exists ?? false;

      setCartExists(exists);
      if (exists) fetchCartItems();
      else setLoading(false);
    } catch (err) {
      setError("Failed to check cart existence");
      setLoading(false);
    }
  };

  // -------- Fetch Cart Items --------
  const fetchCartItems = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8888/api/carts/userCart/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch cart items");

      const data = await res.json();

      // backend might return array OR { cartItems: [...] }
      const itemsArray = Array.isArray(data)
        ? data
        : Array.isArray(data.cartItems)
        ? data.cartItems
        : [];

      setItems(itemsArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------- Create Cart --------
  const handleCreateCart = async () => {
    try {
      await fetch(`http://localhost:8888/api/carts/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartExists(true);
      showToast("Cart created successfully!");
      fetchCartItems();
    } catch (err) {
      showToast("Failed to create cart", "error");
    }
  };

  // -------- Delete Cart Item --------
  const handleRemove = async (cartItemId) => {
    try {
      const res = await fetch(
        `http://localhost:8888/api/cart-items/${cartItemId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to delete item");
      showToast("Item removed from cart");
      fetchCartItems();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // -------- Update Quantity --------
  const handleQuantityChange = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await fetch(
        `http://localhost:8888/api/cart-items/${cartItemId}/quantity/${newQty}`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to update quantity");
      showToast("Quantity updated");
      fetchCartItems();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // -------- Move Item to Wishlist (REAL IMPLEMENTATION) --------
  const handleMoveToWishlist = async (item) => {
    try {
      const productId = item.productId ?? item.product_id;
      const cartItemId = item.cartItemsId;

      if (!productId) {
        throw new Error("Product id missing for this cart item");
      }

      // 1️⃣ Ensure wishlist exists or create new
      // Check if wishlist exists
      const existsRes = await fetch(
        `http://localhost:8888/api/wishlist/exists`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!existsRes.ok) {
        throw new Error("Failed to check wishlist existence");
      }

      const existsData = await existsRes.json();
      const exists =
        typeof existsData === "boolean"
          ? existsData
          : existsData?.exists ?? false;

      let wishlistId = null;

      if (!exists) {
        // Create wishlist
        const createRes = await fetch(`http://localhost:8888/api/wishlist`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!createRes.ok) {
          const txt = await createRes.text();
          throw new Error(txt || "Failed to create wishlist");
        }

        const created = await createRes.json();
        wishlistId =
          created.wishlistId ?? created.id ?? created.wishlist_id;
      } else {
        // Get my wishlist
        const myRes = await fetch(
          `http://localhost:8888/api/wishlist/my`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!myRes.ok) {
          const txt = await myRes.text();
          throw new Error(txt || "Failed to get wishlist");
        }

        const my = await myRes.json();
        wishlistId = my.wishlistId ?? my.id ?? my.wishlist_id;
      }

      if (!wishlistId) {
        throw new Error("Wishlist id not available");
      }

      // 2️⃣ Add item to wishlist
      const addRes = await fetch(
        `http://localhost:8888/api/wishlist-items`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wishlistId,
            productId,
          }),
        }
      );

      if (!addRes.ok) {
        const txt = await addRes.text();
        throw new Error(txt || "Failed to add to wishlist");
      }

      // 3️⃣ Remove item from cart
      await handleRemove(cartItemId);

      showToast(`"${item.productName}" moved to wishlist`, "success");
    } catch (err) {
      console.error("Move to wishlist error:", err);
      showToast(err.message || "Failed to move to wishlist", "error");
    }
  };

  const total = items.reduce((sum, item) => {
    const price = item.productPrice ?? 0;
    const qty = item.quantity ?? 1;
    return sum + price * qty;
  }, 0);

  return (
    <div className="cart-page-wrapper">
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      <h1 className="cart-heading">My Cart</h1>
      <p className="cart-sub">Review your products before checkout</p>

      {loading && <p className="cart-info">Loading cart...</p>}
      {error && <p className="cart-error">{error}</p>}

      {!loading && !cartExists && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={handleCreateCart}
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            Create Cart
          </button>
        </div>
      )}

      {/* Cart Items or Empty Message */}
      {!loading && cartExists && (
        <div className="cart-items-box">
          {items.length === 0 ? (
            <p className="cart-info">Your cart is empty.</p>
          ) : (
            items.map((item) => {
              const cartItemId = item.cartItemsId;
              const img = item.imageUrl;
              const name = item.productName ?? "Product";
              const qty = item.quantity ?? 1;
              const price = item.productPrice ?? 0;

              return (
                <div className="cart-row" key={cartItemId}>
                  <div className="cart-product-cell">
                    {img && (
                      <img
                        src={
                          img.startsWith("http")
                            ? img
                            : `http://localhost:8888/uploads/${img}`
                        }
                        alt={name}
                        className="cart-product-img"
                      />
                    )}
                    <span className="cart-product-name">{name}</span>
                  </div>

                  <div className="cart-qty-box">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantityChange(cartItemId, qty - 1)
                      }
                    >
                      -
                    </button>

                    <span className="qty-value">{qty}</span>

                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantityChange(cartItemId, qty + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <span>₹{price.toLocaleString("en-IN")}</span>

                  <button
                    className="cart-remove-btn"
                    onClick={() => handleRemove(cartItemId)}
                    title="Remove item"
                  >
                    ✕
                  </button>

                  <button
                    className="cart-wishlist-btn"
                    onClick={() => handleMoveToWishlist(item)}
                    title="Move to Wishlist"
                  >
                    ❤️
                  </button>
                </div>
              );
            })
          )}

          {/* Total Row */}
          <div className="cart-row cart-total">
            <span className="cart-product-cell cart-total-label">Total</span>
            <span></span>
            <span></span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>

          {/* Actions */}
          <div className="cart-actions">
            <button
              className="btn-back"
              onClick={() => (window.location.href = "/UserDashBoard")}
            >
              Continue Shopping
            </button>
            <button
              className="btn-checkout"
              onClick={() => (window.location.href = "/order")}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
