import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

function ExperimentView() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [experiment, setExperiment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newLog, setNewLog] = useState("");
    const [addingLog, setAddingLog] = useState(false);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);
    const [logToDelete, setLogToDelete] = useState(null);


    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [galleryImageUrls, setGalleryImageUrls] = useState({});


    const galleryImages = useMemo(() => {
        return experiment?.fileShowDTOList?.filter(f => f.fileCategory === "otherImage") || [];
    }, [experiment?.fileShowDTOList]);

    const generalFiles = useMemo(() => {
        return experiment?.fileShowDTOList?.filter(f => f.fileCategory === "general") || [];
    }, [experiment?.fileShowDTOList]);

    const [activeImageIndex, setActiveImageIndex] = useState(null);
    const activeImage = activeImageIndex !== null ? galleryImages[activeImageIndex] : null;
    const profileImageFile = experiment?.fileShowDTOList?.find(f => f.fileCategory === "profileImage");

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

    useEffect(() => {
        const loadGalleryImages = async () => {
            const token = localStorage.getItem("jwt");

            const urls = await Promise.all(
                galleryImages.map(async (img) => {
                    if (!galleryImageUrls[img.id]) {
                        const res = await fetch(`/vatroslav/api/files/image/${img.id}`, {
                            headers: {Authorization: `${token}`},
                        });
                        if (!res.ok) return null;
                        const blob = await res.blob();
                        return {id: img.id, url: URL.createObjectURL(blob)};
                    }
                    return null;
                })
            );

            const urlMap = urls.reduce((acc, cur) => {
                if (cur) acc[cur.id] = cur.url;
                return acc;
            }, {...galleryImageUrls});

            setGalleryImageUrls(urlMap);
        };

        if (galleryImages.length > 0) loadGalleryImages();
    }, [galleryImageUrls, galleryImages]);

    const handleDownload = async (file) => {
        const token = localStorage.getItem("jwt");
        const res = await fetch(`/vatroslav/api/files/download/${file.id}`, {
            headers: {Authorization: `${token}`},
        });
        if (!res.ok) return alert("Cannot download file");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const loadProfileImage = async () => {
            if (!profileImageFile) return;

            const token = localStorage.getItem("jwt");
            const res = await fetch(`/vatroslav/api/files/image/${profileImageFile.id}`, {
                headers: {Authorization: `${token}`},
            });

            if (!res.ok) return;

            const blob = await res.blob();
            setProfileImageUrl(URL.createObjectURL(blob));
        };

        loadProfileImage();
    }, [profileImageFile]);

    useEffect(() => {
        if (activeImageIndex === null) return;

        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") {
                setActiveImageIndex((prev) =>
                    prev === null || prev === galleryImages.length - 1 ? 0 : prev + 1
                );
            } else if (e.key === "ArrowLeft") {
                setActiveImageIndex((prev) =>
                    prev === null || prev === 0 ? galleryImages.length - 1 : prev - 1
                );
            } else if (e.key === "Escape") {
                setActiveImageIndex(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeImageIndex, galleryImages.length]);

    if (loading) return <div className="p-6">Učitavanje...</div>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!experiment) return <div className="p-6">Nema podataka</div>;

    const EmptyValue = ({text = "N/A"}) => (
        <span className="text-gray-400 italic">{text}</span>
    );


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
                {profileImageFile ? (
                    profileImageUrl ? (
                        <img
                            src={profileImageUrl}
                            className="w-full max-w-md sm:max-w-2xl h-auto rounded-2xl object-contain cursor-pointer"
                        />
                    ) : (
                        <div className="w-56 h-56 bg-gray-200 rounded-3xl flex items-center justify-center">
                            <span className="text-gray-400 italic">Učitavanje...</span>
                        </div>
                    )
                ) : (
                    <div className="w-56 h-56 bg-gray-200 rounded-3xl flex items-center justify-center">
                        <EmptyValue text="Nema profilne fotografije"/>
                    </div>
                )}

                <h1 className="text-3xl font-bold mt-4">{experiment.name}</h1>
                <p className="text-gray-500">{experiment.zpf}</p>
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
                        <CardHeader>
                            <CardTitle>Galerija</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
                            {galleryImages.length > 0 ? (
                                galleryImages.map((img, idx) => (
                                    galleryImageUrls[img.id] ? (
                                        <img
                                            key={img.id}
                                            src={galleryImageUrls[img.id]}
                                            className="w-full aspect-square object-cover rounded cursor-pointer"
                                            onClick={() => openImage(idx)}
                                        />
                                    ) : (
                                        <div key={img.id}
                                             className="h-28 w-full bg-gray-200 rounded animate-pulse"></div>
                                    )
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
                            {generalFiles.length > 0 ? (
                                generalFiles.map((file) => (
                                    <button
                                        key={file.id}
                                        onClick={() => handleDownload(file)}
                                        className="bg-pink-500 text-white px-3 py-2 m-1 rounded text-sm hover:bg-pink-600 disabled:opacity-50"
                                    >
                                        {file.name}
                                    </button>
                                ))
                            ) : (
                                <EmptyValue text="Nema datoteka"/>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>

            {activeImageIndex !== null && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setActiveImageIndex(null)}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
                        }}
                        className="absolute left-4 text-white text-3xl font-bold"
                    >
                        ‹
                    </button>

                    <img
                        src={galleryImageUrls[galleryImages[activeImageIndex].id]}
                        alt={galleryImages[activeImageIndex].name}
                        className="max-h-[85vh] max-w-[95vw] object-contain rounded-lg shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-4 text-white text-3xl font-bold"
                    >
                        ›
                    </button>

                    <div className="absolute bottom-4 right-4 flex gap-2">
                        <a
                            href={galleryImageUrls[galleryImages[activeImageIndex].id]}
                            download={galleryImages[activeImageIndex].name}
                            className="bg-pink-500 text-white px-3 py-1 rounded"
                        >
                            Download
                        </a>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ExperimentView;