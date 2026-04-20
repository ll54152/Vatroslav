import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function KomponentePrimjerView() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [component, setComponent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(null);

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

    // FILE GROUPING
    const profileImage = component.fileShowDTOList?.find(f => f.fileCategory === "profileImage");
    const galleryImages = component.fileShowDTOList?.filter(f => f.fileCategory === "otherImage") || [];
    const generalFiles = component.fileShowDTOList?.filter(f => f.fileCategory === "general") || [];

    const EmptyValue = ({ text = "N/A" }) => (
        <span className="text-gray-400 italic">{text}</span>
    );


    // LAST 3 LOGS
    const logs = (component.logShowDTOList || [])
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 3);

    const openImage = (img) => setActiveImage(img);

    return (
        <div className="min-h-screen p-6">

            {/* ================= HERO ================= */}
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

            {/* ================= 3 COLUMN GRID ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ===== LEFT COLUMN ===== */}
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


                {/* ===== MIDDLE COLUMN ===== */}
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
                        <CardHeader><CardTitle>Zadnji logovi</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {logs.length ? logs.map(log => (
                                <div key={log.id} className="border-b pb-2 text-sm">
                                    <div>{log.note}</div>
                                    <div className="text-gray-500">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            )) : "Nema"}
                        </CardContent>
                    </Card>

                </div>

                {/* ===== RIGHT COLUMN ===== */}
                <div className="flex flex-col gap-6">

                    {/* GALLERY */}
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

                    {/* FILES */}
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

            {/* ================= LIGHTBOX ================= */}
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