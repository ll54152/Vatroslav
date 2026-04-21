import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";


function ComponentViewLog() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [component, setComponent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(null);
    const [newLog, setNewLog] = useState("");
    const [addingLog, setAddingLog] = useState(false);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);
    const [logToDelete, setLogToDelete] = useState(null);

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

            const res = await fetch(`/vatroslav/api/component/get/${id}`, {
                headers: {Authorization: `${token}`},
            });

            const data = await res.json();
            setComponent(data);
            setLogs(data.logShowDTOList || []);
            setLoading(false);
        };

        load();
    }, [id, navigate]);

    if (loading) return <div className="p-6">Učitavanje...</div>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!component) return <div className="p-6">Nema podataka</div>;

    const EmptyValue = ({text = "N/A"}) => (
        <span className="text-gray-400 italic">{text}</span>
    );

    const profileImage = component.fileShowDTOList?.find(f => f.fileCategory === "profileImage");

    const fetchLogsAgain = async () => {
        const token = localStorage.getItem("jwt");

        const res = await fetch(`/vatroslav/api/component/get/${id}`, {
            headers: {Authorization: token},
        });

        const data = await res.json();
        setLogs(data.logShowDTOList || []);
    };


    const latestLogs = logs
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    const openImage = (img) => setActiveImage(img);

    const handleAddLog = async () => {
        if (!newLog.trim()) return;

        const token = localStorage.getItem("jwt");

        const logData = {
            note: newLog,
            entityType: "component",
            entityId: Number(id),
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

            <div className="flex flex-col items-center mb-10">

                {profileImage ? (
                    <img
                        src={`data:image/jpeg;base64,${profileImage.fileByte}`}
                        onClick={() => openImage(profileImage)}
                    />
                ) : (
                    <div className="w-56 h-56 bg-gray-200 rounded-3xl flex items-center justify-center">
                        <EmptyValue text="Nema profilne fotografije"/>
                    </div>
                )}

                <h1 className="text-3xl font-bold mt-4">{component.name}</h1>
                <p className="text-gray-500">
                    {component.zpf}
                </p>
            </div>


            <div className="flex flex-col gap-6">

                <Card>
                    <CardHeader>
                        <CardTitle>Svi logovi komponente</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        <form
                            className="flex gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddLog();
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

                        <div className="space-y-3">
                            {latestLogs.length ? latestLogs.map(log => (
                                <div key={log.id} className="relative border-b pb-2 pr-24 text-sm text-center">

                                    <div>
                                        <div className="break-words">{log.note}</div>
                                        <div className="text-gray-500">
                                            {log.userShowDTO.firstName} {log.userShowDTO.lastName} - {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setLogToDelete(log.id)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                                    >
                                        Izbriši
                                    </button>

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

        </div>


    );
}

export default ComponentViewLog;