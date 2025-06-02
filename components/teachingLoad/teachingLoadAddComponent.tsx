"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/cards/card";
import {
  usePostTeachingLoadMutation,
  usePostTeachingLoadDetailsMutation,
} from "@/store/api/apiSlice/post/TeachingLoadApiSlice";
import { useGetSemQuery } from "@/store/api/apiSlice/get/semApiSlice";
import { useGetSubjectQuery } from "@/store/api/apiSlice/get/subjectApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  addSubject,
  clearSelectedDays,
  fetchSubjectsStart,
  removeSubject,
} from "@/store/api/slices/teachingLoadSlice";
import { useRouter } from "next/navigation";
import SuccessModal from "@/components/modals/successModal";
import DayCheckerForm from "./forms/dayCheckerForm";
import ErrorModal from "../modals/errorModal";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import ConfirmationModal from "@/components/modals/confirmationModal";

// Zod schemas
const addSubjectSchema = z.object({
  semId: z.coerce.number().positive("Semester ID is required"),
  academicYear: z.string().min(1, "Academic Year is required"),
  subjectId: z.coerce.number().positive("Subject ID is required"),
  section: z.string().min(1, "Section is required"),
});

type SubjectFormData = z.infer<typeof addSubjectSchema>;

const TeachingLoadForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const subjects = useSelector((state: any) => state.teachingLoad.subjects);
  const { data: subjectList = [], isLoading: isLoadingSubjects } =
    useGetSubjectQuery();
  const { data: sem = [], isLoading: isLoadingSem } = useGetSemQuery();

  const [postTeachingLoad] = usePostTeachingLoadMutation();
  const [postTeachingLoadDetails] = usePostTeachingLoadDetailsMutation();
  const [status, setStatus] = useState(true);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isRemoveConfirmation, setIsRemoveConfirmation] = useState(false);
  const [subjectToRemove, setSubjectToRemove] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<any>("07:00 AM");
  const [endTime, setEndTime] = useState<any>("8:00 AM");

  // Generate year options for academic year selector
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    yearOptions.push(i);
  }

  // Default to current academic year
  const defaultAcademicYear = `${currentYear}-${currentYear + 1}`;

  const selectedDays = useSelector(
    (state: any) => state.teachingLoad.SelectedDays
  );
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(addSubjectSchema),
    mode: "onChange",
    defaultValues: {
      semId: 0,
      academicYear: defaultAcademicYear,
      subjectId: undefined,
      section: "",
    },
  });

  // Watch the start year to update the academic year string
  const [startYear, setStartYear] = useState(currentYear);
  const [endYear, setEndYear] = useState(currentYear + 1);

  // Update academic year when start or end year changes
  useEffect(() => {
    setValue("academicYear", `${startYear}-${endYear}`);
  }, [startYear, endYear, setValue]);

  const handleAddSubject = handleSubmit((data) => {
    if (!selectedDays || selectedDays.length === 0) {
      setErrorMessage("Please select at least one day");
      setIsError(true);
      return;
    }

    const formatDays = selectedDays.join("");
    const formatStartTime = startTime.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const formatEndTime = endTime.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const formattedSchedule = `${formatDays} ${formatStartTime} - ${formatEndTime}`;
    dispatch(
      addSubject({
        SubjectId: data.subjectId,
        schedule: formattedSchedule,
        section: data.section,
        id: 0,
      })
    );

    // Reset only subject-related fields, preserving semester/year information
    reset({
      semId: data.semId,
      academicYear: data.academicYear,
      subjectId: undefined,
      section: "",
    });
    dispatch(clearSelectedDays());
  });

  const handleRemoveSubject = (id: number) => {
    setSubjectToRemove(id);
    setIsRemoveConfirmation(true);
  };

  const confirmRemoveSubject = () => {
    if (subjectToRemove !== null) {
      dispatch(removeSubject(subjectToRemove));
    }
    setIsRemoveConfirmation(false);
    setSubjectToRemove(null);
  };

  const handleSubmitTeachingLoad = async () => {
    setIsConfirmationOpen(false);

    const formValues = getValues();

    try {
      const teachingLoadResponse = await postTeachingLoad({
        semId: formValues.semId,
        academicYear: formValues.academicYear,
        status,
      }).unwrap();

      const teachingLoadId = teachingLoadResponse.id;

      await Promise.all(
        subjects.map((subject: any) =>
          postTeachingLoadDetails({
            teachingLoadId,
            subjectId: subject.SubjectId,
            schedule: subject.schedule,
            section: subject.section,
          }).unwrap()
        )
      );

      setSuccessMessage(formValues.academicYear);
      setIsSuccessModalOpen(true);

      setTimeout(() => {
        router.push("/teaching-loads");
      }, 3000);
    } catch (error: any) {
      setErrorMessage(`${error?.data?.errorMessage}\nPlease Input a Semester`);
      setErrorCode(error?.status);
      setIsError(true);
    }
  };

  const handleStartYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStartYear = parseInt(e.target.value);
    setStartYear(newStartYear);
    if (endYear <= newStartYear) {
      setEndYear(newStartYear + 1);
    }
  };

  return (
    <div className="mx-auto flex max-w-full flex-col space-y-6 p-4 md:flex-row md:space-x-5 md:space-y-0">
      <Card className="mb-8 w-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <CardHeader>
          <CardTitle>
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-black dark:gray-500">
                Add Teaching Load
              </h1>
              <p className="text-base text-black dark:text-gray-500">
                Assign subjects and schedule for the semester
              </p>
            </div>
          </CardTitle>
          <CardDescription>Configure the semester and status</CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="semId">Semester</Label>
            <select
              id="semId"
              {...register("semId")}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm text-gray-700 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select semester</option>
              {sem.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.semName}
                </option>
              ))}
            </select>
            {errors.semId && (
              <p className="text-sm text-red-500">{errors.semId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicYear">Academic Year</Label>
            <div className="flex items-center gap-2">
              <select
                value={startYear}
                onChange={(e) => {
                  const selectedStartYear = parseInt(e.target.value);
                  setStartYear(selectedStartYear);
                  setEndYear(selectedStartYear + 1); // auto-update endYear
                }}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm text-gray-700 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <span className="font-medium text-gray-700">-</span>

              <input
                value={endYear}
                disabled
                className="text-muted-foreground border-input focus-visible:ring-ring flex h-10 w-full cursor-not-allowed rounded-md border bg-gray-100 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:bg-gray-200 dark:text-black"
              />
            </div>

            <input
              type="hidden"
              {...register("academicYear")}
              value={`${startYear}-${endYear}`}
            />
            {errors.academicYear && (
              <p className="text-sm text-red-500">
                {errors.academicYear.message}
              </p>
            )}
          </div>

          <div className="mt-2 flex items-center gap-3 md:col-span-2">
            <Label>Status:</Label>
            <button
              type="button"
              onClick={() => setStatus((prev) => !prev)}
              className={`flex h-5 w-10 items-center rounded-full p-0.5 transition-all duration-300 ease-in-out ${
                status ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                  status ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">
              {status ? "Active" : "Inactive"}
            </span>
          </div>
        </CardContent>

        <CardHeader>
          <CardTitle>Add Subject</CardTitle>
          <CardDescription>Enter subject details to assign</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAddSubject}>
            <div className="mb-4 space-y-2">
              <Label htmlFor="subjectId">Subject</Label>
              <select
                id="subjectId"
                {...register("subjectId")}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm text-gray-700 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select subject</option>
                {subjectList
                  .slice()
                  .sort((a, b) => a.subjectDesc.localeCompare(b.subjectDesc))
                  .map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.subjectDesc} - {subject.subjectName}
                    </option>
                  ))}
              </select>
              {errors.subjectId && (
                <p className="text-sm text-red-500">
                  {errors.subjectId.message}
                </p>
              )}
            </div>

            <Label htmlFor="schedule">Schedule</Label>
            <div className="mb-5">
              <DayCheckerForm />
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="form flex items-center gap-2">
                  <div>
                    <label className="mb-1 block font-medium">Start Time</label>
                    <Flatpickr
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: "h:i K", // 12-hour format with AM/PM
                        time_24hr: false,
                      }}
                      value={startTime}
                      onChange={([time]) => setStartTime(time)}
                      className="form-input"
                    />
                  </div>
                  <span className="mt-4 font-bold">-</span>
                  <div>
                    <label className="mb-1 block font-medium">End Time</label>
                    <Flatpickr
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: "h:i K", // 12-hour format with AM/PM
                        time_24hr: false,
                      }}
                      value={endTime}
                      onChange={([time]) => setEndTime(time)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  placeholder="AYZ"
                  className="form-input text-gray-700"
                  {...register("section")}
                />
                {errors.section && (
                  <p className="text-sm text-red-500">
                    {errors.section.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              className="text-white hover:bg-blue-50 hover:text-blue-500"
            >
              + Add Subject
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-8 w-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Assigned Subjects</CardTitle>
          <CardDescription>
            Review subjects for this teaching load
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subjects.length > 0 ? (
            <ul className="space-y-3">
              {subjects.map((subject: any, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                >
                  <div>
                    <span className="font-medium">
                      {
                        subjectList.find(
                          (item: any) => item.id === subject.SubjectId
                        )?.subjectDesc
                      }
                    </span>
                    <span className="mx-2">|</span>
                    <span>{subject.section}</span>
                    <span className="mx-2">|</span>
                    <span>{subject.schedule}</span>
                  </div>
                  <Button
                    type="button"
                    className="text-white hover:text-black"
                    onClick={() => handleRemoveSubject(subject.id)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-6 text-center text-gray-500">
              No subjects added yet
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-end text-gray-800">
            <Button
              onClick={() => setIsConfirmationOpen(true)}
              className="bg-green-500 hover:bg-green-600"
              disabled={subjects.length === 0 || isLoadingSubjects || isLoadingSem}
            >
              Submit Teaching Load
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ConfirmationModal
        isOpen={isRemoveConfirmation}
        title="Remove Subject"
        message={`Are you sure you want to remove "${
          subjectList.find(
            (item: any) => item.id === subjects.find((s: { id: number | null; }) => s.id === subjectToRemove)?.SubjectId
          )?.subjectDesc
        }" from your teaching load?`}
        onConfirm={confirmRemoveSubject}
        onCancel={() => {
          setIsRemoveConfirmation(false);
          setSubjectToRemove(null);
        }}
        confirmText="Remove"
        danger={true}
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        title="Confirm Submission"
        message={`Are you sure you want to submit ${
          subjects.length
        } subject(s) for ${getValues().academicYear}?`}
        onConfirm={handleSubmitTeachingLoad}
        onCancel={() => setIsConfirmationOpen(false)}
        confirmText="Submit"
        danger={false}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />
      <ErrorModal
        isOpen={isError}
        onClose={() => setIsError(false)}
        message={errorMessage}
        code={errorCode}
      />
    </div>
  );
};

export default TeachingLoadForm;