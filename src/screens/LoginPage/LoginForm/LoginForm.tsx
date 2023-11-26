import React, {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {FormBuilderType, FormFieldTypes, WidthType} from "@/types/forms";
import {authenticate} from "@/services/auth";
import Router from "next/router";
import {Routes} from "@/types/routes";
import useAuth from "@/context/authContext";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import Cookie from 'js-cookie';

import Button from "@/components/Button/Button";

import "./styles.scss";

const LoginForm: React.FC = () => {
  const formFields: FormBuilderType[] = [
    {
      fieldType: FormFieldTypes.TEXT,
      type: "text",
      name: "login",
      label: "Your email",
      placeholder: "laithoff@gmail.com",
      rules: {
        required: "Email is required!",
        // pattern: {
        //   value: "^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$",
        //   message: "please. enter valid email",
        // },
        validate: {
          matchPattern: (v) =>
             /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
              "Please, enter valid email address",
        },
      },
      errorMessage: "Email is required!",
      width: WidthType.w100,
      classNames: 'big-version',
      needToasts: false,
    },
    {
      fieldType: FormFieldTypes.TEXT,
      type: "password",
      name: "password",
      label: "Your password",
      placeholder: "********",
      rules: {
        required:  "Please, enter valid password!",
        minLength: {
          value: 3,
          message: "Password has to be at least 3 symbols!"
        },
      },
      errorMessage: "Please, enter valid password!",
      width: WidthType.w100,
      classNames: 'big-version',
      needToasts: false,
    },
  ];

  const { setToken, setUserName } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState,
  } = useForm({ mode: "onSubmit" });


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
        setUserName(login);
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
        {formFields.map((curField: any ) => (

          <div key={curField.name} className='grid-row'>
            <Controller
                name={curField.name}
                control={control}
                render={({field: { ...props}, fieldState: {error}}) => (
                <FieldBuilder
                    {...curField}
                    {...props}
                    type={curField.type}
                    name={curField.name}
                    label={curField.label}
                    fieldType={curField.fieldType}
                    placeholder={curField.placeholder}
                    errorMessage={error?.message}
                    isRequired={!!curField.rules?.required || false}
                /> )}
               rules = {curField.rules}
            />
          </div>

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
