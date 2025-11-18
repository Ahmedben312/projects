export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s\-\(\)]{10,}$/;
  return re.test(phone);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateAddress = (address) => {
  return address && address.street && address.city && address.zipCode;
};

export const validateCreditCard = (cardNumber) => {
  // Simple Luhn algorithm validation
  const cleaned = cardNumber.replace(/\s/g, "");

  if (!/^\d+$/.test(cleaned)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const validateExpiryDate = (expiry) => {
  const re = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!re.test(expiry)) {
    return false;
  }

  const [month, year] = expiry.split("/");
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  const expiryYear = parseInt(year, 10);
  const expiryMonth = parseInt(month, 10);

  if (expiryYear < currentYear) {
    return false;
  }

  if (expiryYear === currentYear && expiryMonth < currentMonth) {
    return false;
  }

  return true;
};

export const validateCVV = (cvv) => {
  const re = /^[0-9]{3,4}$/;
  return re.test(cvv);
};

export const validateZipCode = (zipCode) => {
  const re = /^[0-9]{5}(-[0-9]{4})?$/;
  return re.test(zipCode);
};

export const validateOrderItems = (items) => {
  return (
    items &&
    items.length > 0 &&
    items.every((item) => item.quantity > 0 && item.price > 0)
  );
};

export const getValidationErrors = (field, value, rules) => {
  const errors = [];

  if (rules.required && (!value || value.toString().trim() === "")) {
    errors.push("This field is required");
  }

  if (rules.minLength && value && value.length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters`);
  }

  if (rules.maxLength && value && value.length > rules.maxLength) {
    errors.push(`Must be no more than ${rules.maxLength} characters`);
  }

  if (rules.email && value && !validateEmail(value)) {
    errors.push("Must be a valid email address");
  }

  if (rules.phone && value && !validatePhone(value)) {
    errors.push("Must be a valid phone number");
  }

  if (rules.min && value !== undefined && value < rules.min) {
    errors.push(`Must be at least ${rules.min}`);
  }

  if (rules.max && value !== undefined && value > rules.max) {
    errors.push(`Must be no more than ${rules.max}`);
  }

  return errors;
};
