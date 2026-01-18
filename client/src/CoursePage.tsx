import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Play, Circle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { Course, Lesson } from './data';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Завантаження даних
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await fetch(`${API_URL}/api/courses/${id}`);
        if (!courseRes.ok) throw new Error('Course not found');
        const courseData = await courseRes.json();
        
        const progressRes = await fetch(`${API_URL}/api/progress`);
        const progressData = await progressRes.json();

        setCourse(courseData);
        setCompleted(progressData);

        if (courseData.lessons && courseData.lessons.length > 0) {
          setActiveLesson(courseData.lessons[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleComplete = async (lessonId: number) => {
    const isAlreadyCompleted = completed.includes(lessonId);
    if (isAlreadyCompleted) {
      setCompleted(completed.filter(id => id !== lessonId));
    } else {
      setCompleted([...completed, lessonId]);
    }
    
    try {
      await fetch(`${API_URL}/api/progress/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId })
      });
    } catch (error) {
      console.error("Failed to save progress", error);
    }
  };

  const getEmbedUrl = (url: string) => {
    return url.replace('watch?v=', 'embed/');
  };

  if (loading) return <div className="p-10 text-center">Завантаження...</div>;
  if (!course || !activeLesson) return <div>Курс не знайдено</div>;

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="h-16 border-b flex items-center px-6 bg-white shrink-0 z-10">
        <Link to="/" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mr-6 transition-colors">
          <ArrowLeft size={20} />
          Назад до курсів
        </Link>
        <h1 className="font-bold text-lg truncate">Курс: {course.title}</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Плеєр */}
        <div className="flex-1 bg-black flex flex-col">
          <div className="flex-1 relative">
            <iframe 
              src={getEmbedUrl(activeLesson.video)} 
              title={activeLesson.title}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="p-6 bg-white border-t h-32 shrink-0 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold mb-1">{activeLesson.title}</h2>
              <p className="text-gray-500 text-sm">Тривалість: {activeLesson.duration}</p>
            </div>
            <button 
              onClick={() => toggleComplete(activeLesson.id)}
              className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${
                completed.includes(activeLesson.id) 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
              }`}
            >
              {completed.includes(activeLesson.id) ? (
                <> <CheckCircle size={20} /> Завершено </>
              ) : (
                <> Позначити як пройдене </>
              )}
            </button>
          </div>
        </div>

        {/* Список уроків */}
        <div className="w-96 border-l bg-gray-50 overflow-y-auto shrink-0">
          <div className="p-5 font-bold text-gray-700 border-b bg-white">
            Зміст курсу
          </div>
          <div>
            {course.lessons.map((lesson) => (
              <div 
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-100 flex gap-3 ${
                  activeLesson.id === lesson.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="mt-1">
                  {activeLesson.id === lesson.id ? (
                    <Play size={16} className="text-blue-600 fill-current" />
                  ) : completed.includes(lesson.id) ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <Circle size={16} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <div className={`text-sm font-medium ${activeLesson.id === lesson.id ? 'text-blue-700' : 'text-gray-700'}`}>
                    {lesson.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{lesson.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}