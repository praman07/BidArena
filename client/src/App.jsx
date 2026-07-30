import { Provider } from 'react-redux'
import store from '@/redux/store'
import { ToastProvider } from '@/components/ui/toast'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import AppRoutes from '@/routes/AppRoutes'

export default function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </Provider>
  )
}
