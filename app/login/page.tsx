"use client";

import { Suspense } from "react";
import AuthRedirector from "./AuthRedirector";
import LoginForm from "./LoginForm"; // Import LoginForm

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthRedirector />
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Left half for login form */}
        <div className="md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg dark:bg-gray-800">
            <Suspense fallback={<div>Loading login form...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>

        {/* Right half for logo */}
        <div className="md:w-1/2 flex items-center justify-center p-8 bg-indigo-600 text-white">
          <div className="text-center">
            <h1 className="text-5xl font-bold">Welcome</h1>
            <p className="mt-2 text-lg">Your journey starts here.</p>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
