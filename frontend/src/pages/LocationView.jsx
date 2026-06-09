import React, {useEffect, useState} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function LocationView() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [location, setLocation] = useState(null);
    const [components, setComponents] = useState([]);
    const [expandedIds, setExpandedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);

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
        const load = async () => {
            setLoading(true);
            setError(null);

            setRole(getUserRole());

            try {
                const token = localStorage.getItem("jwt");

                const locRes = await fetch(`/vatroslav/api/location/get/${id}`, {
                    headers: {Authorization: token},
                });

                if (!locRes.ok) {
                    const errorData = await locRes.json();
                    setError({
                        status: locRes.status,
                        message: errorData.message || "Nije moguće učitati lokaciju",
                        details: errorData.details
                    });
                    setLocation(null);
                    setLoading(false);
                    return;
                }

                const locationData = await locRes.json();
                setLocation(locationData);

                const compRes = await fetch(`/vatroslav/api/component/getByLocationID/${id}`, {
                    headers: {Authorization: token},
                });

                if (compRes.ok) {
                    const componentsData = await compRes.json();
                    setComponents(Array.isArray(componentsData) ? componentsData : []);
                } else {
                    console.warn("Nije moguće učitati komponente:", compRes.status);
                    setComponents([]);
                }
            } catch (err) {
                setError({
                    status: "error",
                    message: "Greška pri komunikaciji sa serverom",
                    details: err.message
                });
                setLocation(null);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const toggleExpand = (id) => {
        setExpandedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    function escapeRegExp(string = "") {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function HighlightedText({text = "", highlight = ""}) {
        if (!highlight.trim()) return <>{text}</>;

        try {
            const safe = escapeRegExp(highlight);
            const regex = new RegExp(`(${safe})`, "gi");
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
        } catch (e) {
            return <>{text}</>;
        }
    }

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (!term) {
            setExpandedIds([]);
            return;
        }

        const autoExpanded = components
            .filter(c =>
                (c.zpf || "").toLowerCase().includes(term) ||
                (c.description || "").toLowerCase().includes(term) ||
                (c.keywords || []).some(k =>
                    k.toLowerCase().includes(term)
                )
            )
            .map(c => c.id);

        setExpandedIds(autoExpanded);
    };

    const filteredComponents = components.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.zpf?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.keywords?.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDeleteLocation = async () => {
        if (!window.confirm("Jeste li sigurni da želite obrisati lokaciju?")) {
            return;
        }

        const token = localStorage.getItem("jwt");

        try {
            const response = await fetch(
                `/vatroslav/api/location/delete/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: token,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Greška prilikom brisanja lokacije");
            }

            alert("Lokacija obrisana uspješno");

            navigate("/locations");
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl text-gray-600">Učitavanje lokacije...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 max-w-md w-full rounded">
                    <h2 className="text-xl font-bold text-red-800 mb-2">
                        {error.message}
                    </h2>
                    {error.details && (
                        <p className="text-red-700 text-sm mb-4">{error.details}</p>
                    )}
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Nazad
                    </button>
                </div>
            </div>
        );
    }

    if (!location) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl text-gray-600">Lokacija nije pronađena</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div>
                <div className="max-w-8xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                {location.address} — {location.room}
                            </h1>

                            {role === "ROLE_ADMIN" && (
                                <div className="flex gap-2">
                                    <Link to={`/location/edit/${id}`}>
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                                        >
                                            Edit
                                        </button>
                                    </Link>

                                    <button
                                        onClick={handleDeleteLocation}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Pretražite po nazivu komponente, ZPF oznaci, ključnim riječima ili opius..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 bg-white text-black text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition duration-200"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-8xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6 text-start">

                {filteredComponents.length === 0 ? (
                    <p>Ova lokacija nema komponente.</p>
                ) : (
                    filteredComponents.map(c => {
                        const isExpanded = expandedIds.includes(c.id);

                        const keywordsArray = Array.isArray(c.keywords)
                            ? c.keywords
                            : typeof c.keywords === "string"
                                ? c.keywords.split(";").map(k => k.trim()).filter(k => k)
                                : [];

                        return (
                            <div
                                key={c.id}
                                className="flex flex-col bg-pink-200 p-5 mb-4 rounded-lg shadow-lg"
                            >

                                <div className="flex justify-between items-start">

                                    <Link
                                        to={`/component/view/${c.id}`}
                                        className="text-blue-600 text-lg font-semibold"
                                    >
                                        <HighlightedText text={c.name} highlight={searchTerm}/>
                                    </Link>

                                    <button
                                        onClick={() => toggleExpand(c.id)}
                                        className="px-2 py-1 bg-gray-300 rounded text-sm"
                                    >
                                        {isExpanded ? "▲" : "▼"}
                                    </button>
                                </div>

                                <div className="mt-2 text-sm text-gray-700 font-light items-start">
                                    <HighlightedText text={c.zpf} highlight={searchTerm}/>
                                    {"  -  "}
                                    <HighlightedText text={c.description} highlight={searchTerm}/>
                                </div>

                                {isExpanded && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {keywordsArray.length > 0 ? (

                                            keywordsArray.map((k, i) => (
                                                <span key={i}
                                                      className="bg-gray-300 px-2 py-1 rounded-full text-xs">
                                                <HighlightedText text={k} highlight={searchTerm}/>
                                            </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 italic text-xs">
                                                Nema ključnih riječi
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}

            </div>
        </div>
    );
}