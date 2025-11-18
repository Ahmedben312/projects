// Small mock dataset for development without backend
export const restaurants = [
  {
    _id: "r1",
    name: "La Piazza",
    cuisine: "Italian",
    description: "Authentic wood-fired pizzas and fresh pasta.",
    rating: 4.6,
    deliveryTime: 30,
    image: "https://via.placeholder.com/400x200?text=La+Piazza",
    address: { city: "Springfield" },
    isActive: true,
  },
  {
    _id: "r2",
    name: "Sushi Central",
    cuisine: "Japanese",
    description: "Fresh sushi, sashimi and rolls.",
    rating: 4.8,
    deliveryTime: 25,
    image: "https://via.placeholder.com/400x200?text=Sushi+Central",
    address: { city: "Springfield" },
    isActive: true,
  },
  {
    _id: "r3",
    name: "Burger House",
    cuisine: "American",
    description: "Juicy burgers and hand-cut fries.",
    rating: 4.2,
    deliveryTime: 20,
    image: "https://via.placeholder.com/400x200?text=Burger+House",
    address: { city: "Shelbyville" },
    isActive: true,
  },
];

export const menus = {
  r1: [
    {
      _id: "m1",
      name: "Margherita Pizza",
      price: 9.99,
      description: "Tomato, mozzarella, basil",
      isAvailable: true,
    },
    {
      _id: "m2",
      name: "Penne Arrabiata",
      price: 11.5,
      description: "Spicy tomato sauce",
      isAvailable: true,
    },
  ],
  r2: [
    {
      _id: "m3",
      name: "Salmon Nigiri",
      price: 6.5,
      description: "Two pieces",
      isAvailable: true,
    },
    {
      _id: "m4",
      name: "California Roll",
      price: 8.0,
      description: "Crab, avocado, cucumber",
      isAvailable: true,
    },
  ],
  r3: [
    {
      _id: "m5",
      name: "Classic Burger",
      price: 7.99,
      description: "Beef patty, lettuce, tomato",
      isAvailable: true,
    },
    {
      _id: "m6",
      name: "Fries",
      price: 2.99,
      description: "Crispy fries",
      isAvailable: true,
    },
  ],
};

export const sampleOrder = {
  _id: "o1",
  status: "prepared",
  restaurantId: "r1",
  items: [
    { menuItemId: "m1", name: "Margherita Pizza", quantity: 1, price: 9.99 },
  ],
  driver: { name: "Alex", location: { latitude: 40.0, longitude: -74.0 } },
  updates: ["Order received", "Preparing", "Ready for pickup"],
};
