
export interface Lesson {
  id: number;
  title: string;
  duration: string;
  video: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  completed?: number; 
  lessons: Lesson[];
}
