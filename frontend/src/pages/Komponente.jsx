import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function Komponente() {
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

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
                headers: {"Content-Type": "application/json", Authorization: `${token}`},
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

    useEffect(() => {
        const fetchComponents = async () => {
            const isValid = isTokenValid();
            const isVerified = await verifyToken();

            if (!isValid || !isVerified) {
                localStorage.removeItem("jwt");
                navigate("/login");
                return;
            }

            setRole(getUserRole());

            const token = localStorage.getItem("jwt");
            try {
                const response = await fetch("/vatroslav/api/component/getAll", {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                if (!response.ok) {
                    if (response.status === 403) setError("Nemate ovlasti za pregled komponenti.");
                    else if (response.status === 401) setError("Niste prijavljeni. Molimo prijavite se.");
                    else setError("Greška prilikom dohvaćanja podataka!");
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setComponents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComponents();
    }, [navigate]);

    const handleDeleteComponent = async (id) => {
        const token = localStorage.getItem("jwt");
        try {
            const response = await fetch(`/vatroslav/api/component/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Greška prilikom brisanja komponente!");
            }
            setComponents((prev) => prev.filter((comp) => comp.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div>
                <header
                    className="fixed top-0 left-0 w-full bg-pink-500 text-white py-4 text-center text-2xl font-bold z-50">
                    Lista Komponenata
                </header>

                <div className="pt-20">
                    {loading && <p>Učitavanje podataka...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && components.length === 0 && (
                        <p>Nema dostupnih komponenti.</p>
                    )}
                    {!loading && !error && components.map((component) => {
                        const isAdmin = role === "ROLE_ADMIN";
                        return (
                            <div
                                key={component.id}
                                className="flex items-center justify-between bg-pink-200 p-5 mb-4 rounded-lg shadow-lg"
                                style={{width: "80vw"}}
                            >
                                <Link to={`/komponenteprimjer/${component.id}`} className="text-blue-500">
                                    {component.name}
                                </Link>
                                <div className="flex gap-2">
                                    {isAdmin ? (
                                        <>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleDeleteComponent(component.id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded opacity-50 cursor-not-allowed">
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
