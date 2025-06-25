"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  authFormSchema,
  generateavatar,
  generateAvatar,
  storeSessionInLocalStorage,
} from "@/lib/utils";
import CustomFormField, { FormFieldType } from "../utilities/CustomInput";
import Loader from "../utilities/Loader";
import { useSignIn, useSignUp } from "@/lib/react-query/queriesAndMutation";
import { useRouter } from "next/navigation";
import CustomRadio from "../utilities/CustomRoleRadio";
import { createScratchCard } from "@/lib/actions/scratchCard.actions";
import Popup from "../utilities/PopUp";

const AuthForm = ({
  type,
  role,
}: {
  type: string;
  role: "admin" | "teacher" | "student";
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: createUser } = useSignUp();
  const { mutateAsync: signUser } = useSignIn();
  const [isFailed, setIsFailed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formSchema = authFormSchema(type, role);
  const closeSuccessPopup = () => {
    setIsSuccess(false);
  };
  // const formatDate = (date: string) => {
  //   if (!date) return '';
  
  //   const [year, month, day] = date.split('-');
  //   return `${day}-${month}-${year}`;
  // };
  // Close the failure popup
  const closeFailurePopup = () => {
    setIsFailed(false);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "viewer",
    },
  });

  const selectedRole = form.watch("role");
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setIsFailed(false);
    try {
      if (type === "sign-up") {
        const avatarUrl = generateavatar(
          data.firstName? data.firstName.replace(/\s+/g, ""):
            data.lastName? data.lastName.replace(/\s+/g, "") :
            "User"
        );
        const userData = {
          email: data.email,
          password: data.password,
          role: data.role!,
          image: avatarUrl,
          name:
            `${data.firstName!.replace(/\s+/g, "")} ${data.lastName!.replace(
              /\s+/g,
              ""
            )}` || "Guest Mode",

          ...(data.role === "admin" && {
            adminContact: data.adminContact!.replace(/\s+/g, ""),
            adminId: data.adminId!.replace(/\s+/g, ""),
            adminCode: data.adminCode!.replace(/\s+/g, ""),
          }),
          ...(data.role === "viewer" && {
            dob: data.dob,
            guardianContact: data.guardianContact!.replace(/\s+/g, ""),
          }),
        };

        const newUser = await createUser(userData);
        if (!newUser || newUser === null || newUser === undefined) {
          setIsFailed(true);
          
          return null;
        } else if (newUser) {
          setIsSuccess(true);
          form.reset();
          router.push("/");
        }
      } else if (type === "sign-in") {
        const response = await signUser({
          email: data.email,
          password: data.password,
        });
        if (!response || response === undefined || response === null) {
          console.log("Failed to sign in");
          setIsFailed(true);
          return null;
        } else if (response) {
          form.reset();
          router.push("/");
          setIsSuccess(true)
        }
        //  }
        // else if (role === "admin" && type === "sign-up") {
        //   const response = await adminSignIn({
        //     email: data.email,
        //     password: data.password,
        //     adminCode: data.adminCode!,
        //     name: `${data.firstName} ${data.lastName}`,
        //     adminId: data.adminId!,
        //     adminContact: data.adminContact!,
        //   });
        //   if (response) {
        //     form.reset();
        //     storeSessionInLocalStorage();
        //     router.push("/");
        //   }
      }
    } catch (error) {
      console.error("Error during authentication", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case "admin":
        return (
          <>
            <div className="flex gap-3 items-center">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="firstName"
                label="Surname"
                placeholder="Enter your first name."
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="lastName"
                label="First Name"
                placeholder="Enter your last name."
              />
            </div>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="adminContact"
              label="Admin Contact"
              placeholder="Enter admin contact number."
            />
            <div className="flex gap-3 items-center">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="adminCode"
                label="Admin Code"
                placeholder="Enter your admin code."
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="adminId"
                label="Admin ID"
                placeholder="Enter your admin ID."
              />
            </div>
          </>
        );

      case "viewer":
        return (
          <>
            <div className="flex gap-3 items-center">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="firstName"
                label="Surname"
                placeholder="Enter your first name."
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="lastName"
                label="First Name"
                placeholder="Enter your last name."
              />
            </div>
            <div className="flex gap-3 items-center">
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="dob"
                label="Date of Birth"
                placeholder="DD-MM-YYYY"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="guardianContact"
                label="Guardian Contact"
                placeholder="0901 234 5678 90"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <section className="auth-form min-h-screen flex flex-col justify-start">
      {" "}
      <header className="flex flex-col gap-5 md:gap-8">
        <h1 className="text-24 lg:text-36 font-semibold">
          {type === "sign-in" ? "Sign In" : "Sign Up"}
        </h1>
        <p>Please enter your details.</p>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {type === "sign-up" && (
            <>
              <CustomRadio
                name="role"
                control={form.control}
                options={[
                  { label: "Admin", value: "admin" },

                  { label: "Student", value: "viewer" },
                ]}
                className="space-y-2"
              />
              {renderRoleSpecificFields()}
            </>
          )}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="user@example.com."
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password."
          />
          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center px-8 py-8 text-lg font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <Loader /> Loading...
                </div>
              ) : type === "sign-in" ? (
                "Sign In"
              ) : type === "sign-up" && role === "admin" ? (
                "Sign in - Admin"
              ) : type === "sign-up" ? (
                "Sign Up"
              ) : (
                "Unknown Action"
              )}
            </Button>
          </div>
        </form>
        <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-gray-600 dark:text-neutral-200">
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="text-purple-600 underline"
          >
            {type === "sign-in" ? "Sign up." : "Sign in."}
          </Link>
          <br />
        </footer>{" "}
        <div className="flex-col bottom-0 gap-3 mt-2 mb-0 sticky items-center justify-center text-center">
          <p className="flex text-center items-center justify-center  text-gray-400 dark:text-neutral-500 text-sm font-nunito">
            By Signing in, you accept our{" "}
          </p>
          <Link href="/privacy-policy" className="">
            <p className="flex text-center text-gray-400 items-center justify-center dark:text-neutral-500 text-sm underline font-nunito">
              Privacy Policy and Terms of Use.
            </p>
          </Link>
        </div>
      </Form>
      {isSuccess && (
        <Popup
          type="success"
          message="Authentication successful!"
          onClose={closeSuccessPopup}
          degree="Authenticated"
        />
      )}
      {/* Failure Popup */}
      {isFailed && (
        <Popup
          type="failure"
          message="Your credentials were invalid, try rearranging them or check your internet connection."
          onClose={closeFailurePopup}
          contact={true}
          degree="Authentication"
        />
      )}
    </section>
  );
};

export default AuthForm;
