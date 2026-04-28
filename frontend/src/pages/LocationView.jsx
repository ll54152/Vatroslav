import React, {useEffect, useState} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";

export default function LocationView() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [location, setLocation] = useState(null);
    const [components, setComponents] = useState([]);
    const [expandedIds, setExpandedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const load = async () => {
            const token = localStorage.getItem("jwt");

            const locRes = await fetch(`/vatroslav/api/location/get/${id}`, {
                headers: {Authorization: token},
            });

            const compRes = await fetch(`/vatroslav/api/component/getByLocationID/${id}`, {
                headers: {Authorization: token},
            });

            setLocation(await locRes.json());
            setComponents(await compRes.json());
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
                (c.ZPF || "").toLowerCase().includes(term) ||
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
        c.ZPF?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.keywords?.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (!location) return <div className="p-6">Učitavanje...</div>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-8xl px-4 text-left">

                <header
                    className="fixed top-0 left-0 w-full bg-pink-500 text-white py-4 text-center text-2xl font-bold z-50">
                    {location.address} — {location.room}
                </header>

                <div className="pt-28 mb-4">
                    <input
                        type="text"
                        placeholder="Pretražite po nazivu komponente, ZPF oznaci, ključnim riječima ili opius..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-2 rounded border border-gray-300"
                    />
                </div>

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