import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LessonPage from './pages/LessonPage';
import Practice from './pages/Practice';
import Quiz from './pages/Quiz';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import Bootcamp from './pages/Bootcamp';
import BootcampProject from './pages/BootcampProject';
import LearningPlan from './pages/LearningPlan';
import Auth from './pages/Auth';
import AIChat from './pages/AIChat';
import { preloadPyodide } from './utils/pyodide';

// 进入网站立即在后台预加载 Python 环境
// 用户浏览首页时，Python 环境已在后台下载，进入课程页时可能已就绪
preloadPyodide();

// 注册 Service Worker 缓存 Pyodide 文件，二次访问秒加载
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:moduleId" element={<CourseDetail />} />
          <Route path="courses/:moduleId/:lessonId" element={<LessonPage />} />
          <Route path="practice/:exerciseId" element={<Practice />} />
          <Route path="quiz/:moduleId" element={<Quiz />} />
          <Route path="bootcamp" element={<Bootcamp />} />
          <Route path="learning-plan/:moduleId" element={<LearningPlan />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="profile" element={<Profile />} />
          <Route path="auth" element={<Auth />} />
        </Route>
        <Route path="bootcamp/:projectId" element={<BootcampProject />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
