import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useUserDataStore } from './store/userData';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user } = useUserDataStore();

  return (
    <>
      {user ? <Header /> : null}
      <ToastContainer autoClose={2000} />
      <Outlet />
    </>
  );
}

export default App;
