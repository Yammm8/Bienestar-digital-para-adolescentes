import { RouterProvider } from 'react-router';
import { router } from './routes';
import { WellbeingProvider } from './contexts/WellbeingContext';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <WellbeingProvider>
        <RouterProvider router={router} />
      </WellbeingProvider>
    </AuthProvider>
  );
}