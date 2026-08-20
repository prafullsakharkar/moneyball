import { RouterProvider } from 'react-router-dom';
import { AppProvider } from '@providers/index';
import { router } from '@routes/index';

export function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
