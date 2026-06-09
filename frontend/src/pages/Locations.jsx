import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function Locations() {
    const [locations, setLocations] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);

    const navigate = useNavigate();

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
            const token = localStorage.getItem("jwt");
            setRole(getUserRole());

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

    const handleDeleteLocation = async (id) => {
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
                throw new Error("Greška prilikom brisanja!");
            }

            const updated = locations.filter(loc => loc.id !== id);

            setLocations(updated);
            setFiltered(updated);

        } catch (err) {
            alert(err.message);
        }
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

                            {role === "ROLE_ADMIN" && (
                                <Link to="/location/add">
                                    <button
                                        className="px-3 sm:px-4 md:px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm sm:text-base rounded-lg transition duration-200 shadow-md hover:shadow-lg w-full sm:w-auto"
                                    >
                                        Dodajte lokaciju
                                    </button>
                                </Link>
                            )}
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
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-semibold">
                                    <HighlightedText text={loc.room} highlight={search}/>
                                </div>

                                <div className="text-sm text-gray-700">
                                    <HighlightedText text={loc.address} highlight={search}/>
                                </div>
                            </div>

                            {role === "ROLE_ADMIN" && (
                                <div className="flex gap-2">
                                    <Link
                                        to={`/location/edit/${loc.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteLocation(loc.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}