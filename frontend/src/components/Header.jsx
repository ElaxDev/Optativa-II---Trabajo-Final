import { Link, useNavigate } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';
import { useUserDataStore } from '../store/userData';
import { useMutation } from '@tanstack/react-query';
import { logoutUserFn } from '../api/authApi';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import Loader from './Loader';
import { IconContext } from 'react-icons';

function Header() {
  const { user, logout } = useUserDataStore();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: logoutUserFn,
    onSuccess: (data) => {
      logout();
      useUserDataStore.persist.clearStorage();
      toast.success(data.message);
      navigate('/');
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error(error.message ? error.message : 'An error occurred');
      }
    },
  });

  function logoutHandler(e) {
    e.preventDefault();
    mutate();
  }

  return (
    <div className="relative">
      <div className="navbar transition duration-200 bg-neutral/85 hover:bg-neutral/100 text-neutral-content absolute w-full z-40 max-h-32">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
          </div>
          <Link className="btn btn-ghost text-xl" to="/">
            Inventory App
          </Link>
        </div>

        <div className="navbar-end gap-3 mx-3">
          <>
            <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1">
                {user.username}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 text-base-content rounded-box w-52"
              >
                <IconContext.Provider
                  value={{ className: 'text-lg currentColor' }}
                >
                  <li>
                    <a onClick={logoutHandler}>
                      <MdLogout />
                      Cerrar sesión
                    </a>
                  </li>
                </IconContext.Provider>
              </ul>
            </div>
          </>
        </div>
      </div>
      {isPending && <Loader />}
    </div>
  );
}

export default Header;
