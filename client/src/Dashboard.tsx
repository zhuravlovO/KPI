import { useEffect, useState } from 'react';
import { BookOpen, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Course } from './data'; 
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => console.error('Помилка завантаження:', err));
  }, []);

  if (loading) return <div className="p-10 text-center">Завантаження курсів з сервера...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <BookOpen /> LMS Platform
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Студент</span>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              U
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Курси (з бази даних Neon)</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link to={`/course/${course.id}`} key={course.id}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                <div className="h-40 overflow-hidden shrink-0">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{course.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Прогрес</span>
                      <span>{course.completed || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${course.completed || 0}%` }}></div>
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg transition-colors text-sm">
                    <PlayCircle size={16} />
                    Почати навчання
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}