import React from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {LogOut, Menu, X} from 'lucide-react';
import {Card} from "@/components/ui/card.jsx";

export default function Toolbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isAuthenticated, setIsAuthenticated] = React.useState(null);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const isTokenValid = () => {
        const token = localStorage.getItem('jwt');

        if (!token) return false;

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            return decoded.exp > currentTime;
        } catch {
            return false;
        }
    };

    const verifyToken = async () => {
        const token = localStorage.getItem('jwt');

        if (!token) return false;

        try {
            const response = await fetch('/vatroslav/api/auth/verify', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
            });

            return response.ok;
        } catch {
            return false;
        }
    };

    React.useEffect(() => {
        const init = async () => {
            const validLocal = isTokenValid();
            const validBackend = await verifyToken();

            if (!validLocal || !validBackend) {
                localStorage.removeItem('jwt');
                setIsAuthenticated(false);
                return;
            }

            setIsAuthenticated(true);
        };

        init();
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        navigate('/login');
    };


    if (isAuthenticated === null) return null;

    const isActive = (path) => location.pathname === path;

    const navLinksAuth = [
        {path: '/mainpage', label: 'Glavna stranica'},
        {path: '/experiments', label: 'Eksperimenti'},
        {path: '/components', label: 'Komponente'},
        {path: '/locations', label: 'Lokacije'},
        {path: '/logs', label: 'Logovi'},
        {path: '/users', label: 'Korisnici'},
    ];

    const navLinksUnauth = [
        {path: '/login', label: 'Prijava'},
        {path: '/experiments/public', label: 'Eksperimenti'},
    ];

    const navLinks = isAuthenticated ? navLinksAuth : navLinksUnauth;

    return (
        <nav className="sticky top-0 z-50">
            <Card className="mx-auto flex h-16 items-center justify-between px-4 md:px-6">

                <div className="text-lg font-semibold text-pink-600">
                    <Link className="text-lg font-semibold text-pink-600" to={isAuthenticated ? '/mainpage' : '/home'}>
                        Vatroslav
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors duration-200 ${
                                isActive(link.path)
                                    ? 'text-pink-600'
                                    : 'text-gray-700 hover:text-pink-500'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700"
                        >
                            <LogOut size={16}/>
                            Odjava
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100"
                >
                    {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                </button>
            </Card>

            {isMenuOpen && (
                <div className="border-t border-gray-200 bg-white md:hidden">
                    <div className="flex flex-col px-4 py-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`rounded-md px-3 py-3 text-sm font-medium transition ${
                                    isActive(link.path)
                                        ? 'bg-pink-50 text-pink-600'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="mt-3 flex items-center gap-2 rounded-md bg-red-50 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-100"
                            >
                                <LogOut size={16}/>
                                Odjava
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}