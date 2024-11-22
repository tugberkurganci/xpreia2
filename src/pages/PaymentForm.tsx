import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import styles from "./PaymentForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInterceptors";
import { setActive } from "../store/authStore/AuthSlice";
import { useNavigate } from "react-router-dom";

const PaymentForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [plan, setPlan] = useState("starter"); // Varsayılan plan
    const auth = useSelector((state: any) => state.auth);
    const dispatch= useDispatch();
    const navigate = useNavigate();

    const handlePlanSelect = (selectedPlan: string) => {
        setPlan(selectedPlan);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsProcessing(true);

        const amount = plan === "starter" ? 1200 : 1800; // Plan fiyatları

        // Payment intent oluşturuluyor
        const response :any= await axiosInstance.post("/payment/create-payment-intent",
            { amount },
        );

        console.log(response)
        const  clientSecret  = response.data.clientSecret

        // Stripe confirmCardPayment ile ödeme
        const cardElement = elements?.getElement("card"); // 'CardElement' bileşeni kullanımı
        const paymentResult = await stripe?.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement!,
            },
        });



        if (paymentResult?.error) {
            alert(paymentResult.error.message);
        } else if (paymentResult?.paymentIntent?.status === "succeeded") {

            await handleSubscription();
            alert("Payment successful!");
        }
        setIsProcessing(false);
    };

    const handleSubscription = async () => {

        try {
            await axiosInstance.post("/subscriptions/create", {

                userId: auth.id, // Kullanıcı ID
                type: plan,            // Abonelik tipi: STARTER veya PRO
                startDate: new Date().toISOString().split("T")[0],
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
                    .toISOString()
                    .split("T")[0],
            }
            );
            dispatch(setActive(true));
            navigate(`/`);

        } catch (error) {

            alert("Failed to create subscription.");
        }







    };


    return (
        <div className={styles.paymentForm}>
            <h2>Select Your Plan</h2>
            <div className={styles.planSelector}>
                <button
                    className={`${styles.planButton} ${styles.starter} ${plan === "starter" ? styles.active : ""
                        }`}
                    onClick={() => handlePlanSelect("starter")}
                >
                    Starter - $12
                </button>
                <button
                    className={`${styles.planButton} ${styles.pro} ${plan === "pro" ? styles.active : ""
                        }`}
                    onClick={() => handlePlanSelect("pro")}
                >
                    Pro - $18
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <div className={styles.cardElement}>
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#424770",
                                        letterSpacing: "0.025em",
                                        fontFamily: "Arial, sans-serif",
                                        "::placeholder": { color: "#aab7c4" },
                                    },
                                    invalid: { color: "#9e2146" },
                                },
                            }}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={!stripe || isProcessing}
                >
                    {isProcessing ? "Processing..." : `Pay $${plan === "starter" ? 12 : 18}`}
                </button>
            </form>

        </div>
    );
};

export default PaymentForm;
