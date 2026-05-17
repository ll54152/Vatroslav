import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

export default function Experiments() {
    const [experiments, setExperiments] = useState([]);
    const [filteredExperiments, setFilteredExperiments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedIds, setExpandedIds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            try {
                const response = await fetch("/vatroslav/api/experiment/getAllPublic", {});

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
                    const isExpanded = expandedIds.includes(exp.id);
                    return (
                        <div key={exp.id} className="flex flex-col bg-pink-200 p-5 mb-4 rounded-lg shadow-lg">

                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start w-full">
                                <Link
                                    to={`/experiment/view/${exp.id}`}
                                    className="text-blue-600 text-lg font-semibold"
                                >
                                    <HighlightedText text={exp.name} highlight={searchTerm}/>
                                </Link>
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