import {
  ADD_TO_CART,
  CLEAR_CART,
  COUNT_CART_TOTALS,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
} from "../actions";
import CartItem from "../components/CartItem";

const cart_reducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { id, color, amount, product } = action.payload;
      const tempItem = state.cart.find((item) => {
        return item.id === id + color;
      });
      if (tempItem) {
        const tempCart = state.cart.map((cartItem) => {
          if (cartItem.id === id + color) {
            let newAmount = cartItem.amount + amount;
            if (newAmount > cartItem.max) {
              newAmount = cartItem.max;
            }
            return { ...cartItem, amount: newAmount };
          } else {
            return cartItem;
          }
        });
        return { ...state, cart: tempCart };
      } else {
        const newItem = {
          id: id + color,
          name: product.name,
          color,
          amount,
          image: product.images[0].url,
          price: product.price,
          max: product.stock,
        };
        return { ...state, cart: [...state.cart, newItem] };
      }
      break;
    case REMOVE_CART_ITEM:
      const tempCart = state.cart.filter((item) => {
        return item.id !== action.payload;
      });
      return { ...state, cart: tempCart };
      break;
    case CLEAR_CART:
      return { ...state, cart: [] };
      break;
    case TOGGLE_CART_ITEM_AMOUNT:
      const { id: myId, value } = action.payload;
      const tempCarts = state.cart.map((item) => {
        if (item.id === myId) {
          if (value === "inc") {
            let newAmount = item.amount + 1;
            if (newAmount > item.max) {
              newAmount = item.max;
            }
            return { ...item, amount: newAmount };
          }
          if (value === "dec") {
            let newAmount = item.amount - 1;
            if (newAmount < 1) {
              newAmount = 1;
            }
            return { ...item, amount: newAmount };
          }
        } else {
          return item;
        }
      });
      return { ...state, cart: tempCarts };
      break;
    case COUNT_CART_TOTALS:
      const { total_amount, total_item } = state.cart.reduce(
        (total, cartItem) => {
          const { amount, price } = cartItem;

          total.total_item += amount;
          total.total_amount += amount * price;
          return total;
        },
        { total_item: 0, total_amount: 0 }
      );
      return { ...state, total_amount, total_item };
  }

  throw new Error(`No Matching "${action.type}" - action type`);
};

export default cart_reducer;
