import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

app.get('/api/courses', async (req, res) => {
  console.log('GET /api/courses - запит отримано');
  try {
    const userId = 1; 

    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: { lessons: true }
        }
      },
      orderBy: { id: 'asc' } 
    });

    const userProgress = await prisma.progress.findMany({
      where: { userId: userId, isCompleted: true },
      select: { lessonId: true }
    });
    
    const completedLessonIds = userProgress.map(p => p.lessonId);

    const formattedCourses = courses.map(course => {
      const allLessons = course.modules.flatMap(m => m.lessons);
      const totalLessons = allLessons.length;

      const completedCount = allLessons.filter(lesson => 
        completedLessonIds.includes(lesson.id)
      ).length;

      const percentage = totalLessons === 0 
        ? 0 
        : Math.round((completedCount / totalLessons) * 100);

      return {
        ...course,
        completed: percentage, 
        lessons: allLessons   
      };
    });

    res.json(formattedCourses);
  } catch (error) {
    console.error('Помилка в /api/courses:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`GET /api/courses/${id} - запит отримано`);

  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        modules: {
          include: { lessons: true }
        }
      }
    });

    if (!course) {
      console.log(`Курс ${id} не знайдено в базі`);
      return res.status(404).json({ error: 'Курс не знайдено' });
    }

    const formattedCourse = {
      ...course,
      completed: 0, 
      lessons: course.modules.flatMap(m => m.lessons)
    };

    res.json(formattedCourse);
  } catch (error) {
    console.error(`Помилка в /api/courses/${id}:`, error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.get('/api/progress', async (req, res) => {
  try {
    const userId = 1; 
    const progress = await prisma.progress.findMany({
      where: { userId: userId, isCompleted: true },
      select: { lessonId: true }
    });
    res.json(progress.map(p => p.lessonId));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка отримання прогресу' });
  }
});

app.post('/api/progress/toggle', async (req, res) => {
  try {
    const { lessonId } = req.body;
    const userId = 1; 

    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId }
      }
    });

    if (existingProgress) {
      await prisma.progress.delete({ where: { id: existingProgress.id } });
      res.json({ completed: false });
    } else {
      await prisma.progress.create({
        data: { userId, lessonId, isCompleted: true }
      });
      res.json({ completed: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не вдалося зберегти прогрес' });
  }
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});