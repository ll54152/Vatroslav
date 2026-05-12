import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Link} from "react-router-dom";

function Logs() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [newLog, setNewLog] = useState("");
    const [addingLog, setAddingLog] = useState(false);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);
    const [logToDelete, setLogToDelete] = useState(null);
    const [loading, setLoading] = useState(true);

    const [searchText, setSearchText] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [userSearch, setUserSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const users = Array.from(
        new Map(
            logs.map(log => [log.userShowDTO.id, log.userShowDTO])
        ).values()
    );

    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(userSearch.toLowerCase())
    );

    const filteredLogs = logs
        .filter(log => {
            const fullName = `${log.userShowDTO.firstName} ${log.userShowDTO.lastName}`.toLowerCase();

            const matchesText =
                log.note.toLowerCase().includes(searchText.toLowerCase()) ||
                fullName.includes(searchText.toLowerCase());

            const matchesUser =
                !selectedUser || log.userShowDTO.id === selectedUser.id;

            const logDate = new Date(log.timestamp);

            const matchesFrom =
                !dateFrom || logDate >= new Date(dateFrom);

            const matchesTo =
                !dateTo || logDate <= new Date(dateTo + "T23:59:59");

            return matchesText && matchesUser && matchesFrom && matchesTo;
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));


    const isTokenValid = () => {
        const token = localStorage.getItem("jwt");
        if (!token) return false;
        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            const currentTime = Date.now() / 1000;
            return decoded.exp > currentTime;
        } catch (error) {
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
                    Authorization: `${token}`,
                },
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    useEffect(() => {
        const load = async () => {
            const isValid = isTokenValid();
            const isVerified = await verifyToken();
            if (!isValid || !isVerified) {
                localStorage.removeItem("jwt");
                navigate("/login");
                return;
            }

            const token = localStorage.getItem("jwt");

            const res = await fetch(`/vatroslav/api/log/getAll`, {
                headers: {Authorization: `${token}`},
            });

            const data = await res.json();
            setLogs(data || []);
            setLoading(false);
        };

        load();
    }, [id, navigate]);

    if (loading) return <div className="p-6">Učitavanje...</div>;
    if (error) return <p className="text-red-500">{error}</p>;

    const EmptyValue = ({text = "N/A"}) => (
        <span className="text-gray-400 italic">{text}</span>
    );

    const fetchLogsAgain = async () => {
        const token = localStorage.getItem("jwt");

        const res = await fetch(`/vatroslav/api/log/getAll`, {
            headers: {Authorization: token},
        });

        const data = await res.json();
        setLogs(data || []);
    };


    const latestLogs = logs
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    const handleAddLog = async () => {
        if (!newLog.trim()) return;

        const token = localStorage.getItem("jwt");

        const logData = {
            note: newLog
        };

        try {
            setAddingLog(true);

            const response = await fetch(`/vatroslav/api/log/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(logData),
            });

            if (response.ok) {
                await fetchLogsAgain();
                setNewLog("");
            }
        } finally {
            setAddingLog(false);
        }
    };


    async function handleDeleteLog(id) {
        const token = localStorage.getItem("jwt");

        try {
            const response = await fetch(`/vatroslav/api/log/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                },
            });

            if (response.ok) {
                await fetchLogsAgain();
            } else {
                console.error("Failed to delete log");
            }
        } catch (err) {
            console.error("Error deleting log:", err);
        }
    }

    return (
        <div className="min-h-screen p-6">

            <div className="flex flex-col gap-6">

                <Card>
                    <CardHeader>
                        <CardTitle>Svi logovi baze podataka</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        <form
                            className="flex gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddLog().then(r => r);
                            }}
                        >
                            <input
                                value={newLog}
                                onChange={(e) => setNewLog(e.target.value)}
                                placeholder="Dodaj novi log..."
                                className="flex-1 border rounded px-3 py-2 text-sm"
                            />

                            <button
                                type="submit"
                                disabled={addingLog}
                                className="bg-pink-500 text-white px-3 py-2 rounded text-sm hover:bg-pink-600 disabled:opacity-50"
                            >
                                {addingLog ? "..." : "Dodaj"}
                            </button>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">

                            <input
                                type="text"
                                placeholder="Pretražite logove..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="border rounded px-3 py-2 text-sm"
                            />

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Pretražite osobu..."
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className="border rounded px-3 py-2 text-sm w-full"
                                />

                                {userSearch && (
                                    <div className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10">
                                        {filteredUsers.map(user => (
                                            <div
                                                key={user.id}
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setUserSearch("");
                                                }}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {user.firstName} {user.lastName}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <input
                                type="date"
                                title="Od (datum)"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="border rounded px-3 py-2 text-sm"
                            />

                            <input
                                type="date"
                                title="Do (datum)"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="border rounded px-3 py-2 text-sm"
                            />

                        </div>

                        <div className="space-y-3">
                            {filteredLogs.length ? filteredLogs.map(log => (
                                <div key={log.id} className="relative border-b pb-2 pr-24 text-sm text-center">

                                    <div>
                                        <div className="break-words">{log.note}</div>

                                        <div className="text-gray-500">
                                            {log.userShowDTO.firstName} {log.userShowDTO.lastName} -{" "}
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>

                                        {log.componentDTO && (
                                            <div>
                                                Komponenta:{" "}
                                                <Link
                                                    to={`/component/${log.componentDTO.id}`}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    {log.componentDTO.name} - {" "} {log.componentDTO.zpf}
                                                </Link>
                                            </div>
                                        )}

                                        {log.experimentDTO && (
                                            <div>
                                                Eksperiment:{" "}
                                                <Link
                                                    to={`/experiment/${log.experimentDTO.id}`}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    {log.experimentDTO.name} - {" "} {log.experimentDTO.zpf}
                                                </Link>
                                            </div>
                                        )}

                                    </div>

                                    {log.deletable === true ? (
                                        <>
                                            <button
                                                onClick={() => setLogToDelete(log.id)}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                                            >
                                                Izbriši
                                            </button>
                                        </>
                                    ) : null}

                                </div>
                            )) : (
                                <EmptyValue text="Nema logova"/>
                            )}
                            {logToDelete && (
                                <div className="fixed inset-0  flex items-center justify-center">
                                    <div className="bg-white p-4 rounded shadow">
                                        <p className="mb-3">Želite li izbrisati Log?</p>

                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setLogToDelete(null)}
                                                className="bg-gray-200 text-black px-3 py-1 rounded"
                                            >
                                                Odustani
                                            </button>

                                            <button
                                                onClick={async () => {
                                                    await handleDeleteLog(logToDelete);
                                                    setLogToDelete(null);
                                                }}
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                            >
                                                Izbriši
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </CardContent>
                </Card>
            </div>
            {selectedUser && (
                <div className="mb-2 text-sm">
                    Filtrirano po: {selectedUser.firstName} {selectedUser.lastName}
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="ml-2 text-red-500"
                    >
                        ✕
                    </button>
                </div>
            )}

            {(dateFrom || dateTo) && (
                <div className="text-sm text-gray-600 mt-2">
                    Datum: {dateFrom || "∞"} → {dateTo || "∞"}
                </div>
            )}

        </div>


    );

}

export default Logs;
