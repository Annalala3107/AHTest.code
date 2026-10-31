import { z } from 'zod';

export const AppliedTestCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  explanationVi: z.string().optional(),
  explanationEn: z.string().optional(),
  isHidden: z.boolean().optional(),
});

export const AppliedExerciseSchema = z.object({
  id: z.string().min(1),
  questionCode: z.string().min(1),
  titleVi: z.string().min(1),
  titleEn: z.string().min(1),
  category: z.string().min(1),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  descriptionVi: z.string().min(1),
  descriptionEn: z.string().min(1),
  initialCode: z.string(),
  solutionCode: z.string().optional(),
  testcases: z.array(AppliedTestCaseSchema),
  hintsVi: z.array(z.string()),
  hintsEn: z.array(z.string()),
});

export const AcademyLessonSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  titleEn: z.string().optional(),
  durationMinutes: z.number().positive(),
  summary: z.string().min(1),
  summaryEn: z.string().optional(),
  content: z.string().min(10), // Ensures non-empty Markdown theory
  contentEn: z.string().optional(),
  initialCode: z.string(),
  expectedOutputRegex: z.string().optional(),
  solutionCode: z.string(),
  hints: z.array(z.string()),
  hintsEn: z.array(z.string()).optional(),
  testcases: z.array(AppliedTestCaseSchema),
  appliedExercises: z.array(AppliedExerciseSchema).optional(),
});

export const AcademyModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  titleEn: z.string().optional(),
  description: z.string().min(1),
  descriptionEn: z.string().optional(),
  lessons: z.array(AcademyLessonSchema),
});

export const AcademyCourseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  titleEn: z.string().optional(),
  slug: z.string().min(1),
  language: z.enum(['c', 'cpp', 'python']),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  description: z.string().min(1),
  descriptionEn: z.string().optional(),
  totalLessons: z.number().nonnegative(),
  estimatedHours: z.number().nonnegative(),
  modules: z.array(AcademyModuleSchema),
  isComingSoon: z.boolean().optional(),
});

export type ValidatedAcademyCourse = z.infer<typeof AcademyCourseSchema>;
export type ValidatedAcademyLesson = z.infer<typeof AcademyLessonSchema>;

/**
 * Validates course structures and throws detailed descriptive errors
 * if any data field violates the schema contracts.
 */
export function validateAcademyCourse(courseData: unknown): ValidatedAcademyCourse {
  const result = AcademyCourseSchema.safeParse(courseData);
  if (!result.success) {
    const errorDetails = result.error.issues
      .map(issue => `[${issue.path.join('.')}]: ${issue.message}`)
      .join('\n');
    throw new Error(`[Academy Data Validation Error] Course integrity check failed:\n${errorDetails}`);
  }
  return result.data;
}
