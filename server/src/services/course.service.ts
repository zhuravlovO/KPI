import { PrismaClient } from '@prisma/client';

export class CourseService {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getAllCoursesWithProgress(userId: number) {
    const courses = await this.prisma.course.findMany({
      include: { modules: { include: { lessons: true } } },
      orderBy: { id: 'asc' }
    });

    const userProgress = await this.prisma.progress.findMany({
      where: { userId: userId, isCompleted: true },
      select: { lessonId: true }
    });
    const completedIds = userProgress.map(p => p.lessonId);

    return courses.map(course => {
      const allLessons = course.modules.flatMap(m => m.lessons);
      const total = allLessons.length;
      
      const completedCount = allLessons.filter(l => 
        completedIds.includes(l.id)
      ).length;

      const percentage = total === 0 ? 0 : Math.round((completedCount / total) * 100);

      return {
        ...course,
        completed: percentage,
        lessons: allLessons
      };
    });
  }

  async getCourseById(courseId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { modules: { include: { lessons: true } } }
    });

    if (!course) return null;

    return {
      ...course,
      completed: 0, 
      lessons: course.modules.flatMap(m => m.lessons)
    };
  }
}