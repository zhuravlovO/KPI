import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Починаю наповнення бази...');

  await prisma.progress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      id: 1,
      email: 'student@test.com',
      role: 'STUDENT',
      fullName: 'Test Student'
    }
  });

  // --- КУРС 1: React ---
  await prisma.course.create({
    data: {
      title: 'React: Сучасний Frontend',
      description: 'Створення компонентів, хуки, Redux Toolkit та оптимізація продуктивності.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png',
      modules: {
        create: {
          title: 'Основи',
          lessons: {
            create: [
              { title: 'Вступ та JSX', duration: '10:05', video: 'https://www.youtube.com/watch?v=SqcY0GlETPk' },
              { title: 'useState та useEffect', duration: '15:30', video: 'https://www.youtube.com/watch?v=kYV90v4tKvo' },
              { title: 'Робота з формами', duration: '12:45', video: 'https://www.youtube.com/watch?v=9jMBz6G_8N4' },
            ],
          },
        },
      },
    },
  });

  // --- КУРС 2: Node.js ---
  await prisma.course.create({
    data: {
      title: 'Node.js Backend Developer',
      description: 'Побудова REST API, робота з базами даних, авторизація та безпека.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg',
      modules: {
        create: {
          title: 'Серверна частина',
          lessons: {
            create: [
              { title: 'Event Loop в деталях', duration: '08:20', video: 'https://www.youtube.com/watch?v=TlB_eWDSMt4' },
              { title: 'Express.js та Middleware', duration: '14:10', video: 'https://www.youtube.com/watch?v=L72fhGm1tfE' },
            ],
          },
        },
      },
    },
  });

  // --- КУРС 3: TypeScript ---
  await prisma.course.create({
    data: {
      title: 'TypeScript Pro',
      description: 'Типізація JavaScript. Інтерфейси, дженеріки, декоратори та утилітарні типи.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1024px-Typescript_logo_2020.svg.png',
      modules: {
        create: {
          title: 'Типізація',
          lessons: {
            create: [
              { title: 'Базові типи', duration: '05:00', video: 'https://www.youtube.com/watch?v=ahCwqrYpIuM' },
              { title: 'Generics на практиці', duration: '20:10', video: 'https://www.youtube.com/watch?v=1j_Kj111kYQ' },
            ],
          },
        },
      },
    },
  });

  // --- КУРС 4: Docker & DevOps ---
  await prisma.course.create({
    data: {
      title: 'Docker та DevOps для початківців',
      description: 'Контейнеризація додатків, Docker Compose, CI/CD pipelines.',
      image: 'https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png',
      modules: {
        create: {
          title: 'Контейнери',
          lessons: {
            create: [
              { title: 'Що таке контейнер?', duration: '07:15', video: 'https://www.youtube.com/watch?v=pTFZFxd4hOI' },
              { title: 'Пишемо Dockerfile', duration: '18:00', video: 'https://www.youtube.com/watch?v=0g7e5tq7e4k' },
            ],
          },
        },
      },
    },
  });

  // --- КУРС 5: Python ---
  await prisma.course.create({
    data: {
      title: 'Python Data Science',
      description: 'Аналіз даних, Pandas, NumPy та візуалізація. Вступ до машинного навчання.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1024px-Python-logo-notext.svg.png',
      modules: {
        create: {
          title: 'Аналітика',
          lessons: {
            create: [
              { title: 'Синтаксис Python', duration: '11:00', video: 'https://www.youtube.com/watch?v=kqtD5dpn9C8' },
              { title: 'Робота з Pandas', duration: '22:30', video: 'https://www.youtube.com/watch?v=vmEHCJofslg' },
            ],
          },
        },
      },
    },
  });

  console.log(' База наповнена 5 курсами!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());