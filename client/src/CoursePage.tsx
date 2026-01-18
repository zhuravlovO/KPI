import { useState } from 'react';
import { ArrowLeft, CheckCircle, Play, Circle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const LESSONS = [
  { id: 1, title: 'Вступ до курсу. Налаштування оточення', duration: '10:05', video: 'https://www.youtube.com/watch?v=SqcY0GlETPk' },
  { id: 2, title: 'Компоненти та JSX. Як це працює?', duration: '15:30', video: 'https://www.youtube.com/watch?v=kYV90v4tKvo' },
  { id: 3, title: 'Props та State. Передача даних', duration: '12:45', video: 'https://www.youtube.com/watch?v=9jMBz6G_8N4' },
];

export function CoursePage() {
  const { id } = useParams();
  const [activeLesson, setActiveLesson] = useState(LESSONS[0]);
  const [completed, setCompleted] = useState<number[]>([1]);

  const toggleComplete = (lessonId: number) => {
    if (completed.includes(lessonId)) {
      setCompleted(completed.filter(id => id !== lessonId));
    } else {
      setCompleted([...completed, lessonId]);
    }
  };
  const getEmbedUrl = (url: string) => {
    return url.replace('watch?v=', 'embed/');
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Верхня панель */}
      <header className="h-16 border-b flex items-center px-6 bg-white shrink-0 z-10">
        <Link to="/" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mr-6 transition-colors">
          <ArrowLeft size={20} />
          Назад до курсів
        </Link>
        <h1 className="font-bold text-lg truncate">Курс #{id}: React для початківців</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Ліва частина - Плеєр (звичайний HTML iframe) */}
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
              <p className="text-gray-500 text-sm">Урок {activeLesson.id} з {LESSONS.length}</p>
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

        {/* Права частина - Список уроків */}
        <div className="w-96 border-l bg-gray-50 overflow-y-auto shrink-0">
          <div className="p-5 font-bold text-gray-700 border-b bg-white">
            Зміст курсу
          </div>
          <div>
            {LESSONS.map((lesson) => (
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