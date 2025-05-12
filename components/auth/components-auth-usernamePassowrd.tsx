"use client";

import { useState } from "react";
import RegisterModal from "../modals/registerModal";

export default function ComponentsUsernamePasswordOTp() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <button onClick={() => setIsModalOpen(true)}>
      <div className="flex">
        Registered ?&nbsp;
        <div className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
           Verify your Account
        </div>
        {isModalOpen && <RegisterModal />}
      </div>
    </button>
  );
}
