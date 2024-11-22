import React from "react";
import { useNavigate } from "react-router-dom";
import "./Pricing.css";
import axiosInstance from "../utils/axiosInterceptors";
import { useDispatch, useSelector } from "react-redux";
import { setActive } from "../store/authStore/AuthSlice";

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: any) => state.auth);
  const dispatch= useDispatch();

  const handleTrialSubscription = async () => {
    try {
      const requestBody = {
        userId: auth.id, // Replace with the actual user's email or pass dynamically
      };
      await axiosInstance.post("/subscriptions/create/trial", requestBody);
      dispatch(setActive(true));
      navigate(`/`);

      alert("Trial subscription created successfully!");
    
    } catch (error) {
      console.error("Error creating trial subscription:", error);
      alert("Failed to create trial subscription. Please try again.");
    }
  };

  const handlePaidPlan = () => {
    navigate(`/payment`);
  };

  return (
    <div className="pricing-section">
      <h1 className="pricing-header">Choose Your Plan</h1>
      <p className="pricing-description">
        Start with a 7-day free trial and upgrade anytime. Cancel anytime.
      </p>

      <div className="pricing-cards">
        {/* Starter Plan */}
        <div className="pricing-card">
          <h2 className="card-title">Starter</h2>
          <p className="card-price">$0<span>/month</span></p>
          <p className="card-details">Perfect to explore basic features</p>
          <ul className="card-features">
            <li>✔ 500 actions per month</li>
            <li>✔ Basic analytics</li>
            <li>✔ 1 user</li>
          </ul>
          <button className="card-button" onClick={handleTrialSubscription}>
            Start Free Trial
          </button>
        </div>

        {/* Pro Plan */}
        <div className="pricing-card">
          <h2 className="card-title">Starter</h2>
          <p className="card-price">$12<span>/month</span></p>
          <p className="card-details">Great for professionals and teams</p>
          <ul className="card-features">
            <li>✔ 20,000 actions per month</li>
            <li>✔ Advanced analytics tools</li>
            <li>✔ Up to 3 users</li>
            <li>✔ Priority email support</li>
          </ul>
          <button
            className="card-button"
            onClick={() => handlePaidPlan()}
          >
            Choose Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="pricing-card highlighted">
          <h2 className="card-title">Pro</h2>
          <p className="card-price">$18<span>/month</span></p>
          <p className="card-details">All-inclusive features for businesses</p>
          <ul className="card-features">
            <li>✔ Unlimited actions</li>
            <li>✔ Advanced analytics</li>
            <li>✔ Up to 10 users</li>
            <li>✔ Dedicated support</li>
          </ul>
          <button
            className="card-button"
            onClick={() => handlePaidPlan()}
          >
            Choose Plan
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="pricing-card">
          <h2 className="card-title">Enterprise</h2>
          <p className="card-price">Custom Pricing</p>
          <p className="card-details">Tailored solutions for large businesses</p>
          <ul className="card-features">
            <li>✔ Unlimited actions</li>
            <li>✔ Custom analytics tools</li>
            <li>✔ Multi-user and team support</li>
            <li>✔ 24/7 dedicated assistance</li>
          </ul>
          <button
            className="card-button"
            onClick={() => handlePaidPlan()}
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
