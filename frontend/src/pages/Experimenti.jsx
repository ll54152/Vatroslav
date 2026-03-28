import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function Experimenti() {
    const [experiments, setExperiments] = useState([]);
    const [filteredExperiments, setFilteredExperiments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDescriptions, setShowDescriptions] = useState(false); // Global toggle
    const navigate = useNavigate();

    const isTokenValid = () => {
        const token = localStorage.getItem("jwt");
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            return decoded.exp > Date.now() / 1000;
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
                setFilteredExperiments(data);
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
            const newExperiments = experiments.filter(c => c.id !== id);
            setExperiments(newExperiments);
            setFilteredExperiments(
                newExperiments.filter(exp =>
                    exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    exp.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } catch (err) {
            alert(err.message);
        }
    };

    function HighlightedText({text, highlight}) {
        if (!highlight) return <>{text}</>;

        const regex = new RegExp(`(${highlight})`, "gi");
        const parts = text.split(regex);

        return (
            <>
                {parts.map((part, index) =>
                        regex.test(part) ? (
                            <span key={index} className="bg-yellow-300">
            {part}
          </span>
                        ) : (
                            <span key={index}>{part}</span>
                        )
                )}
            </>
        );
    }

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        const filtered = experiments.filter(exp =>
            exp.name.toLowerCase().includes(term.toLowerCase()) ||
            exp.description.toLowerCase().includes(term.toLowerCase())
        );

        setFilteredExperiments(filtered);

        const matchesDescription = filtered.some(exp =>
            exp.description.toLowerCase().includes(term.toLowerCase())
        );
        setShowDescriptions(matchesDescription);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-[80vw]">
                <header
                    className="fixed top-0 left-0 w-full bg-pink-500 text-white py-4 text-center text-2xl font-bold z-50">
                    Lista Eksperimenata
                </header>

                <div className="pt-24 mb-4 flex justify-between items-center">
                    <input
                        type="text"
                        placeholder="Pretraži po imenu ili opisu..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-2 mb-4 rounded border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-500"/>
                    <button
                        onClick={() => setShowDescriptions(prev => !prev)}
                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        {showDescriptions ? "Sakrij opise" : "Prikaži opise"}
                    </button>
                </div>

                {loading && <p>Učitavanje podataka...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && filteredExperiments.length === 0 && <p>Nema dostupnih eksperimenata.</p>}

                {!loading && !error && filteredExperiments.map(exp => {
                    const isAdmin = role === "ROLE_ADMIN";

                    return (
                        <div
                            key={exp.id}
                            className="flex flex-col bg-pink-200 p-5 mb-4 rounded-lg shadow-lg"
                        >
                            <div className="flex justify-between items-center w-full">
                                <Link to={`/experimentiprimjer/${exp.id}`} className="text-blue-500">
                                    <HighlightedText text={exp.name} highlight={searchTerm}/>
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

                            {showDescriptions && exp.description && (
                                <p className="mt-2">
                                    <HighlightedText text={exp.description} highlight={searchTerm}/>
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}