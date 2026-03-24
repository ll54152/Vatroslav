import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {Button} from "@/components/ui/button";

export default function Experimenti() {
    const [experiments, setExperiments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    // 🔹 frontend JWT check
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
        const init = async () => {
            const validLocal = isTokenValid();
            const validBackend = await verifyToken();

            if (!validLocal || !validBackend) {
                localStorage.removeItem("jwt");
                navigate("/login");
                return;
            }

            setRole(getUserRole());

            const token = localStorage.getItem("jwt");
            try {
                const response = await fetch("/vatroslav/api/experiment/getAll", {
                    headers: {Authorization: `${token}`},
                });

                if (!response.ok) {
                    if (response.status === 403) setError("Nemate ovlasti za pregled eksperimenata.");
                    else if (response.status === 401) setError("Niste prijavljeni. Molimo prijavite se.");
                    else setError("Greška prilikom dohvaćanja podataka!");
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setExperiments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [navigate]);

    const handleDeleteExperiment = async (id) => {
        const token = localStorage.getItem("jwt");
        try {
            const response = await fetch(`/vatroslav/api/experiment/delete/${id}`, {
                method: "DELETE",
                headers: {Authorization: `${token}`},
            });

            if (!response.ok) throw new Error("Greška prilikom brisanja eksperimenta!");
            setExperiments(prev => prev.filter(c => c.id !== id));
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

                <div className="pt-20 w-[80vw]">
                    {loading && <p>Učitavanje podataka...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && experiments.length === 0 && <p>Nema dostupnih eksperimenata.</p>}

                    {!loading && !error && experiments.map(exp => {
                        const isAdmin = role === "ROLE_ADMIN";

                        return (
                            <div
                                key={exp.id}
                                className="flex items-center justify-between bg-pink-200 p-5 mb-4 rounded-lg shadow-lg"
                            >
                                <Link to={`/experimentiprimjer/${exp.id}`} className="text-blue-500">
                                    {exp.name}
                                </Link>

                                <div className="flex gap-2">
                                    {isAdmin ? (
                                        <>
                                            <Link
                                                to={`/experimenti/edit/${exp.id}`}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleDeleteExperiment(exp.id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="bg-yellow-500 text-white px-3 py-1 rounded opacity-50 cursor-not-allowed">
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded opacity-50 cursor-not-allowed">
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}