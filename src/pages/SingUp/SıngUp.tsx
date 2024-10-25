import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../utils/axiosInterceptors";
import FormikInput from "../../components/FormikInput/FormikInput";

type SignupFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};



const SignUp = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const initialValues: SignupFormValues = {
    email: "",
    password: "",
    confirmPassword: ""
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(`${t("mailformat")}`)
      .required(`${t("veri")}`),
    password: Yup.string().required(`${t("veri")}`),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSignupSubmit = async (
    values: SignupFormValues,
    { setErrors, setSubmitting }: FormikHelpers<SignupFormValues>
  ) => {
    try {
      setSubmitting(true);

       await axiosInstance.post("/users", values);

      navigate("/login");
      toast.success("Kullanıcı başarıyla oluşturuldu");
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
    <div className=" row d-flex col-12 col-md-8 col-xl-4 align-items-start justify-content-center">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-center mb-4">{t("signUp")}</h5>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSignupSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormikInput label={t("email")} name="email" type="email" />
                <FormikInput
                  label={t("password")}
                  name="password"
                  type="password"
                />
                <FormikInput
                  label={t("confirmpass")}
                  name="confirmPassword"
                  type="password"
                />

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? `${t("loading")}` : `${t("signUp")}`}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SignUp;