import React, { useState } from "react";
import {
  Loader2,
  ChevronRight,
  User,
  Lock,
  TrendingUp,
  TicketCheck,
  ShieldCheck,
} from "lucide-react";
import Cookies from "js-cookie";
import pako from "pako";
import CryptoJS from "crypto-js";
import {
  callForgetPass,
  sendOtp,
  verifyRegisterOtp,
  registerUser,
  verifyRefCode,
  loginUser,
  SECRET_KEY,
} from "./api";
import "./Login_register_forget.css";
import { useNavigate } from "react-router-dom";

const isValidIndianMobile = (number) => /^[6-9]\d{9}$/.test(number);

const ConsoleInput = ({
  label,
  icon: Icon,
  prefix,
  prefixIcon: PrefixIcon,
  actionLabel,
  onActionClick,
  disabled,
  ...props
}) => (
  <div className="input-group">
    {label && <label>{label}</label>}
    <div className="input-box">
      {prefix && <span className="prefix">{prefix}</span>}
      {PrefixIcon && <PrefixIcon size={18} className="prefix-icon" />}
      {Icon && <Icon size={18} className="icon" />}
      <input disabled={disabled} {...props} />
      {actionLabel && (
        <button
          type="button"
          className="input-action-btn"
          onClick={onActionClick}
        >
          {actionLabel}
        </button>
      )}
    </div>
  </div>
);

const Login_register_forget = () => {
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [tradePassword, setTradePassword] = useState("");
  const [refCode, setRefCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [refVerified, setRefVerified] = useState(false);
  // 🔄 Reset everything when switching views
  const resetForm = () => {
    setPhone("");
    setOtp("");
    setGeneratedOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setName("");
    setPassword("");
    setTradePassword("");
    setRefCode("");
    setNewPassword("");
  };

  const handleVerifyRefCode = async () => {
    if (!refCode) return alert("Enter referral code");

    setLoading(true);
    try {
      const data = await verifyRefCode(refCode);

      if (data.success) {
        setRefVerified(true);
        alert("Referral Code Verified ✅");
      } else {
        setRefVerified(false);
        alert(data.message || "Invalid Referral Code ❌");
      }
    } catch (err) {
      console.log("Verify Ref Error:", err);

      const backendMessage =
        err.response?.data?.message || "Verification failed ❌";

      alert(backendMessage); // 🔥 show backend message
      setRefVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const RegisterOtp = async () => {
    if (!phone) return alert("Enter phone number");
    if (!isValidIndianMobile(phone)) return alert("Invalid mobile number");

    setLoading(true);
    try {
      const data = await verifyRegisterOtp(phone);
      if (data.success) {
        setGeneratedOtp(data?.data?.otp || "123456");
        setOtpSent(true);
        alert("Registration OTP Sent ✅");
      } else {
        alert(data.message || "Number already registered ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone) return alert("Enter phone number");
    if (!isValidIndianMobile(phone)) return alert("Invalid mobile number");

    setLoading(true);
    try {
      const data = await sendOtp(phone);
      if (data.success) {
        setGeneratedOtp(data?.data?.otp || "123456");
        setOtpSent(true);
        alert("OTP Sent ✅");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp.toString()) {
      setOtpVerified(true);
      alert("OTP Verified 🎉");
    } else {
      alert("Invalid OTP");
    }
  };

  const handleForgotPassword = async () => {
    if (!otpVerified) return alert("Verify OTP first");
    if (newPassword.length < 6)
      return alert("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res = await callForgetPass(newPassword, phone);
      if (res.success) {
        alert("Password Updated 🔐");
        resetForm();
        setView("login");
      } else alert("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (loading) return "Wait Work in Process.";
    if (!otpVerified) return alert("Verify OTP first");
    if (!name || !password || !tradePassword) return alert("Fill all fields");

    setLoading(true);

    try {
      setLoading(true);
      Cookies.remove("treding");
      Cookies.remove("tredingUser");
      const response = await registerUser({
        phone,
        name,
        password,
        tradePassword,
        refCode,
      });

      if (response.token) {
        const jsonString = JSON.stringify(response.user);

        // ✅ 2. Compress and get Uint8Array
        const compressed = pako.deflate(jsonString);

        // ✅ 3. Convert compressed binary → Base64 string
        const compressedBase64 = btoa(String.fromCharCode(...compressed));

        // ✅ 4. Encrypt compressed Base64
        const encryptedUser = CryptoJS.AES.encrypt(
          compressedBase64,
          SECRET_KEY,
        ).toString();

        // ✅ 5. Make Base64URL safe (optional)
        const base64url = encryptedUser
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        Cookies.set("treding", response.token, { expires: 7, path: "/" });
        Cookies.set("tredingUser", base64url, { expires: 7, path: "/" });

        alert(response.message || "Registered successfully!");

        setTimeout(() => navigate("/"), 200);
      } else {
        alert(response.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      alert("Phone and password are required");
      return;
    }

    const credentials = { phone, password };

    try {
      Cookies.remove("treding");
      Cookies.remove("tredingUser");
      const response = await loginUser(credentials);

      if (response.token && response.user) {
        // ✅ 1. Convert to JSON string
        const jsonString = JSON.stringify(response.user);

        // ✅ 2. Compress and get Uint8Array
        const compressed = pako.deflate(jsonString);

        // ✅ 3. Convert compressed binary → Base64 string
        const compressedBase64 = btoa(String.fromCharCode(...compressed));

        // ✅ 4. Encrypt compressed Base64
        const encryptedUser = CryptoJS.AES.encrypt(
          compressedBase64,
          SECRET_KEY,
        ).toString();

        // ✅ 5. Make Base64URL safe (optional)
        const base64url = encryptedUser
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        // ✅ 6. Store securely
        Cookies.set("treding", response.token, { expires: 7, path: "/" });
        Cookies.set("tredingUser", base64url, { expires: 7, path: "/" });

        alert(response.message || "Login successful");

        setTimeout(() => navigate("/"), 200);
      } else {
        alert("Invalid response from server");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <nav className="auth-nav">
        <div className="nav-brand">
          <TrendingUp size={28} />
          <div>
            <span className="brand-title">VERTEX</span>
            <span className="brand-sub">CAPITAL HUB</span>
          </div>
        </div>
      </nav>

      <main className="auth-split-layout">
        <div className="auth-info-panel">
          <div className="auth-info-content">
            <h2 className="auth-hero-text">
              MANAGE YOUR <br /> <span>WEALTH</span> SMARTLY.
            </h2>
            <div className="auth-accent-line"></div>
            <p className="auth-hero-subtext">
              High-performance environment for modern capital management.
            </p>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-content">
            <h1>
              {view === "login"
                ? "Login"
                : view === "register"
                  ? "Register"
                  : "Forget Password"}
            </h1>

            {view === "login" && (
              <form onSubmit={handleLogin}>
                <ConsoleInput
                  label="Mobile"
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  prefix="+91"
                  required
                />
                <ConsoleInput
                  label="Password"
                  type="password"
                  icon={Lock}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p
                  className="link"
                  onClick={() => {
                    resetForm();
                    setView("forgot");
                  }}
                >
                  Forget Password?
                </p>
                <button className="main-btn">
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Access Account"
                  )}
                  <ChevronRight size={18} />
                </button>
              </form>
            )}

            {(view === "register" || view === "forgot") && (
              <>
                <ConsoleInput
                  label="Mobile"
                  prefix="+91"
                  value={phone}
                  disabled={otpVerified}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                />

                {view === "register" && (
                  <>
                    <ConsoleInput
                      label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      icon={User}
                    />
                    <ConsoleInput
                      label="Referral Code (Optional)"
                      value={refCode}
                      onChange={(e) => setRefCode(e.target.value)}
                      icon={TicketCheck}
                      disabled={refVerified}
                      actionLabel={refVerified ? "Verified" : "Verify"}
                      onActionClick={!refVerified ? handleVerifyRefCode : null}
                    />
                  </>
                )}

                {!otpSent && view === "register" && (
                  <button
                    type="button"
                    className="otp-btn"
                    onClick={RegisterOtp}
                  >
                    Send OTP
                  </button>
                )}

                {!otpSent && view === "forgot" && (
                  <button
                    type="button"
                    className="otp-btn"
                    onClick={handleSendOtp}
                  >
                    Send OTP
                  </button>
                )}

                {otpSent && !otpVerified && (
                  <>
                    <ConsoleInput
                      label="Enter OTP"
                      value={otp}
                      icon={ShieldCheck}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                      type="button"
                      className="otp-btn"
                      onClick={handleVerifyOtp}
                    >
                      Verify OTP
                    </button>
                  </>
                )}

                {otpVerified && view === "register" && (
                  <>
                    <ConsoleInput
                      label="Password"
                      type="password"
                      icon={Lock}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <ConsoleInput
                      label="Trade Password"
                      type="password"
                      icon={Lock}
                      value={tradePassword}
                      onChange={(e) => setTradePassword(e.target.value)}
                    />
                  </>
                )}

                {otpVerified && view === "forgot" && (
                  <ConsoleInput
                    label="New Password"
                    type="password"
                    icon={Lock}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                )}

                <button
                  className="main-btn"
                  onClick={
                    view === "register" ? handleRegister : handleForgotPassword
                  }
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Submit"}
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            <p className="bottom-link">
              {view === "login" ? (
                <>
                  Don't have an account?{" "}
                  <span
                    className="link-action"
                    onClick={() => {
                      resetForm();
                      setView("register");
                    }}
                  >
                    Register
                  </span>
                </>
              ) : (
                <>
                  Already a user?{" "}
                  <span
                    className="link-action"
                    onClick={() => {
                      resetForm();
                      setView("login");
                    }}
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login_register_forget;
