import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/signin.css";
import CarouselComponent from "../components/CarouselComponent";
import { signInUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await signInUser(formData.email, formData.password);

      if (response?.error) {
        setError(response.error);
      } else if (response?.token) {
        localStorage.setItem("authToken", response.token);
        navigate("/dashboard");
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="carousel-container full-height">
        <CarouselComponent />
      </div>
      <div className="signin-form-container">
        <div className="signin-form">
          <h1 className="agam-hive-title">AgamHive</h1>
          <h2 className="signin-title">Welcome Back!</h2>
          <p className="signin-subtitle">
            Don’t have an account?
            <a href="#" className="create-account">
              Create a new account now
            </a>
            , it’s FREE! Takes less than a minute.
          </p>
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control input-field"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3 password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control input-field"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye /> : <EyeOff />}
              </span>
            </div>
            <button type="submit" className="btn signin-btn" disabled={loading}>
              {loading ? "Signing in..." : "Login Now"}
            </button>
            <div className="btn-spacing"></div>
            <button type="button" className="btn google-btn">
              <img src="/images/google.png" alt="Google" className="google-icon" />
              <span>Login with Google</span>
            </button>
          </form>
          <p className="forgot-password">
            Forgot password?
            <a href="#" className="create-account"> Click here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
