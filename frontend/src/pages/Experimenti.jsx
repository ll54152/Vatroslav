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
    const [expandedIds, setExpandedIds] = useState([]);
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

    const toggleExpand = (id) => {
        setExpandedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

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
            setFilteredExperiments(newExperiments);

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
                        <span key={index} className="bg-yellow-300">{part}</span>
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
            exp.description?.toLowerCase().includes(term.toLowerCase()) ||
            exp.zpf?.toLowerCase().includes(term.toLowerCase()) ||
            exp.keywords?.some(k => k.toLowerCase().includes(term.toLowerCase()))
        );

        setFilteredExperiments(filtered);

        const autoExpanded = filtered
            .filter(exp =>
                exp.description?.toLowerCase().includes(term.toLowerCase()) ||
                exp.zpf?.toLowerCase().includes(term.toLowerCase()) ||
                exp.keywords?.some(k => k.toLowerCase().includes(term.toLowerCase()))
            )
            .map(exp => exp.id);

        setExpandedIds(autoExpanded);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-[80vw] text-left">

                <header
                    className="fixed top-0 left-0 w-full bg-pink-500 text-white py-4 text-center text-2xl font-bold z-50">
                    Lista Eksperimenata
                </header>

                <div className="pt-24 mb-4">
                    <input
                        type="text"
                        placeholder="Pretraži po imenu, ZPF, opisu ili ključnim riječima..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-2 rounded border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>

                {loading && <p>Učitavanje...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && filteredExperiments.length === 0 && (
                    <p>Nema rezultata.</p>
                )}

                {!loading && !error && filteredExperiments.map(exp => {
                    const isExpanded = expandedIds.includes(exp.id);
                    const isAdmin = role === "ROLE_ADMIN";

                    return (
                        <div key={exp.id} className="flex flex-col bg-pink-200 p-5 mb-4 rounded-lg shadow-lg">

                            <div className="flex justify-between items-start w-full">
                                <Link
                                    to={`/experimentiprimjer/${exp.id}`}
                                    className="text-blue-600 text-lg font-semibold"
                                >
                                    <HighlightedText text={exp.name} highlight={searchTerm}/>
                                </Link>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleExpand(exp.id)}
                                        className="px-2 py-1 bg-gray-300 rounded text-sm"
                                    >
                                        {isExpanded ? "▲" : "▼"}
                                    </button>

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

                            <div className="mt-2 text-sm text-gray-700 font-light">
                                {exp.zpf && <span><HighlightedText text={exp.zpf} highlight={searchTerm}/></span>}
                                {exp.description && <span>{"  -  "}<HighlightedText text={exp.description}
                                                                                    highlight={searchTerm}/></span>}
                            </div>

                            {isExpanded && (
                                (() => {
                                    const keywordsArray = Array.isArray(exp.keywords)
                                        ? exp.keywords
                                        : typeof exp.keywords === "string"
                                            ? exp.keywords.split(";").map(k => k.trim()).filter(k => k)
                                            : [];

                                    return (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {keywordsArray.length > 0 ? (
                                                keywordsArray.map((k, i) => (
                                                    <span key={i}
                                                          className="bg-gray-300 px-2 py-1 rounded-full text-xs">
                                                        <HighlightedText text={k} highlight={searchTerm}/>
                                                    </span>
                                                ))
                                            ) : (
                                                <span
                                                    className="text-gray-500 italic text-xs">Nema ključnih riječi</span>
                                            )}
                                        </div>
                                    );
                                })()
                            )}

                        </div>
                    );
                })}
            </div>
        </div>
    );
}