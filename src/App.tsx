import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import CourseList from '@/pages/CourseList';
import CourseDetail from '@/pages/CourseDetail';
import CoursePlayer from '@/pages/CoursePlayer';
import VocabularyHome from '@/pages/VocabularyHome';
import VocabularyDetail from '@/pages/VocabularyDetail';
import MyDictionary from '@/pages/MyDictionary';
import CommunityHome from '@/pages/CommunityHome';
import CommunityPost from '@/pages/CommunityPost';
import CreatePost from '@/pages/CreatePost';
import TranslateList from '@/pages/TranslateList';
import TranslateCreate from '@/pages/TranslateCreate';
import TranslateDetail from '@/pages/TranslateDetail';
import Progress from '@/pages/Progress';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

function LayoutWrapper() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWrapper />,
    children: [
      { index: true, element: <Home /> },
      { path: 'courses', element: <CourseList /> },
      { path: 'courses/:id', element: <CourseDetail /> },
      { path: 'courses/:id/learn/:lessonId', element: <CoursePlayer /> },
      { path: 'vocabulary', element: <VocabularyHome /> },
      { path: 'vocabulary/:wordId', element: <VocabularyDetail /> },
      { path: 'vocabulary/my-dictionary', element: <MyDictionary /> },
      { path: 'community', element: <CommunityHome /> },
      { path: 'community/post/:postId', element: <CommunityPost /> },
      { path: 'community/create', element: <CreatePost /> },
      { path: 'translate', element: <TranslateList /> },
      { path: 'translate/create', element: <TranslateCreate /> },
      { path: 'translate/:orderId', element: <TranslateDetail /> },
      { path: 'progress', element: <Progress /> },
      { path: 'profile', element: <Profile /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

export { router };
