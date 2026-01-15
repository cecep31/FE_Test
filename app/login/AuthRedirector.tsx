"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function AuthRedirector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated()) {
      const from = searchParams.get('from');
      router.push(from || '/');
    }
  }, [router, searchParams]);

  return null; // This component doesn't render anything, it just handles redirection
}
