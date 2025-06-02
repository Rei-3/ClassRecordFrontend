"use client";

import { QRCode } from "react-qrcode-logo";
import Link from "next/link";
import { useGetEnrolledQuery } from "@/store/api/apiSlice/get/teachingLoadApiSlice";
import { Card, CardContent } from "@/components/ui/cards/card";
import DefaultModal from "@/components/modals/defaultModal";
import { slugifySchedule, toSlug } from "@/lib/utils/utils";

interface SubjectCardProps {
  addOns: {
    academicYear: string;
    semName: any;
  };
  subject: {
    id: number;
    subjectName: string;
    subjectDesc: string;
    units: number;
  };
  detail: {
    id: number;
    key: string;
    schedule: string;
    section: string;
  };
}

export default function SubjectCard({ subject, detail, addOns }: SubjectCardProps) {
  const { data: enrolledData } = useGetEnrolledQuery(detail.id);

  return (
    <Card className="hover:shadow-md transition-shadow border border-blue-100 bg-blue-50 dark:bg-gray-900 dark:border-gray-800">
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">{subject.subjectName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{subject.subjectDesc}</p>
          </div>
          <span className="px-2 py-1 bg-blue-600 text-white rounded-md text-xs">
            Section: <span className="font-bold ml-1">{detail.section}</span>
          </span>
        </div>

        <div>
          <span className="inline-block px-2 py-1 bg-green-300 text-black rounded-md text-xs">
            Enrolled students: {enrolledData?.length || 0}
          </span>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <QRCode value={detail.key} size={150} />
          <p className="text-xs text-gray-600 dark:text-gray-400">Scan to enroll</p>
        </div>

        <div className="flex justify-center gap-2 pt-2">
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            Copy Code
          </button>

          <Link
            href={`/subjects/${detail.id}/${toSlug(subject.subjectName || '')}/${toSlug(String(addOns.semName) || '')}/${toSlug(addOns.academicYear || '')}/${toSlug(detail.section || '')}/${slugifySchedule(detail.schedule || '')}`}
            title={subject.subjectName}
            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            View Detail
          </Link>
        </div>

        <div className="flex justify-center pt-2">
          <DefaultModal title="Enlarge QR Code">
            <div className="flex flex-col items-center space-y-4">
              <QRCode value={detail.key} size={350} />
            </div>
          </DefaultModal>
        </div>
      </CardContent>
    </Card>
  );
}
