'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {

const router = useRouter();

useEffect(() => {
    router.push("/teaching-loads");
}, [router]);


    return (
        <div className="flex h-screen w-full items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-800">Welcome to the Class Record System</h1>
        </div>
    );
}