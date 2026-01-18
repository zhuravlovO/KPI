import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { CoursePage } from './CoursePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/course/:id" element={<CoursePage />} />
    </Routes>
  );
}

export default App;