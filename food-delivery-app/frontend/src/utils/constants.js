export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  PICKED_UP: "PICKED_UP",
  ON_THE_WAY: "ON_THE_WAY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "Order Placed",
  [ORDER_STATUS.CONFIRMED]: "Confirmed",
  [ORDER_STATUS.PREPARING]: "Preparing",
  [ORDER_STATUS.READY_FOR_PICKUP]: "Ready for Pickup",
  [ORDER_STATUS.PICKED_UP]: "Picked Up",
  [ORDER_STATUS.ON_THE_WAY]: "On the Way",
  [ORDER_STATUS.DELIVERED]: "Delivered",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: "#FFA500",
  [ORDER_STATUS.CONFIRMED]: "#2196F3",
  [ORDER_STATUS.PREPARING]: "#FF9800",
  [ORDER_STATUS.READY_FOR_PICKUP]: "#4CAF50",
  [ORDER_STATUS.PICKED_UP]: "#673AB7",
  [ORDER_STATUS.ON_THE_WAY]: "#3F51B5",
  [ORDER_STATUS.DELIVERED]: "#009688",
  [ORDER_STATUS.CANCELLED]: "#F44336",
};

export const CITIES = {
  SFAX: "Sfax",
  NYC: "New York City",
};

export const CUISINE_TYPES = [
  "Italian",
  "Mexican",
  "Chinese",
  "Indian",
  "American",
  "Mediterranean",
  "Fast Food",
  "Bakery",
  "French",
  "Japanese",
  "Thai",
  "Vietnamese",
  "Korean",
  "Middle Eastern",
  "Greek",
  "Spanish",
  "Brazilian",
  "Vegetarian",
  "Vegan",
  "Seafood",
  "Barbecue",
  "Pizza",
  "Burger",
  "Sushi",
  "Dessert",
];

export const PAYMENT_METHODS = {
  CARD: "card",
  CASH: "cash",
  DIGITAL_WALLET: "digital_wallet",
};

export const DELIVERY_FEE = 2.99;
export const TAX_RATE = 0.08;
export const MINIMUM_ORDER_AMOUNT = 5.0;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/me",
    UPDATE_PROFILE: "/auth/profile",
    UPDATE_PASSWORD: "/auth/password",
  },
  RESTAURANTS: {
    LIST: "/restaurants",
    NEARBY: "/restaurants/nearby",
    SEARCH: "/restaurants/search",
    DETAIL: "/restaurants",
    MENU: "/restaurants",
  },
  ORDERS: {
    CREATE: "/orders",
    LIST: "/orders",
    DETAIL: "/orders",
    TRACKING: "/orders",
    UPDATE_STATUS: "/orders",
  },
  USERS: {
    PROFILE: "/users/profile",
    ADDRESSES: "/users/addresses",
    ORDERS: "/users/orders",
  },
};
