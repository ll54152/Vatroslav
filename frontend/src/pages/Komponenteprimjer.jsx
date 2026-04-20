import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function KomponentePrimjerView() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [component, setComponent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(null);
    const [newLog, setNewLog] = useState("");
    const [addingLog, setAddingLog] = useState(false);

    useEffect(() => {
        const load = async () => {
            const token = localStorage.getItem("jwt");

            const res = await fetch(`/vatroslav/api/component/get/${id}`, {
                headers: {Authorization: `${token}`},
            });

            const data = await res.json();
            setComponent(data);
            setLoading(false);
        };

        load();
    }, [id]);

    if (loading) return <div className="p-6">Učitavanje...</div>;
    if (!component) return <div className="p-6">Nema podataka</div>;

    const profileImage = component.fileShowDTOList?.find(f => f.fileCategory === "profileImage");
    const galleryImages = component.fileShowDTOList?.filter(f => f.fileCategory === "otherImage") || [];
    const generalFiles = component.fileShowDTOList?.filter(f => f.fileCategory === "general") || [];

    const EmptyValue = ({ text = "N/A" }) => (
        <span className="text-gray-400 italic">{text}</span>
    );


    const logs = (component.logShowDTOList || [])
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 3);

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
                const created = await response.json();

                setComponent(prev => ({
                    ...prev,
                    logShowDTOList: [created, ...(prev.logShowDTOList || [])],
                }));

                setNewLog("");
            }
        } finally {
            setAddingLog(false);
        }
    };

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="flex flex-col gap-6">

                    <Card>
                        <CardHeader><CardTitle>Osnovno</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <b>Lokacija: </b>
                                {component.locationDTO
                                    ? `${component.locationDTO.address}, ${component.locationDTO.room}`
                                    : <EmptyValue text="Nema lokacije"/>}
                            </div>
                            <div><b>Količina:</b> {component.quantity}</div>
                            <div><b>Ključne riječi: </b>
                                {component.keywords?.length ? (
                                    component.keywords.map((k, i) => (
                                        <div key={i}>• {k}</div>
                                    ))
                                ) : <EmptyValue text="Nema ključnih riječi"/>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Opis</CardTitle></CardHeader>
                        <CardContent>{component.description || <EmptyValue text="Nema opisa"/>}</CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Inventarske oznake</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <b>Status FER inventarne oznake: </b>
                                {component.ferStatus || <EmptyValue text="Nema statusa FER inventarne oznake"/>}
                            </div>
                            <div><b>FER Inventarna oznaka: </b> {component.fer || "N/A"}</div>
                            <div><b>Zastarjele inventarne oznake: </b>
                                {component.deprecatedInventoryMarks?.length ? (
                                    component.deprecatedInventoryMarks.map((k, i) => (
                                        <div key={i}>• {k}</div>
                                    ))
                                ) : <EmptyValue text="Nema zastarjelih inventarskih oznaka"/>}
                            </div>
                        </CardContent>
                    </Card>

                </div>


                <div className="flex flex-col gap-6">


                    <Card>
                        <CardHeader><CardTitle>Eksperimenti</CardTitle></CardHeader>
                        <CardContent>
                            {component.experimentShowDTOList?.length ? (
                                component.experimentShowDTOList.map(exp => (
                                    <div
                                        key={exp.id}
                                        className="text-blue-500 hover:underline cursor-pointer"
                                        onClick={() => navigate(`/experimentiprimjer/${exp.id}`)}
                                    >
                                        {exp.name}
                                    </div>
                                ))
                            ) : "Nema"}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Zadnji logovi</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            {/* INPUT AREA */}
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

                            {/* LOG LIST */}
                            <div className="space-y-3">
                                {logs.length ? logs.map(log => (
                                    <div key={log.id} className="border-b pb-2 text-sm">
                                        <div>{log.note}</div>
                                        <div className="text-gray-500">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                )) : (
                                    <EmptyValue text="Nema logova" />
                                )}
                            </div>

                        </CardContent>
                    </Card>

                </div>

                <div className="flex flex-col gap-6">

                    <Card>
                        <CardHeader><CardTitle>Galerija</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2">
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
                            </div>
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