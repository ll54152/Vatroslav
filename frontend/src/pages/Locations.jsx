import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
                headers: { Authorization: token },
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
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-8xl px-4 text-left">

                <header className="fixed top-0 left-0 w-full bg-pink-500 text-white py-4 text-center text-2xl font-bold z-50">
                    Lokacije
                </header>

                <div className="pt-28 mb-4">
                    <input
                        placeholder="Pretražite adresu ili prostoriju..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {loading && <p>Učitavanje...</p>}

                {filtered.map(loc => (
                    <div
                        key={loc.id}
                        className="bg-pink-200 p-4 mb-3 rounded shadow cursor-pointer hover:bg-pink-300"
                        onClick={() => navigate(`/location/view/${loc.id}`)}
                    >
                        <div className="font-semibold">
                            <HighlightedText text={loc.address} highlight={search} />
                        </div>

                        <div className="text-sm text-gray-700">
                            <HighlightedText text={loc.room} highlight={search} />
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}