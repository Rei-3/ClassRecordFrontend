"use client";

import { useParams } from "next/navigation";
import { useGetTeachingLoadQuery } from "@/store/api/apiSlice/get/teachingLoadApiSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards/card";
import SubjectCard from "./subjects/subjectCard";
import { useGetSemQuery } from "@/store/api/apiSlice/get/semApiSlice";
import { usePostSendRequestMutation } from "@/store/api/apiSlice/post/TeachingLoadApiSlice";

import { useState } from "react";
import RequestingModal from "../modals/sendingModal";
import SuccessModal from "../modals/successModal";

export default function TeachingLoadDetail() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetTeachingLoadQuery();
  const { data: semData } = useGetSemQuery();
  const [isOpen, setIsOpen] = useState(true);
  const [sendRequest, { isLoading: sendingEmail, isSuccess }] =
    usePostSendRequestMutation();

  if (isLoading)
    return <div className="p-6 text-lg">Loading teaching load details...</div>;

  if (isError)
    return (
      <div className="p-6 text-lg text-red-600">
        Error loading teaching load details
      </div>
    );

  const close = () => setIsOpen(false);

  const teachingLoad = data?.find((load) => load.id === Number(id));
  if (!teachingLoad)
    return <div className="p-6 text-lg text-gray-600">Teaching Load not found</div>;

  const semDetail = semData?.find((sem) => sem.id === teachingLoad.semId)?.semName;

  const handleSendRequest = async (teachingLoadId: number) => {
    await sendRequest({ teachingLoadId }).unwrap();
  };

  return (
    <div className="space-y-8 p-6">
      {/* Teaching Load Card */}
      <Card className="shadow-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
      <CardHeader className="bg-gradient-to-r from-sky-400 to-sky-500 text-white dark:from-sky-600 dark:to-sky-700 rounded-t-lg p-6">
      <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-white text-xl">
                Teaching Load #{teachingLoad.id}
              </CardTitle>
              <CardDescription className="text-blue-100">
                List of subjects under this teaching load.
              </CardDescription>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                teachingLoad.status
                  ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
                  : "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900"
              }`}
            >
              {teachingLoad.status ? "Active" : "Inactive"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="bg-white dark:bg-gray-900 space-y-4 p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <InfoItem icon="📅" label="Academic Year" value={teachingLoad.academicYear} />
            <InfoItem icon="📘" label="Semester" value={semDetail} />
            <InfoItem
              icon="🕒"
              label="Created On"
              value={new Date(teachingLoad.addedOn).toLocaleDateString()}
            />
            <InfoItem
              icon="📚"
              label="Subjects"
              value={teachingLoad.teachingLoadId.length}
            />
          </div>
        </CardContent>

        <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
          <button
            className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-all dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={() => handleSendRequest(teachingLoad.id)}
          >
            Request Deactivate
          </button>
        </CardFooter>
      </Card>

      {/* Loading Modal */}
      {sendingEmail && (
        <RequestingModal isOpen={isOpen} onClose={close}>
   
        </RequestingModal>
      )}

      {/* Success Modal */}
      {isSuccess && (
        <SuccessModal
          isOpen={isOpen}
          onClose={close}
          message="Request Sent"
          desc="Your request to edit the teaching load has been sent successfully!"
        />
      )}

      {/* Subjects */}
      <div className="space-y-4">
        <div className="ml-2 md:ml-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Assigned Subjects
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Scan QR codes to enroll</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teachingLoad.teachingLoadId.map((detail) => (
            <SubjectCard
              key={detail.id}
              addOns={{
                academicYear: teachingLoad.academicYear,
                semName: semDetail,
              }}
              subject={detail.subjects}
              detail={detail}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start space-x-3">
      <span className="text-gray-600 dark:text-gray-400">{icon}</span>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
