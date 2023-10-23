import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormBuilderType, FormFieldTypes } from "@/types/forms";
import { authenticate } from "@/services/auth";
import Router from "next/router";
import { Routes } from "@/types/routes";
import useAuth from "@/context/authContext";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import Cookie from 'js-cookie';

import Button from "@/components/Button/Button";

import "./styles.scss";
// type LoginFormType = {}

const LoginForm: React.FC = () => {
  const formFields: FormBuilderType[] = [
    {
      fieldType: FormFieldTypes.TEXT,
      type: "email",
      name: "login",
      label: "Your email",
      placeholder: "laithoff@gmail.com",
      rules: {
        required: true,
        pattern: {
          value: "^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$",
          message: "please. enter valid email",
        },
      },
      errorMessage: "Email is required!",
      isFullWidth: true,
    },
    {
      fieldType: FormFieldTypes.TEXT,
      type: "password",
      name: "password",
      label: "Your password",
      placeholder: "********",
      rules: {
        required: true,
        min: 8,
      },
      errorMessage: "Please, enter valid password!",
      isFullWidth: true,
    },
  ];

  const { token, setToken } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (data: any) => {
    const { login, password } = data;
    type ApiResponse = {
      data?: any;
      status?: any;
      response?: {
        data?: any;
      };
    };

    try {
      setIsLoading(true);
      setError(null);
      //const res = await authenticate("Test@Test.com", "Test");
      const res: ApiResponse = await authenticate(login, password);

      if (res?.status === 200) {
        const { accessToken } = res?.data;
        setToken(accessToken);
        Cookie.set('token', accessToken);
        await Router.push(Routes.Dashboard);
        // } else if (res?.response.status === 401) {
      } else {
        setError("Wrong login or password");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`card login-form`}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {formFields.map((field: any, index: number) => (
          <FieldBuilder
            classNames="text"
            key={field.name + index}
            {...field}
            registerInput={register}
            errors={errors}
            message={field.errorMessage}
          />
        ))}
        {error && <p className="login-error">{error}</p>}
        <div className="login-submit-block">
          <p className="login-recovery-link">Password recovery</p>
          <Button
            type="submit"
            icon={"arrow-right"}
            iconOnTheRight={true}
            disabled={isLoading}
          >
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
