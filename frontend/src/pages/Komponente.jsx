import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function Komponente() {
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const isTokenValid = () => {
        const token = localStorage.getItem("jwt");
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp > currentTime;
        } catch (error) {
            return false;
        }
    };

    const verifyToken = async () => {
        const token = localStorage.getItem("jwt");
        if (!token) return false;
        try {
            const response = await fetch("/aplikacija/api/auth/verify", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    useEffect(() => {
        const fetchComponents = async () => {
            const token = localStorage.getItem("jwt");

            const isValid = isTokenValid();
            const isVerified = await verifyToken();
            if (!isValid || !isVerified) {
                localStorage.removeItem("jwt");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("/aplikacija/api/component/getAll", {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Greška prilikom dohvaćanja podataka!");
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
            const response = await fetch(`/aplikacija/api/component/delete/${id}`, {
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
                    {!loading && !error && components.map((component) => (
                        <div
                            key={component.id}
                            className="flex items-center justify-between bg-pink-200 p-5 mb-4 rounded-lg shadow-lg"
                            style={{width: "80vw"}}
                        >
                            <Link to={`/komponenteprimjer/${component.id}`} className="text-blue-500">
                                {component.name}
                            </Link>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded"
                                onClick={() => handleDeleteComponent(component.id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
