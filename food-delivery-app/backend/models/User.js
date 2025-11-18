const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    addresses: [
      {
        label: {
          type: String,
          required: true,
        },
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        zipCode: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          default: "USA",
        },
        location: {
          type: {
            type: String,
            enum: ["Point"],
            default: "Point",
          },
          coordinates: {
            type: [Number],
            default: [0, 0],
          },
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
      cuisine: [String],
      dietaryRestrictions: [String],
    },
    role: {
      type: String,
      enum: ["customer", "restaurant_owner", "admin"],
      default: "customer",
    },
    stripeCustomerId: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ "addresses.location": "2dsphere" });
userSchema.index({ email: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.addAddress = function (addressData) {
  // If this is the first address or marked as default, set as default
  if (this.addresses.length === 0 || addressData.isDefault) {
    this.addresses.forEach((addr) => (addr.isDefault = false));
    this.addresses.push(addressData);
  } else {
    this.addresses.push(addressData);
  }
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
