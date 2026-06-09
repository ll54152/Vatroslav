import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function Experiments() {
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
        if (!window.confirm("Jeste li sigurni da želite obrisati eksperiment?")) {
            return;
        }

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
        <div className="min-h-screen flex flex-col">
            <div>
                <div className="max-w-8xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                Eksperimenti
                            </h1>
                            {role === "ROLE_ADMIN" && (
                                <Link to="/experiment/add">
                                    <button
                                        className="px-3 sm:px-4 md:px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm sm:text-base rounded-lg transition duration-200 shadow-md hover:shadow-lg w-full sm:w-auto">
                                        Dodajte eksperiment
                                    </button>
                                </Link>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Pretražite po imenu, ZPF oznaci, opisu ili ključnim riječima"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 bg-white text-black text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition duration-200"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-8xl mx-auto w-full px-4 py-6 text-left">

                {loading && <p>Učitavanje...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && filteredExperiments.length === 0 && (
                    <p>Nema rezultata.</p>
                )}

                {!loading && !error && filteredExperiments.map(exp => {
                    const isPublic = exp?.isItPublic ?? exp?.itPublic ?? false;
                    const isExpanded = expandedIds.includes(exp.id);
                    const isAdmin = role === "ROLE_ADMIN";

                    return (
                        <div key={exp.id} className="flex flex-col bg-pink-200 p-5 mb-4 rounded-lg shadow-lg">

                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start w-full">
                                <div className="flex items-center gap-3">
                                    <Link
                                        to={`/experiment/view/${exp.id}`}
                                        className="text-blue-600 text-lg font-semibold"
                                    >
                                        <HighlightedText text={exp.name} highlight={searchTerm}/>
                                    </Link>

                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                                        {isPublic ? 'Javno' : 'Privatno'}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                                    <button
                                        onClick={() => toggleExpand(exp.id)}
                                        className="px-2 py-1 bg-gray-300 rounded text-sm"
                                    >
                                        {isExpanded ? "▲" : "▼"}
                                    </button>

                                    {isAdmin ? (
                                        <>
                                            <Link
                                                to={`/experiment/edit/${exp.id}`}
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
                                    ) : null}
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