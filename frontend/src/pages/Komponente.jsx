import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function Komponente() {
    const [components, setComponents] = useState([]);
    const [filteredComponents, setFilteredComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDescriptions, setShowDescriptions] = useState(false);
    const [showZPF, setShowZPF] = useState(false);
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
                    if (response.status === 403) setError("Nemate ovlasti za pregled komponenti.");
                    else if (response.status === 401) setError("Niste prijavljeni. Molimo prijavite se.");
                    else setError("Greška prilikom dohvaćanja podataka!");
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

    const handleDeleteComponent = async (id) => {
        const token = localStorage.getItem("jwt");
        try {
            const response = await fetch(`/vatroslav/api/component/delete/${id}`, {
                method: "DELETE",
                headers: {Authorization: `${token}`},
            });
            if (!response.ok) throw new Error("Greška prilikom brisanja komponente!");
            const newComponents = components.filter(comp => comp.id !== id);
            setComponents(newComponents);
            setFilteredComponents(
                newComponents.filter(comp =>
                    comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (comp.zpf && comp.zpf.toLowerCase().includes(searchTerm.toLowerCase()))
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
            (comp.description && comp.description.toLowerCase().includes(term.toLowerCase())) ||
            (comp.zpf && comp.zpf.toLowerCase().includes(term.toLowerCase()))
        );
        setFilteredComponents(filtered);

        setShowDescriptions(filtered.some(comp => comp.description?.toLowerCase().includes(term.toLowerCase())));
        setShowZPF(filtered.some(comp => comp.zpf?.toLowerCase().includes(term.toLowerCase())));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-[80vw]">
                <header
                    className="fixed top-0 left-0 w-full bg-pink-500 text-white py-4 text-center text-2xl font-bold z-50">
                    Lista Komponenata
                </header>

                <div className="pt-24 mb-4 flex justify-between items-center">
                    <input
                        type="text"
                        placeholder="Pretraži po imenu, ZPF ili opisu..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-2 mb-4 rounded border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="ml-4 flex gap-2">
                        <button
                            onClick={() => setShowDescriptions(prev => !prev)}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            {showDescriptions ? "Sakrij opise" : "Prikaži opise"}
                        </button>
                        <button
                            onClick={() => setShowZPF(prev => !prev)}
                            className="px-4 py-2 bg-green-500 text-white rounded"
                        >
                            {showZPF ? "Sakrij ZPF" : "Prikaži ZPF"}
                        </button>
                    </div>
                </div>

                {loading && <p>Učitavanje podataka...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && filteredComponents.length === 0 && <p>Nema dostupnih komponenti.</p>}

                {!loading && !error && filteredComponents.map(comp => {
                    const isAdmin = role === "ROLE_ADMIN";

                    return (
                        <div key={comp.id} className="flex flex-col bg-pink-200 p-5 mb-4 rounded-lg shadow-lg">
                            <div className="flex justify-between items-center w-full">
                                <Link to={`/komponenteprimjer/${comp.id}`} className="text-blue-500">
                                    <HighlightedText text={comp.name} highlight={searchTerm}/>
                                </Link>

                                <div className="flex gap-2">
                                    {isAdmin ? (
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                            onClick={() => handleDeleteComponent(comp.id)}
                                        >
                                            Delete
                                        </button>
                                    ) : (
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded opacity-50 cursor-not-allowed"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>

                            {showZPF && comp.zpf && (
                                <p className="mt-2">
                                    <strong>ZPF: </strong>
                                    <HighlightedText text={comp.zpf} highlight={searchTerm}/>
                                </p>
                            )}

                            {showDescriptions && comp.description && (
                                <p className="mt-2">
                                    <strong>Opis: </strong>
                                    <HighlightedText text={comp.description} highlight={searchTerm}/>
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}