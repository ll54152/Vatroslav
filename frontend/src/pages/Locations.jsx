import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";

export default function Locations() {
    const [locations, setLocations] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const token = localStorage.getItem("jwt");

            const res = await fetch("/vatroslav/api/location/getAll", {
                headers: {Authorization: token},
            });

            const data = await res.json();
            setLocations(data);
            setFiltered(data);
            setLoading(false);
        };

        load();
    }, []);

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
        setSearch(term);

        const filtered = locations.filter(loc =>
            loc.address.toLowerCase().includes(term) ||
            loc.room.toLowerCase().includes(term)
        );

        setFiltered(filtered);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div>
                <div className="max-w-8xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                Lokacije
                            </h1>
                        </div>
                        <input
                            placeholder="Pretražite adresu ili prostoriju..."
                            value={search}
                            onChange={handleSearch}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 bg-white text-black text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition duration-200"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-8xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">

                {loading && <p>Učitavanje...</p>}

                {filtered.map(loc => (
                    <div
                        key={loc.id}
                        className="bg-pink-200 p-4 mb-3 rounded shadow cursor-pointer hover:bg-pink-300"
                        onClick={() => navigate(`/location/view/${loc.id}`)}
                    >

                        <div className="font-semibold">
                            <HighlightedText text={loc.room} highlight={search}/>
                        </div>

                        <div className="text-sm text-gray-700">
                            <HighlightedText text={loc.address} highlight={search}/>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}