import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import * as React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";

function ExperimentPublicView() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [experiment, setExperiment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newLog, setNewLog] = useState("");
    const [addingLog, setAddingLog] = useState(false);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);
    const [logToDelete, setLogToDelete] = useState(null);
    const [role, setRole] = useState(null);

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

    useEffect(() => {
        const fetchExperiment = async () => {
            try {
                const response = await fetch(`/vatroslav/api/experiment/getPublic/${id}`, {});
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
            const urls = await Promise.all(
                galleryImages.map(async (img) => {
                    if (!galleryImageUrls[img.id]) {
                        const res = await fetch(`/vatroslav/api/files/publicImage/${img.id}`, {});
                        if (!res.ok) return null;
                        const blob = await res.blob();
                        return {id: img.id, url: URL.createObjectURL(blob)};
                    }
                    return null;
                })
            );

            const newEntries = urls.filter(Boolean);
            if (newEntries.length > 0) {
                const urlMap = {...galleryImageUrls};
                newEntries.forEach(cur => {
                    urlMap[cur.id] = cur.url;
                });
                setGalleryImageUrls(urlMap);
            }
        };

        if (galleryImages.length > 0) loadGalleryImages();
    }, [galleryImageUrls, galleryImages]);

    useEffect(() => {
        const loadProfileImage = async () => {
            if (!profileImageFile) return;

            const res = await fetch(`/vatroslav/api/files/publicImage/${profileImageFile.id}`, {});

            if (!res.ok) return;

            const blob = await res.blob();
            setProfileImageUrl(URL.createObjectURL(blob));
        };

        loadProfileImage();
    }, [profileImageFile]);

    const openImage = (img) => setActiveImage(img);

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
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="text-gray-800">Osnovno</CardTitle>
                        </CardHeader>
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
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="text-gray-800">Opis</CardTitle></CardHeader>
                        <CardContent>{experiment.description || <EmptyValue text="Nema opisa"/>}</CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="text-gray-800">Pribor i potrošni materijal</CardTitle></CardHeader>
                        <CardContent>{experiment.materials ||
                            <EmptyValue text="Nema pribora i potrošnog materijala"/>}</CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="text-gray-800">Komponente</CardTitle></CardHeader>
                        <CardContent>
                            {experiment.componentDTOList?.length ? (
                                experiment.componentDTOList.map(comp => (
                                    <div key={comp.id}>
                                        {comp.name} - {comp.zpf}
                                    </div>
                                ))
                            ) : <EmptyValue text="Nema povezanih komponenti"/>}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="text-gray-800">Galerija</CardTitle>
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

export default ExperimentPublicView;