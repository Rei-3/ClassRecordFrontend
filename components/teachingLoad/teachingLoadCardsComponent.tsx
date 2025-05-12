"use client";

import { useParams } from "next/navigation";
import { useGetTeachingLoadQuery } from "@/store/api/apiSlice/get/teachingLoadApiSlice";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/cards/card";
import SubjectCard from "./subjects/subjectCard";
import { useGetSemQuery } from "@/store/api/apiSlice/get/semApiSlice";

export default function TeachingLoadDetail() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetTeachingLoadQuery();
  const {data: semData} = useGetSemQuery();
  
  if (isLoading) return <div className="p-4">Loading teaching load details...</div>;
  if (isError) return <div className="p-4 text-red-600">Error loading teaching load details</div>;

  const teachingLoad = data?.find((load) => load.id === Number(id));
  if (!teachingLoad) return <div className="p-4">Teaching Load not found</div>;

  const semDetail = semData?.find((sem) => sem.id === teachingLoad.semId)?.semName;
  // semData?.find(sem => sem.id === subject.semId)?.semName || '')
  return (
    <div className="p-4 space-y-6">
      {/* Main Teaching Load Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Teaching Load #{teachingLoad.id}</CardTitle>
              <CardDescription>These are the list of Subjects under this Teaching Load</CardDescription>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              teachingLoad.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {teachingLoad.status ? "Active" : "Inactive"}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoItem icon="📅" label="Academic Year" value={teachingLoad.academicYear} />
            <InfoItem icon="📘" label="Semester" value={semDetail} />
            <InfoItem icon="🕒" label="Created On" value={new Date(teachingLoad.addedOn).toLocaleDateString()} />
            <InfoItem icon="📚" label="Subjects" value={teachingLoad.teachingLoadId.length} />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 gap-2">
          <button className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50">
            Edit Details
          </button>
        </CardFooter>
      </Card>

      {/* Subjects Section */}
      <div className="space-y-4">
        <div className="ml-5"> 
          <h2 className="text-xl font-semibold">Assigned Subjects</h2>
          <p className="text-gray-500">Scan QR codes to enroll</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachingLoad.teachingLoadId.map((detail) => (
            <SubjectCard 
            addOns={
              { academicYear: teachingLoad.academicYear, semName: semDetail }
            } 
            key={detail.id} 
            subject={detail.subjects} 
            detail={detail} />
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start space-x-3">
      <span className="text-gray-500">{icon}</span>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
