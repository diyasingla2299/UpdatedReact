// import React, { useEffect, useState } from "react";
// import "./WishlistPage.css";

// const WishlistPage = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ------------------ Fetch wishlist items ------------------
//   const fetchWishlistItems = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // ✅ YOUR endpoint: @GetMapping("/items") in WishlistController
//       const response = await fetch("http://localhost:8888/api/wishlists/items");

//       if (!response.ok) {
//         throw new Error(
//           `Failed to load wishlist items (status ${response.status})`
//         );
//       }

//       const data = await response.json(); // List<Map<String, Object>>

//       // normalize keys coming from DAO like: wishlist_items_id, product_name, product_image_url, product_price
//       const normalized = (data || []).map((row) => ({
//         wishlistItemId:
//           row.wishlist_items_id ?? row.wishlistItemId ?? row.id,
//         productId: row.product_id ?? row.productId,
//         productName: row.product_name ?? row.productName,
//         imageUrl:
//           row.product_image_url ?? row.image_url ?? row.imageUrl ?? row.image,
//         price: row.product_price ?? row.productPrice ?? row.price,
//       }));

//       setItems(normalized);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWishlistItems();
//   }, []);

//   // ------------------ Remove from wishlist ------------------
//   // @DeleteMapping("/{wishlistItemId}") in WishlistItemController
//   const handleRemove = async (wishlistItemId) => {
//     if (!window.confirm("Remove this item from your wishlist?")) return;

//     try {
//       const response = await fetch(
//         `http://localhost:8888/api/wishlist-items/${wishlistItemId}`,
//         { method: "DELETE" }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to remove wishlist item");
//       }

//       setItems((prev) =>
//         prev.filter((item) => item.wishlistItemId !== wishlistItemId)
//       );
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   // ------------------ Move to Cart ------------------
//   // New endpoint we’ll add: POST /api/wishlist-items/{wishlistItemId}/move-to-cart
//   const handleMoveToCart = async (wishlistItemId) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8888/api/wishlist-items/${wishlistItemId}/move-to-cart`,
//         { method: "POST" }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to move item to cart");
//       }

//       // remove from wishlist UI after moving
//       setItems((prev) =>
//         prev.filter((item) => item.wishlistItemId !== wishlistItemId)
//       );
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="wishlist-page-wrapper">
//       <div className="wishlist-card">
//         <h1 className="wishlist-heading">My Wishlist</h1>
//         <p className="wishlist-sub">
//           Save items you love and move them to your cart when you're ready.
//         </p>

//         {loading && <p className="wishlist-info">Loading wishlist...</p>}
//         {error && <p className="wishlist-error">{error}</p>}

//         {!loading && !error && (
//           <>
//             <div className="wishlist-summary">
//               <span>{items.length} item(s) in your wishlist</span>
//             </div>

//             {items.length === 0 ? (
//               <p className="wishlist-info">
//                 Your wishlist is empty. Start exploring products!
//               </p>
//             ) : (
//               <div className="wishlist-items-box">
//                 {items.map((item) => (
//                   <div
//                     className="wishlist-row"
//                     key={item.wishlistItemId}
//                   >
//                     {/* image */}
//                     <div className="wishlist-product-img-wrap">
//                       {item.imageUrl && (
//                         <img
//                           src={item.imageUrl}
//                           alt={item.productName}
//                           className="wishlist-product-img"
//                         />
//                       )}
//                     </div>

//                     {/* product details */}
//                     <div className="wishlist-details">
//                       <div className="wishlist-product-name">
//                         {item.productName}
//                       </div>
//                       <div className="wishlist-price">
//                         ₹{(item.price ?? 0).toLocaleString("en-IN")}
//                       </div>
//                       <div className="wishlist-stock wishlist-stock-yes">
//                         In stock
//                       </div>
//                     </div>

//                     {/* actions */}
//                     <div className="wishlist-actions-cell">
//                       <button
//                         className="wishlist-btn-move"
//                         onClick={() =>
//                           handleMoveToCart(item.wishlistItemId)
//                         }
//                       >
//                         Move to Cart
//                       </button>

//                       <button
//                         className="wishlist-btn-remove"
//                         onClick={() =>
//                           handleRemove(item.wishlistItemId)
//                         }
//                         aria-label="Remove from wishlist"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WishlistPage;


import React, { useEffect, useState } from "react";
import "./WishlistPage.css";

const Toast = ({ message, type }) => (
  <div className={`toast toast-${type}`}>{message}</div>
);

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const token = localStorage.getItem("token");

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 2500);
  };

  // ---------------- Fetch Wishlist Items ----------------
  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:8888/api/wishlist/items", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Failed to load wishlist (status ${res.status})`);

      const wishlistData = await res.json();

      const normalizedItems = wishlistData.map((item) => ({
        wishlistItemId: item.wishlistItemsId ?? item.wishlist_items_id ?? item.id,
        productId: item.productId ?? item.product_id,
      }));

      // Fetch product details for each wishlist item
      const productsPromise = normalizedItems.map(async (wi) => {
        const resp = await fetch(`http://localhost:8888/api/products/${wi.productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resp.ok) throw new Error(`Failed to fetch product ${wi.productId}`);

        const product = await resp.json();

        return {
          wishlistItemId: wi.wishlistItemId,
          productId: wi.productId,
          name: product.productName,
          price: product.productPrice,
          imageUrl: product.imageUrl,
        };
      });

      const result = await Promise.all(productsPromise);
      setItems(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  // ---------------- Remove from Wishlist ----------------
  const handleRemove = async (wishlistItemId) => {
    try {
      const res = await fetch(`http://localhost:8888/api/wishlist-items/${wishlistItemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to remove item");

      setItems((prev) => prev.filter((i) => i.wishlistItemId !== wishlistItemId));
      showToast("Item removed from wishlist");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // ---------------- Move to Cart ----------------
  const handleMoveToCart = async (wishlistItemId, productId) => {
    try {
      // Get cart for user
      const cartRes = await fetch(`http://localhost:8888/api/carts/user/${localStorage.getItem("userId")}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let cartData = await cartRes.json();
      let cartId = cartData.cartId;

      // If user has no cart, create one
      if (!cartId) {
        const newCartRes = await fetch(`http://localhost:8888/api/carts/${localStorage.getItem("userId")}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const newCartData = await newCartRes.json();
        cartId = newCartData.cartId;
      }

      // Add product to cart
      const addRes = await fetch("http://localhost:8888/api/cart-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartId, productId, quantity: 1 }),
      });

      if (!addRes.ok) throw new Error("Failed to add item to cart");

      // Remove from wishlist
      await handleRemove(wishlistItemId);
      showToast("Moved to cart");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="wishlist-page-wrapper">
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      <div className="wishlist-card">
        <h1 className="wishlist-heading">My Wishlist</h1>
        <p className="wishlist-sub">Save items you love and manage them here.</p>

        {loading && <p className="wishlist-info">Loading wishlist...</p>}
        {error && <p className="wishlist-error">{error}</p>}

        {!loading && !error && (
          <>
            <div className="wishlist-summary">
              <span>{items.length} item(s) in your wishlist</span>
            </div>

            {items.length === 0 ? (
              <p className="wishlist-info">Your wishlist is empty.</p>
            ) : (
              <div className="wishlist-items-box">
                {items.map((item) => (
                  <div className="wishlist-row" key={item.wishlistItemId}>
                    <div className="wishlist-product-img-wrap">
                      <img
                        src={`/images/products/${item.imageUrl}`}
                        alt={item.name}
                        className="wishlist-product-img"
                      />
                    </div>

                    <div className="wishlist-details">
                      <div className="wishlist-product-name">{item.name}</div>
                      <div className="wishlist-price">
                        ₹{item.price.toLocaleString("en-IN")}
                      </div>
                      <div className="wishlist-stock wishlist-stock-yes">In stock</div>
                    </div>

                    <div className="wishlist-actions-cell">
                      <button
                        className="wishlist-btn-move"
                        onClick={() => handleMoveToCart(item.wishlistItemId, item.productId)}
                      >
                        Move to Cart
                      </button>
                      <button
                        className="wishlist-btn-remove"
                        onClick={() => handleRemove(item.wishlistItemId)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
