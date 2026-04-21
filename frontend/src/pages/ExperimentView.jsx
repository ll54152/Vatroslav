import * as React from "react";
import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

function ExperimentView() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [experiment, setExperiment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newLog, setNewLog] = useState("");
    const [activeImage, setActiveImage] = useState(null);
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
        const fetchExperiment = async () => {
            const isValid = isTokenValid();
            const isVerified = await verifyToken();
            if (!isValid || !isVerified) {
                localStorage.removeItem("jwt");
                navigate("/login");
                return;
            }

            const token = localStorage.getItem("jwt");

            try {
                const response = await fetch(`/vatroslav/api/experiment/get/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                if (!response.ok) throw new Error("Eksperiment nije pronađen.");
                const data = await response.json();
                setExperiment(data);
                setLogs(data.logShowDTOList || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiment();
    }, [id, navigate]);

    if (loading) return <div className="p-6">Učitavanje...</div>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!experiment) return <div className="p-6">Nema podataka</div>;

    const EmptyValue = ({text = "N/A"}) => (
        <span className="text-gray-400 italic">{text}</span>
    );

    const profileImage = experiment.fileShowDTOList?.find(f => f.fileCategory === "profileImage");
    const galleryImages = experiment.fileShowDTOList?.filter(f => f.fileCategory === "otherImage") || [];
    const generalFiles = experiment.fileShowDTOList?.filter(f => f.fileCategory === "general") || [];

    const fetchLogsAgain = async () => {
        const token = localStorage.getItem("jwt");

        const res = await fetch(`/vatroslav/api/experiment/get/${id}`, {
            headers: {Authorization: token},
        });

        const data = await res.json();
        setLogs(data.logShowDTOList || []);
    };

    const latestLogs = logs
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 3);

    const openImage = (img) => setActiveImage(img);

    const handleAddLog = async () => {
        if (!newLog.trim()) return;

        const token = localStorage.getItem("jwt");

        const logData = {
            note: newLog,
            entityType: "experiment",
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

                <h1 className="text-3xl font-bold mt-4">{experiment.name}</h1>
                <p className="text-gray-500">
                    {experiment.zpf}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Osnovno</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <div><b>Nastavni predmet: </b> {experiment.subject ||
                                <EmptyValue text="Nema nastavnog predmeta"/>}</div>
                            <div><b>Područje fizike: </b> {experiment.field ||
                                <EmptyValue text="Nema područja fizike"/>}</div>

                            <div><b>Ključne riječi: </b>
                                {experiment.keywords?.length ? (
                                    experiment.keywords.map((k, i) => (
                                        <div key={i}>• {k}</div>
                                    ))
                                ) : <EmptyValue text="Nema ključnih riječi"/>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Opis</CardTitle></CardHeader>
                        <CardContent>{experiment.description || <EmptyValue text="Nema opisa"/>}</CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Pribor i potrošni materijal</CardTitle></CardHeader>
                        <CardContent>{experiment.materials ||
                            <EmptyValue text="Nema pribora i potrošnog materijala"/>}</CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Komponente</CardTitle></CardHeader>
                        <CardContent>
                            {experiment.componentDTOList?.length ? (
                                experiment.componentDTOList.map(comp => (
                                    <div
                                        key={comp.id}
                                        className="text-blue-500 hover:underline cursor-pointer"
                                        onClick={() => navigate(`/component/view/${comp.id}`)}
                                    >
                                        {comp.name} - {comp.zpf}
                                    </div>
                                ))
                            ) : <EmptyValue text="Nema povezanih komponenti"/>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Zadnji logovi</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            <div className="flex gap-2">
                                <input
                                    value={newLog}
                                    onChange={(e) => setNewLog(e.target.value)}
                                    placeholder="Dodaj novi log..."
                                    className="flex-1 border rounded px-3 py-2 text-sm"
                                />

                                <button
                                    onClick={handleAddLog}
                                    disabled={addingLog}
                                    className="bg-pink-500 text-white px-3 py-2 rounded text-sm hover:bg-pink-600 disabled:opacity-50"
                                >
                                    {addingLog ? "..." : "Dodaj"}
                                </button>
                            </div>

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

                                {latestLogs.length ? (
                                    <div className="pt-3 flex justify-center">
                                        <button
                                            onClick={() => navigate(`/experiment/view-log/${experiment.id}`)}
                                            className="bg-pink-500 text-white px-3 py-2 rounded text-sm hover:bg-pink-600 disabled:opacity-50"
                                        >
                                            Svi logovi
                                        </button>
                                    </div>
                                ) : null}

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

                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Galerija</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2">
                            {generalFiles?.length > 0 ? (
                                galleryImages.map(img => (
                                    <img
                                        key={img.id}
                                        src={`data:image/jpeg;base64,${img.fileByte}`}
                                        className="h-28 w-full object-cover rounded cursor-pointer hover:scale-105 transition"
                                        onClick={() => openImage(img)}
                                    />
                                ))
                            ) : (
                                <EmptyValue text="Nema fotografija"/>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dokumenti</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                            {generalFiles?.length > 0 ? (
                                generalFiles.map(file => (
                                    <a
                                        key={file.id}
                                        href={`data:application/octet-stream;base64,${file.fileByte}`}
                                        download={file.name}
                                        className="block text-blue-600 hover:underline"
                                    >
                                        {file.name}
                                    </a>
                                ))
                            ) : (
                                <EmptyValue text="Nema datoteka"/>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>

            {activeImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setActiveImage(null)}
                >
                    <img
                        src={`data:image/jpeg;base64,${activeImage.fileByte}`}
                        className="max-h-[85vh] rounded-lg shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

        </div>
    );
}

export default ExperimentView;