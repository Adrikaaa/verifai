import React from "react";
import Image from "next/image";
import SignInFormClient from "@/components/sign-in-form-client";

const Page = () => {
  return (
    <div className="flex gap-8 items-center justify-center min-h-screen">
      <Image
        src={"/login.svg"}
        alt="Login-Image"
        width={400}
        height={400}
        className="m-6 object-cover"
      />
      <SignInFormClient />
    </div>
  );
};

export { Page };
