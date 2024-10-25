import { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axiosInstance, { setToken } from "../../utils/axiosInterceptors";
import { loginSuccess } from "../../store/authStore/AuthSlice";
import FormikInput from "../../components/FormikInput/FormikInput";
import "./signIn.css"; // Add this line to import the custom CSS file

type SignInFormValues = {
  email: string;
  password: string;
};

type Props = {};

const SignIn = (props: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues: SignInFormValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required(`${t("veri")}`),
  });

  const handleSignInSubmit = async (
    values: SignInFormValues,
    { setErrors, setSubmitting }: FormikHelpers<SignInFormValues>
  ) => {
    try {
      setSubmitting(true);

      const response = await axiosInstance.post("/auth", values);

      dispatch(loginSuccess(response.data.user));

      setToken(response.data.token.refreshToken);

      navigate("/");
    } catch (error: any) {
      if (error.response.data.validationErrors) {
        const validationErrors: Record<string, string> =
          error.response.data.validationErrors;
        const formikErrors: Record<string, string> = {};
        Object.entries(validationErrors).forEach(([field, message]) => {
          formikErrors[field] = message;
        });
        setErrors(formikErrors);
      } else {
        // console.error("Signup failed:", error);
        toast.error(error.response.data.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row d-flex col-12 col-md-8 col-xl-4 align-items-start justify-content-center">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-center mb-4">{t("login")}</h5>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSignInSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormikInput label={t("email")} name="email" type="email" />
                <FormikInput label={t("password")} name="password" type="password" />
                <div className="d-flex flex-row justify-content-between mt-3 button-container">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? `${t("loading")}` : `${t("login")}`}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    onClick={() => {
                      navigate("/sign-up");
                    }}
                  >
                    {isSubmitting ? `${t("loading")}` : `${t("signUp")}`}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
