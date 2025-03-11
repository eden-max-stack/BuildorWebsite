import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";  

function NavBar() {
  const navigate = useNavigate();
  return (
    <div className="navbar bg-base-100 shadow-md fixed top-0 left-0 w-full z-50 h-16 px-4">
      {/* Left Side - Side Panel Button */}
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Center - Branding */}
      <div className="flex-1 text-center">
        <a className="btn btn-ghost text-xl">Buildor</a>
      </div>

      {/* Right Side - User Profile Dropdown */}
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="User Profile" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li><button className="btn btn-soft btn-primary btn-outline rounded-full" onClick={handleSignOut}>Sign Out</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
