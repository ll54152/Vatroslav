import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function Experimenti() {
    const [experiments, setExperiments] = useState([]);
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
            const response = await fetch("http://localhost:8080/auth/verify", {
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
        const checkAuthAndFetch = async () => {
            const isValid = isTokenValid();
            const isVerified = await verifyToken();
            if (!isValid || !isVerified) {
                localStorage.removeItem("jwt");
                navigate("/login");
                return;
            }

            const token = localStorage.getItem("jwt");
            try {
                const response = await fetch("http://localhost:8080/experiment/getAll", {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Greška prilikom dohvaćanja podataka!");
                }
                const data = await response.json();
                setExperiments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetch();
    }, [navigate]);

    const handleDeleteExperiment = async (id) => {
        const token = localStorage.getItem("jwt");
        try {
            const response = await fetch(`http://localhost:8080/experiment/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Greška prilikom brisanja eksperimenta!");
            }
            setExperiments((prev) => prev.filter((comp) => comp.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div>
                <header
                    className="fixed top-0 left-0 w-full bg-pink-500 text-white py-4 text-center text-2xl font-bold z-50">
                    Lista Eksperimenata
                </header>

                <div className="pt-20">
                    {loading && <p>Učitavanje podataka...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && experiments.length === 0 && (
                        <p>Nema dostupnih eksperimenata.</p>
                    )}
                    {!loading && !error && experiments.map((component) => (
                        <div
                            key={component.id}
                            className="flex items-center justify-between bg-pink-200 p-5 mb-4 rounded-lg shadow-lg"
                            style={{width: "80vw"}}
                        >
                            <Link to={`/experimentiprimjer/${component.id}`} className="text-blue-500">
                                {component.name}
                            </Link>
                            <div className="flex gap-2">
                                <Link
                                    to={`/experimenti/edit/${component.id}`}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                >
                                    Edit
                                </Link>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => handleDeleteExperiment(component.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
