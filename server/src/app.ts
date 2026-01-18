import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { CourseService } from './services/course.service'; 

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const courseService = new CourseService(prisma);

const app = express();

app.use(cors());
app.use(express.json());

// --- ROUTES ---
app.get('/api/courses', async (req, res) => {
  try {
    const userId = 1; 
    const courses = await courseService.getAllCoursesWithProgress(userId);
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseById(Number(id));

    if (!course) {
      return res.status(404).json({ error: 'Курс не знайдено' });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
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
    res.status(500).json({ error: 'Помилка отримання прогресу' });
  }
});

app.post('/api/progress/toggle', async (req, res) => {
  try {
    const { lessonId } = req.body;
    const userId = 1; 

    const existing = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId } }
    });

    if (existing) {
      await prisma.progress.delete({ where: { id: existing.id } });
      res.json({ completed: false });
    } else {
      await prisma.progress.create({ data: { userId, lessonId, isCompleted: true } });
      res.json({ completed: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося зберегти прогрес' });
  }
});

export default app;