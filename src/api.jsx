import axios from "axios";
import { decryptResponse } from "./utils/decrypt";

import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import pako from "pako";

export const API_BASE_URL = "https://tradingback.online/";
export const API_BASE_URL2 = "https://tradingback.online";
// export const API_BASE_URL = "http://localhost:5004/";
// export const API_BASE_URL2 = "http://localhost:5004";



export const SECRET_KEY = "SECRET_KEY12356789";

export const gettoken = () => { 
  const token = Cookies.get("treding");
  return token;
};

//  Get user data
export const getUserData = async () => {
  const encryptedUser = Cookies.get("tredingUser");
  if (encryptedUser) {
    const base64 = encryptedUser.replace(/-/g, "+").replace(/_/g, "/");
    const decryptedBase64 = CryptoJS.AES.decrypt(base64, SECRET_KEY).toString(
      CryptoJS.enc.Utf8,
    );
    if (!decryptedBase64) return null;
    const binaryString = atob(decryptedBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decompressed = pako.inflate(bytes, { to: "string" });
    const data = await JSON.parse(decompressed);
    const User = data;

    return User;
  } else null;
};

export const tokenVerify = async (token, phone) => {
  const res = await axios.get(`${API_BASE_URL}api/users/tokenVerify`, {
    params: { token, phone },
  });
  return res;
};

export const sendOtp = async (phone) => {
  const res = await fetch(`${API_BASE_URL}api/users/verifyLogin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const json = await res.json();
  return decryptResponse(json.payload);
};

export const verifyRegisterOtp = async (phone) => {
  const res = await fetch(`${API_BASE_URL}api/users/verifyRegisterOtp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const json = await res.json();
  return decryptResponse(json.payload);
};

export const sendOtpNoCheck = async (phone) => {
  const res = await fetch(`${API_BASE_URL}api/users/sendOtp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const json = await res.json();

  return decryptResponse(json.payload);
};

export const getRandomUPI = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}api/upi/random`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await res.json();
  } catch (err) {
    console.error("Error fetching random UPI", err);
    return { success: false, message: "Network error" };
  }
};

export const verifyRefCode = async (refCode) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}api/users/verify-ref`,
      { params: { refCode } }, // 🔥 query param
    );
    const data = await res.json();

    return data.data;
  } catch (err) {
    console.error("Error verifying referral code:", err);
    throw err;
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}api/users/register`, userData);
    return res.data;
  } catch (err) {
    console.error("Error registering user:", err);
    throw err;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${API_BASE_URL}api/users/login`, credentials);
    return res.data;
  } catch (err) {
    console.error("Error logging in:", err);
    throw err;
  }
};

export const handleSendOtp = async (phone) => {
  try {
    const data = await sendOtp(phone);
    if (data.success) {
      var GeneratedOtp = data?.data?.otp || "123456";
    }
  } catch (err) {
    console.error(err);
    alert("Error sending OTP");
  }
};

export const handleVerifyOtp = (otp, generatedOtp) => {
  if (otp == generatedOtp) {
    alert("OTP verified! You can now set new password.");
  } else {
    alert("Invalid OTP");
  }
};

export const callForgetPass = async (newPassword, phone) => {
  if (!newPassword) return alert("Enter new password");
  try {
    const res = await fetch(`${API_BASE_URL}api/users/forget-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        type: "password",
        confirmPassword: newPassword,
      }),
    });
    const data = await res.json();

    if (data.token && data.user) {
      const jsonString = JSON.stringify(data.user);

      const compressed = pako.deflate(jsonString);

      const compressedBase64 = btoa(String.fromCharCode(...compressed));

      const encryptedUser = CryptoJS.AES.encrypt(
        compressedBase64,
        SECRET_KEY,
      ).toString();

      const base64url = encryptedUser
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      Cookies.set("TradingStockToken", data.token, { expires: 7, path: "/" });
      Cookies.set("TradingStockUser", base64url, { expires: 7, path: "/" });

      localStorage.setItem("userData", JSON.stringify(base64url));

      alert(data.message || "Login successful");

      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const productGet = async () => {
  const data = await fetch(`${API_BASE_URL}api/products`);
  return data;
};
export const qRrandom = async () => {
  const data = await fetch(`${API_BASE_URL}QR/api/qr/random`);
  return data;
};

export const buyProduct = async (payload) => {
  const token = gettoken();
  console.log(token);

  if (token) {
    const data = await getUserData();

    payload.userId = data._id;
    console.log(payload);
  }
  const res = await axios.post(`${API_BASE_URL}QR/api/buy-stock`, payload);
  return res;
};

export const sellProduct = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}QR/api/sell-stock`, payload);
  return res;
};

export const fetchUserData = async (userId) => {
  try {
    const [accountRes, purchaseRes] = await Promise.all([
      axios.get(`${API_BASE_URL}api/users/account_data`, {
        params: { userId },
      }),
      axios
        .get(`${API_BASE_URL}api/users/purchase`, { params: { userId } })
        .catch(() => ({ data: { data: { purchases: [] } } })),
    ]);

    let updatedData = {};

    if (accountRes?.data?.success) {
      updatedData = {
        accountData: accountRes.data.data,
        purchases: purchaseRes?.data?.data?.purchasesWithStock || [],
        soldStockHistory:purchaseRes?.data?.data?.soldStockHistory||[],
      };
    }

    return updatedData;
  } catch (error) {
    console.error("Critical error fetching user data:", error);
    throw error;
  }
};
export const rechargeBalence = async (payload) => {
  const token = gettoken();
  console.log(token);

  if (token) {
    const data = await getUserData();

    payload.userId = data._id;
    console.log(payload);
  }
  const res = await axios.post(`${API_BASE_URL}QR/api/recharge`, payload);
  return res;
};

export const getBankDetails = async (userId) => {
  const res = await axios.get(`${API_BASE_URL}api/withdraw/bank`, {
    params: { userId },
  });
  return res;
};

export const addBankDetails = async (payload) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}api/withdraw/bank-details`,
      payload,
    );
    return res.data;
  } catch (err) {
    console.error("Add Bank Details Error:", err);
    throw err.response?.data || err;
  }
};

export const updateBankDetails = async (payload) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}api/withdraw/bank-details/${payload.userId}`,
      payload,
    );
    return res;
  } catch (err) {
    console.error("Update Bank Details Error:", err);
    throw err.response?.data || err;
  }
};

export const withdrawReq = async (payload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}api/withdraw`, payload);
    return res;
  } catch (err) {
    console.error("Withdraw Request Error:", err);
    throw err.response?.data || err;
  }
};

export const getUserInfo = async (userId) => {
  const res = await axios.get(`${API_BASE_URL}api/users/user`, {
    params: { userId },
  });
  return res;
};

export const getSocialLinks = async () => {
  const res = await axios.get(`${API_BASE_URL}api/SocialMedia`);
  return res.data.data;
};
// -----------------------------
export async function fetchStocks() {
  const res = await fetch(`${API_BASE_URL}api/products`);
  return res.json();
}
export async function get_by_id_Stock(id) {
  const res = await fetch(
    `${API_BASE_URL}api/products/getProductById?id=${id}`,
  );
  return res.json();
}

