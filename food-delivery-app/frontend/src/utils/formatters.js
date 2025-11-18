export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Date(date).toLocaleDateString("en-US", defaultOptions);
};

export const formatTime = (date, options = {}) => {
  const defaultOptions = {
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };

  return new Date(date).toLocaleTimeString("en-US", defaultOptions);
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

export const formatOrderStatus = (status) => {
  const statusLabels = {
    PENDING: "Order Placed",
    CONFIRMED: "Confirmed",
    PREPARING: "Preparing",
    READY_FOR_PICKUP: "Ready for Pickup",
    PICKED_UP: "Picked Up",
    ON_THE_WAY: "On the Way",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  return statusLabels[status] || status;
};

export const formatPhoneNumber = (phoneNumber) => {
  // Simple phone number formatting for US numbers
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }

  if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(
      7
    )}`;
  }

  return phoneNumber;
};

export const formatAddress = (address) => {
  if (!address) return "";

  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
  ].filter((part) => part && part.trim());

  return parts.join(", ");
};

export const calculateEstimatedDelivery = (preparationTime, distance) => {
  const preparationMinutes = preparationTime || 30;
  const travelMinutes = Math.ceil((distance || 5) * 3); // Assume 3 minutes per km
  const bufferMinutes = 10;

  const totalMinutes = preparationMinutes + travelMinutes + bufferMinutes;

  const deliveryTime = new Date();
  deliveryTime.setMinutes(deliveryTime.getMinutes() + totalMinutes);

  return {
    minutes: totalMinutes,
    time: deliveryTime,
    formatted: `${totalMinutes} min`,
  };
};

export const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + "...";
};
