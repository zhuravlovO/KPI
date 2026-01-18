import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Починаю наповнення бази...');

  await prisma.progress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const reactCourse = await prisma.course.create({
    data: {
      title: 'React для початківців',
      description: 'Вивчіть основи React: компоненти, пропси, хуки.',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
      modules: {
        create: {
          title: 'Основний модуль',
          lessons: {
            create: [
              { title: 'Вступ до курсу', duration: '10:05', video: 'https://www.youtube.com/watch?v=SqcY0GlETPk' },
              { title: 'Компоненти та JSX', duration: '15:30', video: 'https://www.youtube.com/watch?v=kYV90v4tKvo' },
              { title: 'Props та State', duration: '12:45', video: 'https://www.youtube.com/watch?v=9jMBz6G_8N4' },
            ],
          },
        },
      },
    },
  });

  const nodeCourse = await prisma.course.create({
    data: {
      title: 'Node.js та Express',
      description: 'Повний курс по бекенду. REST API, бази даних.',
      image: 'https://images.unsplash.com/photo-1627398242450-2701705a6302?q=80&w=1000&auto=format&fit=crop',
      modules: {
        create: {
          title: 'Backend Basics',
          lessons: {
            create: [
              { title: 'Що таке Node.js?', duration: '08:20', video: 'https://www.youtube.com/watch?v=TlB_eWDSMt4' },
              { title: 'Створення сервера', duration: '14:10', video: 'https://www.youtube.com/watch?v=L72fhGm1tfE' },
            ],
          },
        },
      },
    },
  });

  console.log(' База наповнена!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());