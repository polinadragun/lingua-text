import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import {LanguageSwitcher} from "../ui/LanguageSwitcher";

export const Navbar = () => {
    const navigate = useNavigate();
    const logout = useAuthStore(state => state.logout);
    const user = useAuthStore(state => state.user);

    const handleLogout = async () => {
        await logout();
        navigate("/auth");
    };

    return (
        <nav className="navbar glass">
            <div className="nav-left">
                <div className="nav-logo">Lingua</div>
                <LanguageSwitcher />
            </div>


            <div className="nav-links">
                <NavLink to="/" end className="nav-link">
                    Catalog
                </NavLink>


                <NavLink to="/profile" className="nav-link">
                    Profile
                </NavLink>

                <NavLink to="/my-texts" className="nav-link">
                    My texts
                </NavLink>


                <div className="nav-user">
                    <span className="nav-email">{user?.email}</span>

                    <button
                        className="nav-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};