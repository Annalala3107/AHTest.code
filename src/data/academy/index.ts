import { AcademyCourse } from '../../types';
import { cStage1Module } from './cStage1';
import { cStage2Module } from './cStage2';
import { cppCourse } from './cppCourse';
import { pythonCourse } from './pythonCourse';
import { academyEnTranslations } from '../academyTranslations';
import { fptuAppliedExercises } from '../fptuAppliedExercises';

export const cCourse: AcademyCourse = {
  id: 'c-curriculum',
  slug: 'c-dev-cpp-full',
  title: 'Giáo Trình C/C++ Toàn Diện (Cơ Bản Đến Trung Cấp)',
  titleEn: 'Comprehensive C/C++ Curriculum (Beginner to Intermediate)',
  language: 'c',
  level: 'Beginner',
  description: 'Giáo trình chuẩn mực 2 giai đoạn: Giai đoạn 1 (Nền tảng lập trình & Giao tiếp với máy tính) và Giai đoạn 2 (Quản lý bộ nhớ, Con trỏ & Cấu trúc dữ liệu) theo môi trường Embarcadero Dev-C++ / GCC.',
  descriptionEn: 'Comprehensive 2-stage curriculum: Stage 1 (Core Programming & System I/O) and Stage 2 (Memory Management, Pointers & Advanced Structs) based on Embarcadero Dev-C++ / GCC.',
  totalLessons: 14,
  estimatedHours: 8,
  modules: [cStage1Module, cStage2Module]
};

const rawCourses: AcademyCourse[] = [
  cCourse,
  cppCourse,
  pythonCourse
];

// Enrich curriculum lessons with English translations and FPTU Applied Exercises
rawCourses.forEach(course => {
  course.modules.forEach(mod => {
    mod.lessons.forEach(lesson => {
      // Attach FPTU applied practical exercises
      if (fptuAppliedExercises[lesson.id]) {
        lesson.appliedExercises = fptuAppliedExercises[lesson.id];
      }
      // Attach English translations
      const trans = academyEnTranslations[lesson.id];
      if (trans) {
        lesson.titleEn = trans.titleEn;
        lesson.summaryEn = trans.summaryEn;
        lesson.contentEn = trans.contentEn;
        lesson.hintsEn = trans.hintsEn;
      }
      // Provide default explanations for test cases if missing
      if (lesson.testcases) {
        lesson.testcases.forEach(tc => {
          if (!tc.explanationVi) {
            tc.explanationVi = 'Đầu vào "' + (tc.input || 'mặc định') + '" tạo ra kết quả kỳ vọng "' + tc.expectedOutput + '".';
          }
          if (!tc.explanationEn) {
            tc.explanationEn = 'Input "' + (tc.input || 'default') + '" yields expected output "' + tc.expectedOutput + '".';
          }
        });
      }
    });
  });
});

export const mockCourses: AcademyCourse[] = rawCourses;
