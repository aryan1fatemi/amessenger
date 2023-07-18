import Image from "next/image";
import AuthForm from "./components/AuthForm";
export default function Home() {
    return (
      <div
      className="
      flex 
      min-h-full 
      flex-col 
      justify-center 
      py-12 
      sm:px-6 
      lg:px-8 
      bg-sky-100
    ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <Image
          height={60}
          width={60}
          className="mx-auto w-auto"
          src="/images/logo.png"
          alt="Logo"
        />
        <h2 className="mt-6 text-center text-3xl font-bold text-sky-900">Sign in to your account</h2>
        <div>{/** TODO: Add Auth Form */}</div>
      </div>
      <AuthForm />
      </div>
    )
  }
