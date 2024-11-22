import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe("pk_test_51QN8NmFsElhjEAdsW92ad64VrgJWnO1CB8QpobzxU4Zcesnco7xRIZ6QxFIm01Vm6alNbhVKNoU2uACzPY3yzuM400FkCvtuzO");

const Element: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default Element;
