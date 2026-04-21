import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function Components() {
    const [components, setComponents] = useState([]);
    const [filteredComponents, setFilteredComponents] = useState([]);
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
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`
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
                    headers: {Authorization: `${token}`},
                });

                if (!response.ok) {
                    if (response.status === 403)
                        setError("Nemate ovlasti za pregled komponenti.");
                    else if (response.status === 401)
                        setError("Niste prijavljeni.");
                    else
                        setError("Greška prilikom dohvaćanja podataka!");

                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setComponents(data);
                setFilteredComponents(data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComponents();
    }, [navigate]);

    const toggleExpand = (id) => {
        setExpandedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handleDeleteComponent = async (id) => {
        const token = localStorage.getItem("jwt");
        try {
            const response = await fetch(`/vatroslav/api/component/delete/${id}`, {
                method: "DELETE",
                headers: {Authorization: `${token}`},
            });

            if (!response.ok) throw new Error("Greška prilikom brisanja!");

            const newComponents = components.filter(comp => comp.id !== id);
            setComponents(newComponents);
            setFilteredComponents(newComponents);

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

        const filtered = components.filter(comp =>
            comp.name.toLowerCase().includes(term.toLowerCase()) ||
            comp.description?.toLowerCase().includes(term.toLowerCase()) ||
            comp.zpf?.toLowerCase().includes(term.toLowerCase()) ||
            comp.keywords?.some(k =>
                k.toLowerCase().includes(term.toLowerCase())
            )
        );

        setFilteredComponents(filtered);

        const autoExpanded = filtered
            .filter(comp =>
                comp.description?.toLowerCase().includes(term.toLowerCase()) ||
                comp.zpf?.toLowerCase().includes(term.toLowerCase()) ||
                comp.keywords?.some(k =>
                    k.toLowerCase().includes(term.toLowerCase())
                )
            )
            .map(comp => comp.id);

        setExpandedIds(autoExpanded);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-8xl px-4 text-left">

                <header className="fixed top-0 left-0 w-full bg-pink-500 text-white py-4 text-center text-2xl font-bold z-50">
                    Lista Komponenata
                </header>

                <div className="pt-28 mb-4">
                    <input
                        type="text"
                        placeholder="Pretraži po imenu, ZPF, opisu ili ključnoj riječi..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-2 rounded border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>

                {loading && <p>Učitavanje...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && filteredComponents.length === 0 && (
                    <p>Nema rezultata.</p>
                )}

                {!loading && !error && filteredComponents.map(comp => {
                    const isExpanded = expandedIds.includes(comp.id);
                    const isAdmin = role === "ROLE_ADMIN";

                    return (
                        <div key={comp.id}
                             className="flex flex-col bg-pink-200 p-5 mb-4 rounded-lg shadow-lg">

                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start w-full">
                                <Link
                                    to={`/component/view/${comp.id}`}
                                    className="text-blue-600 text-lg font-semibold"
                                >
                                    <HighlightedText text={comp.name} highlight={searchTerm}/>
                                </Link>

                                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                                    <button
                                        onClick={() => toggleExpand(comp.id)}
                                        className="px-2 py-1 bg-gray-300 rounded text-sm"
                                    >
                                        {isExpanded ? "▲" : "▼"}
                                    </button>

                                    {isAdmin ? (
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                            onClick={() => handleDeleteComponent(comp.id)}
                                        >
                                            Delete
                                        </button>
                                    ) : (
                                        <button className="bg-red-500 text-white px-3 py-1 rounded opacity-50 cursor-not-allowed">
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mt-2 text-sm text-gray-700 font-light">
                                {comp.zpf && (
                                    <span>
                                        <HighlightedText text={comp.zpf} highlight={searchTerm}/>
                                    </span>
                                )}

                                {comp.description && (
                                    <span>
                                        {"  -  "}
                                        <HighlightedText text={comp.description} highlight={searchTerm}/>
                                    </span>
                                )}
                            </div>

                            {isExpanded && (
                                (() => {
                                    const keywordsArray = Array.isArray(comp.keywords)
                                        ? comp.keywords
                                        : typeof comp.keywords === "string"
                                            ? comp.keywords.split(";").map(k => k.trim()).filter(k => k)
                                            : [];

                                    return (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {keywordsArray.length > 0 ? (
                                                keywordsArray.map((k, i) => (
                                                    <span key={i} className="bg-gray-300 px-2 py-1 rounded-full text-xs">
                            <HighlightedText text={k} highlight={searchTerm}/>
                        </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 italic text-xs">Nema ključnih riječi</span>
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