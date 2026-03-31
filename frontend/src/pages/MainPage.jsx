import * as React from "react";
import {Link, Navigate} from "react-router-dom";
import {Card, CardContent} from "@/components/ui/card";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger
} from "@/components/ui/menubar";
import {jwtDecode} from "jwt-decode";

export default function MainPage() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);
    const [role, setRole] = React.useState(null);

    const isTokenValid = () => {
        const token = localStorage.getItem("jwt");
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
        const token = localStorage.getItem("jwt");
        if (!token) return false;

        try {
            const response = await fetch("/vatroslav/api/auth/verify", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`, // FIX
                },
            });

            return response.ok;
        } catch {
            return false;
        }
    };

    const getUserRole = () => {
        const token = localStorage.getItem("jwt");
        if (!token) return null;

        try {
            const decoded = jwtDecode(token);
            return decoded.role;
        } catch {
            return null;
        }
    };

    React.useEffect(() => {
        const init = async () => {
            const validLocal = isTokenValid();
            const validBackend = await verifyToken();

            if (!validLocal || !validBackend) {
                localStorage.removeItem("jwt");
                setIsAuthenticated(false);
                return;
            }

            setRole(getUserRole());
            setIsAuthenticated(true);
        };

        init();
    }, []);

    if (isAuthenticated === false) {
        return <Navigate to="/login"/>;
    }

    if (isAuthenticated === null) {
        return <p>Loading...</p>;
    }

    // 🔹 osnovne kartice
    const items = [
        {path: "/experimenti", label: "Eksperimenti"},
        {path: "/komponente", label: "Komponente"},
        {path: "/experimentunos", label: "Dodaj eksperiment"},
        {path: "/komponenteunos", label: "Dodaj komponentu"},
        {path: "/account", label: "Račun"},
        {path: "/signup", label: "Dodaj korisnika", adminOnly: true},
    ];


    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-[65vw]">
                    {items.map((item, index) => {
                        const isDisabled = item.adminOnly && role !== "ROLE_ADMIN";

                        return (
                            <div key={index} className="p-1">
                                {isDisabled ? (
                                    <Card className="opacity-50 cursor-not-allowed">
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <span className="text-3xl font-bold">{item.label}</span>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Link to={item.path}>
                                        <Card className="hover:bg-pink-500 hover:text-white transition duration-300">
                                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                                <span className="text-3xl font-bold">{item.label}</span>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 🔴 logout */}
                <Menubar>
                    <MenubarMenu>
                        <Link to="/home">
                            <MenubarTrigger
                                className="w-40 hover:bg-red-500"
                                onClick={() => {
                                    localStorage.removeItem("jwt");
                                }}
                            >
                                Odjava
                            </MenubarTrigger>
                        </Link>
                    </MenubarMenu>
                </Menubar>
            </div>
        </div>
    );
}