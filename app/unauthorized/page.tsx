import YouShallNotPass from '@/components/ui/unauthorizedPge';
import { Metadata } from 'next';
import Image from 'next/image'; // Make sure to import Image
import React from 'react';



export const metadata: Metadata = {
    title: 'Error 403',
};

const Unauthorized = () => {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
            <div className="px-6 py-16 text-center font-semibold before:container before:absolute before:left-1/2 before:aspect-square before:-translate-x-1/2 before:rounded-full before:bg-[linear-gradient(180deg,#4361EE_0%,rgba(67,97,238,0)_50.73%)] before:opacity-10 md:py-20">
                <div className="relative">
                    <Image src="/assets/images/you-shall-not-pass-lotr.gif" alt="404" width={1080} height={1080} className="dark-img mx-auto -mt-10 w-full max-w-xs object-cover md:-mt-14 md:max-w-xl" />
                    <Image src="/assets/images/you-shall-not-pass-lotr.gif" alt="404" width={500} height={500} className="light-img mx-auto -mt-10 w-full max-w-xs object-cover md:-mt-14 md:max-w-xl" />
                    <p className="mt-5 text-base dark:text-white">YOU ARE UNATHORIZED TO ACCESS THIS PAGE!</p>
                    
                   
                    <YouShallNotPass />
                 
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
