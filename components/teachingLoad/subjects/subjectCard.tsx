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
  }
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
    <Card className="hover:shadow transition-shadow">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{subject.subjectName}</h3>
            <p className="text-sm text-gray-500">{subject.subjectDesc}</p>
          </div>
          <span className="px-2 py-1 bg-primary text-white rounded-md text-s flex">
            Section: <p className="font-bold ml-1">{detail.section}</p>
          </span>
        </div>
        <div className="m-2">
          <span className="px-2 py-1 bg-green-300 text-black rounded-md text-s">
            Enrolled students: {enrolledData?.length || 0}
          </span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <QRCode value={detail.key} size={150} />
          <p className="text-xs text-gray-500">Scan to enroll</p>
        </div>
        <div className="flex justify-center gap-2 pt-2">
          <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
            Copy Code
          </button>
          <Link
           href={`/subjects/${detail.id}/${
            toSlug(subject.subjectName || '')
          }/${
            toSlug(String(addOns.semName) || '')
          }/${
            toSlug(addOns.academicYear || '')
          }/${
            toSlug(detail.section || '')
          }/${
            slugifySchedule(detail.schedule || '')
          }`}
          title={subject.subjectName} 
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
          >
            View Detail
          </Link>

          {/* href={`/subjects/${subject.teachingLoadDetailId}/${
                      toSlug(subject.subjectName || '')
                    }/${
                      toSlug(semData?.find(sem => sem.id === subject.semId)?.semName || '')
                    }/${
                      toSlug(subject.academicYear || '')
                    }/${
                      toSlug(subject.section || '')
                    }/${
                      slugifySchedule(subject.schedule || '')
                    }`}
                    title={subject.subjectName} */}

        </div>
        <div className="ml-20">
        <DefaultModal
        title="Enlarge QR Code"
        >
          <div className="flex flex-col items-center space">
            <QRCode value={detail.key} size={350} />
          </div>
        </DefaultModal>
        </div>
        
      </CardContent>
    </Card>
  );
}
