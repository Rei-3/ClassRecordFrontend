"use client";

import { logout } from "@/lib/utils/authUtil";
import Link from "next/link";



export default function YouShallNotPass() {
  return (
    <div>
      <Link
        onClick={() => {
          logout();
        }}
        href="/login"
        className="btn btn-gradient mx-auto !mt-7 w-max border-0 uppercase shadow-none"
      >
        GO BACK
      </Link>
    </div>
  );
}
