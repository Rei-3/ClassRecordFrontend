import { useGetGradingQuery, useGetGradingDetailQuery, useGetFinalGradesQuery, useGetSemGradesQuery } from "@/store/api/apiSlice/get/gradesApiSlice";
import { useGetEnrolledQuery } from "@/store/api/apiSlice/get/teachingLoadApiSlice";
import ExcelJS from 'exceljs';

interface GradesXlxsProps {
  teachingLoadDetailId: number;
  subjectName: string;
  sem: string;
  academicYear: string;
  section: string;
}

interface Grading {
  id: number;
  desc: string;
  numberOfItems: number;
  catId: number;
  termId: number;
  teachingLoadDetailId: number;
  date: string;
}

interface GradingDetail {
  gradingDetailId: number;
  gradingId: number;
  enrollmentId: number;
  description: string;
  conductedOn: string;
  numberOfItems: number;
  score: number;
  recordedOn: string;
}

export default function GradesXlxs({
  teachingLoadDetailId,
  subjectName,
  sem,
  academicYear,
  section,
}: GradesXlxsProps) {
  
  // Get enrolled students
  const { data: enrolledStudents } = useGetEnrolledQuery(teachingLoadDetailId);

  // MIDTERM (termId: 1) - All Categories
  const { data: midtermQuizActivities } = useGetGradingQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 1,
    categoryId: 1, // Quiz
  });

  const { data: midtermActivityActivities } = useGetGradingQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 1,
    categoryId: 2, // Activity
  });

  const { data: midtermExamActivities } = useGetGradingQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 1,
    categoryId: 3, // Exam
  });

  const { data: midtermAttendanceActivities } = useGetGradingQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 1,
    categoryId: 4, // Attendance
  });

  // FINALS (termId: 2) - All Categories
  const { data: finalsQuizActivities } = useGetGradingQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 2,
    categoryId: 1, // Quiz
  });

  const { data: finalsActivityActivities } = useGetGradingQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 2,
    categoryId: 2, // Activity
  });

  const { data: finalsExamActivities } = useGetGradingQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 2,
    categoryId: 3, // Exam
  });

  const { data: finalsAttendanceActivities } = useGetGradingQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 2,
    categoryId: 4, // Attendance
  });

  // GRADING DETAILS - MIDTERM
  const { data: midtermQuizDetails } = useGetGradingDetailQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 1,
    categoryId: 1,
  });

  const { data: midtermActivityDetails } = useGetGradingDetailQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 1,
    categoryId: 2,
  });

  const { data: midtermExamDetails } = useGetGradingDetailQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 1,
    categoryId: 3,
  });

  const { data: midtermAttendanceDetails } = useGetGradingDetailQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 1,
    categoryId: 4,
  });

  // GRADING DETAILS - FINALS
  const { data: finalsQuizDetails } = useGetGradingDetailQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 2,
    categoryId: 1,
  });

  const { data: finalsActivityDetails } = useGetGradingDetailQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 2,
    categoryId: 2,
  });

  const { data: finalsExamDetails } = useGetGradingDetailQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 2,
    categoryId: 3,
  });

  const { data: finalsAttendanceDetails } = useGetGradingDetailQuery({
    teachingLoadDetailId: teachingLoadDetailId,
    termId: 2,
    categoryId: 4,
  });
  
  //midterm
  const {
    data: term1,
    isLoading: term1load,
    error: errorTerm1,
  } = useGetSemGradesQuery({
    teachingLoadDetailId: teachingLoadDetailId, 
    termId: 1, 
  });

  //finals
  const {
    data: term2,
    isLoading: term2load,
    error: errorTerm2,
  } = useGetSemGradesQuery({
    teachingLoadDetailId: teachingLoadDetailId, 
    termId: 2, 
  });

  const {data: semGrade} = useGetFinalGradesQuery({
    teachingLoadDetailId: teachingLoadDetailId,
  });

  // Color schemes for different categories
  const colorSchemes = {
    quiz: { bg: '#E3F2FD', header: '#1976D2' },
    activity: { bg: '#E8F5E8', header: '#388E3C' },
    exam: { bg: '#FFF3E0', header: '#F57C00' },
    attendance: { bg: '#F3E5F5', header: '#7B1FA2' },
    midterm: { bg: '#E1F5FE', header: '#0288D1' },
    finals: { bg: '#FFF8E1', header: '#FFA000' },
    summary: { bg: '#F5F5F5', header: '#424242' }
  };

  // Helper function to apply header styling
  const applyHeaderStyling = (worksheet: ExcelJS.Worksheet, range: string, color: string) => {
    worksheet.getCell(range).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color.replace('#', 'FF') }
    };
    worksheet.getCell(range).font = { 
      bold: true, 
      color: { argb: 'FFFFFFFF' },
      size: 11
    };
    worksheet.getCell(range).alignment = { 
      vertical: 'middle', 
      horizontal: 'center' 
    };
    worksheet.getCell(range).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  };

  // Helper function to apply data cell styling
  const applyDataStyling = (cell: ExcelJS.Cell, bgColor: string) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bgColor.replace('#', 'FF') }
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  };

  // Helper function to add title section
  const addTitleSection = (worksheet: ExcelJS.Worksheet, startRow: number) => {
    // Title
    worksheet.mergeCells(`A${startRow}:F${startRow}`);
    const titleCell = worksheet.getCell(`A${startRow}`);
    titleCell.value = `${subjectName} - Grade Report`;
    titleCell.font = { bold: true, size: 16, color: { argb: 'FF1976D2' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Course info
    worksheet.mergeCells(`A${startRow + 1}:F${startRow + 1}`);
    const infoCell = worksheet.getCell(`A${startRow + 1}`);
    infoCell.value = `${sem} | ${academicYear} | Section: ${section}`;
    infoCell.font = { size: 12, italic: true };
    infoCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Date generated
    worksheet.mergeCells(`A${startRow + 2}:F${startRow + 2}`);
    const dateCell = worksheet.getCell(`A${startRow + 2}`);
    dateCell.value = `Generated on: ${new Date().toLocaleDateString()}`;
    dateCell.font = { size: 10, color: { argb: 'FF666666' } };
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

    return startRow + 4; // Return next available row
  };

  const createExcelFile = async () => {
    if (!enrolledStudents || !term1 || !term2 || !semGrade) {
      alert("Required data not available");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Grade Management System';
    workbook.created = new Date();

    // Helper functions
    const getStudentScore = (studentId: number, activityId: number, gradingDetails: GradingDetail[]) => {
      const detail = gradingDetails?.find(
        (detail) => detail.gradingId === activityId && detail.enrollmentId === studentId
      );
      return detail?.score ?? "";
    };

    const calculateCategoryTotal = (studentId: number, activities: Grading[], gradingDetails: GradingDetail[]) => {
      if (!activities || !gradingDetails) return "";
      
      let total = 0;
      let maxTotal = 0;
      
      activities.forEach(activity => {
        const score = getStudentScore(studentId, activity.id, gradingDetails);
        if (score !== "") {
          total += Number(score);
        }
        maxTotal += activity.numberOfItems;
      });
      
      return maxTotal > 0 ? `${total}/${maxTotal}` : "";
    };

    // 1. SEMESTER GRADES SUMMARY SHEET
    const semesterSheet = workbook.addWorksheet('Semester Grades', {
      views: [{showGridLines: false}]
    });

    let currentRow = addTitleSection(semesterSheet, 1);
    
    // Headers
    const semesterHeaders = ['Student ID', 'Name', 'Midterm Grade', 'Finals Grade', 'Semester Grade', 'Status'];
    semesterHeaders.forEach((header, index) => {
      const cell = semesterSheet.getCell(currentRow, index + 1);
      cell.value = header;
      applyHeaderStyling(semesterSheet, cell.address, colorSchemes.summary.header);
    });

    // Data
    semGrade.forEach((record, index) => {
      const row = currentRow + 1 + index;
      const values = [
        record.studentId,
        record.studentName,
        record.termGrades.Midterm ?? "N/A",
        record.termGrades.Final ?? "N/A",
        record.semesterGrade,
        record.message
      ];

      values.forEach((value, colIndex) => {
        const cell = semesterSheet.getCell(row, colIndex + 1);
        cell.value = value;
        
        // Color code based on status/grade
        let bgColor = '#FFFFFF';
        if (colIndex === 5) { // Status column
          bgColor = typeof value === 'string' && value.toLowerCase().includes('pass') ? '#E8F5E8' : '#FFEBEE';
        }
        applyDataStyling(cell, bgColor);
      });
    });

    // Auto-fit columns
    semesterSheet.columns.forEach(column => {
      column.width = 15;
    });

    // 2. TERM GRADES SUMMARY SHEET
    const termSheet = workbook.addWorksheet('Term Grades Summary', {
      views: [{showGridLines: false}]
    });

    currentRow = addTitleSection(termSheet, 1);

    // Prepare merged data
    const term2Map = new Map(term2.map((record) => [record.studentId, record]));
    const mergedData = term1.map((record1) => {
      const record2 = term2Map.get(record1.studentId);
      return {
        studentId: record1.studentId,
        name: record1.name,
        midterm: record1,
        finals: record2
      };
    });

    // Headers with merged cells for better organization
    const termHeaders = [
      'Student ID', 'Name',
      'Quiz', 'Activity', 'Exam', 'Attendance', 'Grade', 'Remarks', '',
      'Quiz', 'Activity', 'Exam', 'Attendance', 'Grade', 'Remarks'
    ];

    // Add main headers
    termHeaders.forEach((header, index) => {
      const cell = termSheet.getCell(currentRow, index + 1);
      cell.value = header;
      if (index < 2) {
        applyHeaderStyling(termSheet, cell.address, colorSchemes.summary.header);
      } else if (index >= 2 && index <= 7) {
        applyHeaderStyling(termSheet, cell.address, colorSchemes.midterm.header);
      } else if (index >= 9) {
        applyHeaderStyling(termSheet, cell.address, colorSchemes.finals.header);
      }
    });

    // Add section headers
    termSheet.mergeCells(`C${currentRow - 1}:H${currentRow - 1}`);
    const midtermHeaderCell = termSheet.getCell(`C${currentRow - 1}`);
    midtermHeaderCell.value = 'MIDTERM';
    applyHeaderStyling(termSheet, midtermHeaderCell.address, colorSchemes.midterm.header);

    termSheet.mergeCells(`J${currentRow - 1}:O${currentRow - 1}`);
    const finalsHeaderCell = termSheet.getCell(`J${currentRow - 1}`);
    finalsHeaderCell.value = 'FINALS';
    applyHeaderStyling(termSheet, finalsHeaderCell.address, colorSchemes.finals.header);

    // Data rows
    mergedData.forEach((record, index) => {
      const row = currentRow + 1 + index;
      const values = [
        record.studentId,
        record.name,
        record.midterm.scores.Quiz,
        record.midterm.scores.Activity,
        record.midterm.scores.Exam,
        record.midterm.scores.Attendance,
        record.midterm.finalGrade,
        record.midterm.remarks,
        '', // Separator
        record.finals?.scores.Quiz ?? "",
        record.finals?.scores.Activity ?? "",
        record.finals?.scores.Exam ?? "",
        record.finals?.scores.Attendance ?? "",
        record.finals?.finalGrade ?? "",
        record.finals?.remarks ?? ""
      ];

      values.forEach((value, colIndex) => {
        const cell = termSheet.getCell(row, colIndex + 1);
        cell.value = value;
        
        let bgColor = '#FFFFFF';
        if (colIndex >= 2 && colIndex <= 7) {
          bgColor = colorSchemes.midterm.bg;
        } else if (colIndex >= 9) {
          bgColor = colorSchemes.finals.bg;
        }
        applyDataStyling(cell, bgColor);
      });
    });

    termSheet.columns.forEach(column => {
      column.width = 12;
    });

    // 3. CATEGORY-SPECIFIC SHEETS
    const createCategorySheet = (
      categoryName: string,
      midtermActivities: Grading[],
      midtermDetails: GradingDetail[],
      finalsActivities: Grading[],
      finalsDetails: GradingDetail[],
      colorScheme: any
    ) => {
      const worksheet = workbook.addWorksheet(categoryName, {
        views: [{showGridLines: false}]
      });

      let currentRow = addTitleSection(worksheet, 1);

      // Dynamic headers based on activities
      const headers = ['Student ID', 'Name'];
      
      // Add midterm activity headers
      midtermActivities?.forEach((activity, index) => {
        headers.push(`M-${index + 1}`);
      });
      headers.push('M-Total');
      headers.push(''); // Separator
      
      // Add finals activity headers
      finalsActivities?.forEach((activity, index) => {
        headers.push(`F-${index + 1}`);
      });
      headers.push('F-Total');

      // Apply headers
      headers.forEach((header, index) => {
        const cell = worksheet.getCell(currentRow, index + 1);
        cell.value = header;
        applyHeaderStyling(worksheet, cell.address, colorScheme.header);
      });

      // NEW: Add date row for Attendance (Category 4)
      if (categoryName === 'Attendance') {
        currentRow++; // Move to next row for dates

        // Student ID & Name columns remain empty
        worksheet.getCell(currentRow, 1).value = '';
        worksheet.getCell(currentRow, 2).value = '';

        let colIndex = 3; // Start from M-1 column

        const formatDate = (dateString: string) => {
          if (!dateString) return '';
          try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
          } catch (e) {
            return dateString.slice(0, 10); // Fallback to simple slice if parsing fails
          }
        };

        // Midterm dates
        midtermActivities?.forEach((activity) => {
          const dateCell = worksheet.getCell(currentRow, colIndex++);
          dateCell.value = formatDate(activity.date)// Display the date
          dateCell.font = { italic: true, size: 9 };
          dateCell.alignment = { vertical: 'middle', horizontal: 'center' };
          applyDataStyling(dateCell, colorScheme.bg);
        });

        // Skip M-Total and separator
        colIndex += 2;

      
        // Finals dates
        finalsActivities?.forEach((activity) => {
          const dateCell = worksheet.getCell(currentRow, colIndex++);
          dateCell.value = formatDate(activity.date); // Display the date
          dateCell.font = { italic: true, size: 9 };
          dateCell.alignment = { vertical: 'middle', horizontal: 'center' };
          applyDataStyling(dateCell, colorScheme.bg);
        });

        // Skip F-Total
      }

      // Data rows (student scores)
      enrolledStudents.forEach((student, studentIndex) => {
        const row = currentRow + 1 + studentIndex;
        let colIndex = 1;

        // Student info
        worksheet.getCell(row, colIndex++).value = student.studentId;
        worksheet.getCell(row, colIndex++).value = student.name;

        // Midterm activities
        midtermActivities?.forEach((activity) => {
          const score = getStudentScore(student.enrollmentId, activity.id, midtermDetails);
          const cell = worksheet.getCell(row, colIndex++);
          cell.value = score !== "" ? `${score}/${activity.numberOfItems}` : "";
          applyDataStyling(cell, colorScheme.bg);
        });

        // Midterm total
        const midtermTotal = calculateCategoryTotal(student.enrollmentId, midtermActivities, midtermDetails);
        const midtermTotalCell = worksheet.getCell(row, colIndex++);
        midtermTotalCell.value = midtermTotal;
        midtermTotalCell.font = { bold: true };
        applyDataStyling(midtermTotalCell, colorScheme.bg);

        colIndex++; // Separator

        // Finals activities
        finalsActivities?.forEach((activity) => {
          const score = getStudentScore(student.enrollmentId, activity.id, finalsDetails);
          const cell = worksheet.getCell(row, colIndex++);
          cell.value = score !== "" ? `${score}/${activity.numberOfItems}` : "";
          applyDataStyling(cell, colorScheme.bg);
        });

        // Finals total
        const finalsTotal = calculateCategoryTotal(student.enrollmentId, finalsActivities, finalsDetails);
        const finalsTotalCell = worksheet.getCell(row, colIndex++);
        finalsTotalCell.value = finalsTotal;
        finalsTotalCell.font = { bold: true };
        applyDataStyling(finalsTotalCell, colorScheme.bg);
      });

      worksheet.columns.forEach(column => {
        column.width = 10;
      });
      
      // Make student info columns wider
      worksheet.getColumn(1).width = 12;
      worksheet.getColumn(2).width = 20;
    };

    // Create category sheets
    createCategorySheet('Quiz', midtermQuizActivities || [], midtermQuizDetails || [], 
                      finalsQuizActivities || [], finalsQuizDetails || [], colorSchemes.quiz);
    
    createCategorySheet('Activity', midtermActivityActivities || [], midtermActivityDetails || [], 
                      finalsActivityActivities || [], finalsActivityDetails || [], colorSchemes.activity);
    
    createCategorySheet('Exam', midtermExamActivities || [], midtermExamDetails || [], 
                      finalsExamActivities || [], finalsExamDetails || [], colorSchemes.exam);
    
    createCategorySheet('Attendance', midtermAttendanceActivities || [], midtermAttendanceDetails || [], 
                      finalsAttendanceActivities || [], finalsAttendanceDetails || [], colorSchemes.attendance);

    // Generate and download file
    const filename = `grades_${subjectName}_${sem}_${academicYear}_${section}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Create download link
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="">
      <button
        onClick={createExcelFile}
        disabled={!enrolledStudents || !term1 || !term2 || !semGrade}
        className={`
          p-2 rounded-md font-medium text-white shadow-lg transform transition-all duration-200
          ${!enrolledStudents || !term1 || !term2 || !semGrade
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-105 hover:shadow-xl'
          }
        `}
      >
        {!enrolledStudents || !term1 || !term2 || !semGrade ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading Data...
          </span>
        ) : (
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            .xlsx
          </span>
        )}
      </button>
    </div>
  );
}