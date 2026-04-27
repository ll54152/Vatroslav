import React, {useEffect, useMemo, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import ComponentEdit from "@/pages/ComponentEdit.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";

function ExperimentEdit() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [validationMessage, setValidationMessage] = useState();

    const [experimentName, setExperimentName] = useState("");
    const [internalCode, setInternalCode] = useState("");

    const [description, setDescription] = useState("");
    const [keywords, setKeywords] = useState("");

    const [subject, setSubject] = useState("");
    const [field, setField] = useState("");

    const [materials, setMaterials] = useState("");

    const [experiments, setExperiments] = useState([]);

    const [components, setComponents] = useState([]);
    const [componentSearchQuery, setComponentSearchQuery] = useState("");
    const [componentSearchResults, setComponentSearchResults] = useState([]);
    const [selectedComponents, setSelectedComponents] = useState([]);


    const [existingImages, setExistingImages] = useState([]);
    const [keepImages, setKeepImages] = useState([]);

    const [existingFiles, setExistingFiles] = useState([]);
    const [keepFileIds, setKeepFileIds] = useState([]);

    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [newProfileImage, setNewProfileImage] = useState(null);
    const [newOtherImages, setNewOtherImages] = useState([]);
    const [newDocuments, setNewDocuments] = useState([]);

    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [galleryImageUrls, setGalleryImageUrls] = useState({});

    const [activeImageIndex, setActiveImageIndex] = useState(null);

    const profileImage = useMemo(
        () => existingFiles.find(f => f.fileCategory === "profileImage"),
        [existingFiles]
    );

    const otherImages = useMemo(
        () => existingFiles.filter(f => f.fileCategory === "otherImage"),
        [existingFiles]
    );

    const documents = useMemo(
        () => existingFiles.filter(f => f.fileCategory === "general"),
        [existingFiles]
    );

    const profileImageFile = useMemo(
        () => existingFiles.find(f => f.fileCategory === "profileImage"),
        [existingFiles]
    );

    useEffect(() => {
        const token = localStorage.getItem("jwt");

        const fetchExperiment = async () => {
            const res = await fetch(`/vatroslav/api/experiment/get/${id}`, {
                headers: {Authorization: token},
            });

            if (!res.ok) return;

            const data = await res.json();

            setExperimentName(data.name);
            setInternalCode(data.zpf);

            setDescription(data.description);
            setKeywords((data.keywords || []).join("; "));

            setSubject(data.subject);
            setField(data.field);

            setMaterials(data.materials);

            setSelectedComponents(data.componentDTOList || []);

            setExistingImages(data.images || []);
            setKeepImages((data.images || []).map(img => img.id));

            setExistingFiles(data.fileShowDTOList || []);
            setKeepFileIds((data.fileShowDTOList || []).map(f => f.id));
        };

        const fetchComponents = async () => {
            const res = await fetch("/vatroslav/api/component/getAll", {
                headers: {Authorization: token},
            });

            if (res.ok) {
                setComponents(await res.json());
            }
        };

        fetchComponents();
        fetchExperiment();
    }, [id]);

    useEffect(() => {
        return () => {
            if (profileImageUrl) URL.revokeObjectURL(profileImageUrl);
            Object.values(galleryImageUrls).forEach(URL.revokeObjectURL);
        };
    }, [profileImageUrl, galleryImageUrls]);


    useEffect(() => {
        return () => {
            if (profileImageUrl) URL.revokeObjectURL(profileImageUrl);
            Object.values(galleryImageUrls).forEach(URL.revokeObjectURL);
        };
    }, [profileImageUrl, galleryImageUrls]);

    const newProfilePreview = newProfileImage
        ? URL.createObjectURL(newProfileImage)
        : null;

    const gridGallery = useMemo(() => {
        const profile = profileImageFile && (profileImageUrl || newProfilePreview)
            ? [{
                type: "profile",
                id: profileImageFile.id,
                url: newProfilePreview || profileImageUrl,
                name: profileImageFile.name
            }]
            : [];

        const existing = otherImages.map(img => ({
            type: "existing",
            id: img.id,
            url: galleryImageUrls[img.id],
            name: img.name
        }));

        const fresh = newImagePreviews.map(img => ({
            type: "new",
            url: img.url,
            name: img.file.name
        }));

        return [...profile, ...existing, ...fresh];
    }, [
        profileImageFile,
        profileImageUrl,
        newProfilePreview,
        otherImages,
        newImagePreviews,
        galleryImageUrls
    ]);

    const viewerGallery = useMemo(() => {
        return gridGallery.filter(item => {
            if (item.type === "new") return true;

            if (item.type === "profile") return true;

            return item.id ? keepFileIds.includes(item.id) : true;
        });
    }, [gridGallery, keepFileIds]);

    useEffect(() => {
        const loadProfileImage = async () => {
            if (!profileImageFile) return;

            const token = localStorage.getItem("jwt");

            const res = await fetch(`/vatroslav/api/files/image/${profileImageFile.id}`, {
                headers: {Authorization: `${token}`},
            });

            if (!res.ok) return;

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            setProfileImageUrl(url);
        };

        loadProfileImage();
    }, [profileImageFile]);

    useEffect(() => {
        if (activeImageIndex === null) return;

        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") {
                setActiveImageIndex(prev =>
                    prev === viewerGallery.length - 1 ? 0 : prev + 1
                );
            } else if (e.key === "ArrowLeft") {
                setActiveImageIndex(prev =>
                    prev === 0 ? viewerGallery.length - 1 : prev - 1
                );
            } else if (e.key === "Escape") {
                setActiveImageIndex(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeImageIndex, viewerGallery.length]);

    useEffect(() => {
        if (!newOtherImages.length) {
            setNewImagePreviews([]);
            return;
        }

        const previews = newOtherImages.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        setNewImagePreviews(previews);

        return () => {
            previews.forEach(p => URL.revokeObjectURL(p.url));
        };
    }, [newOtherImages]);

    useEffect(() => {
        const loadGalleryImages = async () => {
            const token = localStorage.getItem("jwt");

            const urls = await Promise.all(
                otherImages.map(async (img) => {
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

        if (otherImages.length > 0) loadGalleryImages();
    }, [galleryImageUrls, otherImages]);

    const handleUpdate = async () => {
        const token = localStorage.getItem("jwt");


        const dto = {
            name: experimentName,
            zpf: internalCode,
            subject: subject,
            field: field,
            description,
            keywords: keywords ? keywords.split(";").map(k => k.trim()).filter(k => k !== "") : [],
            materials: materials,
            componentIds: selectedComponents.map(comp => comp.id),
            existingFileIds: keepFileIds,
        };

        const formData = new FormData();
        formData.append(
            "data",
            new Blob([JSON.stringify(dto)], {type: "application/json"})
        );

        if (newProfileImage) formData.append("profileImage", newProfileImage);
        newOtherImages.forEach(f => formData.append("otherImages", f));
        newDocuments.forEach(f => formData.append("files", f));

        const res = await fetch(`/vatroslav/api/experiment/edit/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `${token}`,
            },
            body: formData,
        });

        if (res.ok) {
            alert("Eksperiment ažuriran");
            navigate(`/experiment/view/${id}`);

        } else {
            alert(await res.text());
        }
    };

    const handleDownloadImages = async (file) => {
        if (!file) return;

        if (file.type === "new") {
            const a = document.createElement("a");
            a.href = file.url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            return;
        }

        const token = localStorage.getItem("jwt");

        const res = await fetch(`/vatroslav/api/files/image/${file.id}`, {
            headers: {Authorization: token},
        });

        if (!res.ok) {
            alert("Download failed");
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = file.name || "file";
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
    };

    const handleDownloadFiles = async (file) => {
        const token = localStorage.getItem("jwt");

        const res = await fetch(`/vatroslav/api/files/download/${file.id}`, {
            headers: {Authorization: `${token}`},
        });

        if (!res.ok) {
            alert("Ne mogu preuzeti datoteku");
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = file.name || "file";
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
    };

    const toggleFile = (fileId) => {
        setKeepFileIds(prev =>
            prev.includes(fileId)
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        );
    };

    return (
        <Card className="w-full p-2 lg:p-4">
            <CardHeader className="flex flex-col items-center p-3 lg:p-6">
                <CardTitle className="text-4xl font-bold mb-4">
                    Uredi eksperiment
                </CardTitle>

                <Input
                    placeholder="Unesite naziv eksperimenta"
                    value={experimentName}
                    onChange={(e) => setExperimentName(e.target.value)}
                />
            </CardHeader>

            <CardContent className="w-full p-2 lg:p-6">
                <form className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6 w-full">
                    <div className="flex flex-col space-y-6">
                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>ZPF inventarna oznaka</CardTitle>
                            <Input placeholder="Unesite 5 velikih slova (obavezno)" value={internalCode}
                                   onChange={(e) => {
                                       const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
                                       setInternalCode(value);
                                       if (value.length === 5 && /^[A-Z]{5}$/.test(value)) {
                                           setValidationMessage("Ispravno");
                                       } else {
                                           setValidationMessage("Neispravno: Točno 5 velikih slova!");
                                       }
                                   }}/>
                            {validationMessage && (
                                <p className={`text-sm ${validationMessage === "Ispravno" ? "text-green-600" : "text-red-600"}`}>
                                    {validationMessage}
                                </p>
                            )}
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Nastavni predmet</CardTitle>
                            <Input
                                placeholder="Unesite nastavni predmet"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Područje fizike</CardTitle>
                            <Input
                                placeholder="Unesite područje fizike"
                                value={field}
                                onChange={(e) => setField(e.target.value)}
                            />
                        </Card>

                    </div>

                    <div className="flex flex-col space-y-6">
                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Komponente</CardTitle>

                            <Input
                                placeholder="Pretražite komponente"
                                value={componentSearchQuery}
                                onChange={(e) => {
                                    const query = e.target.value.toLowerCase();
                                    setComponentSearchQuery(query);
                                    if (!query) {
                                        setComponentSearchResults([]);
                                        return;
                                    }
                                    const filtered = experiments.filter((comp) =>
                                        comp.name.toLowerCase().includes(query)
                                    );
                                    setComponentSearchResults(filtered);
                                }}
                            />
                            {componentSearchResults.map((comp) => (
                                <div key={comp.id} className="w-full flex flex-col space-y-1.5">
                                    <span>{comp.name}</span>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            if (!selectedComponents.some(c => c.id === comp.id)) {
                                                setSelectedComponents([...selectedComponents, comp]);
                                            }
                                        }}
                                        className="bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        Dodaj
                                    </Button>
                                </div>
                            ))}

                            <div className="mt-2">
                                <h4 className="text-sm font-medium">Odabrane komponente:</h4>
                                {selectedComponents.map((comp, index) => (
                                    <div key={comp.id} className="flex justify-between items-center border-b py-1">
                                        <span>{comp.name}</span>
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                setSelectedComponents(selectedComponents.filter((_, i) => i !== index))
                                            }
                                            className="bg-red-500 text-white hover:bg-red-600"
                                        >
                                            Ukloni
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-4 space-y-6">
                            <CardTitle>Datoteke</CardTitle>

                            <div>
                                <h3 className="font-semibold">Profilna slika</h3>

                                {(profileImageFile || newProfilePreview) && (
                                    <div
                                        className={`flex gap-3 items-center mt-2 p-2 rounded border
                                            ${profileImageFile && !keepFileIds.includes(profileImageFile.id)
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-200"
                                        }`}
                                    >
                                        <img
                                            src={newProfilePreview || profileImageUrl}
                                            onClick={() => setActiveImageIndex(0)}
                                        />


                                    </div>

                                )}
                                {profileImageFile && (
                                    <Button className="bg-red-500 text-white hover:bg-red-600 mt-1 w-full"
                                            type="button"
                                            onClick={() => toggleFile(profileImageFile.id)}
                                    >
                                        {keepFileIds.includes(profileImageFile.id) ? "Obriši" : "Vrati"}
                                    </Button>
                                )}

                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewProfileImage(e.target.files[0])}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <h3 className="font-semibold">Galerija</h3>

                                <div className="grid grid-cols-3 gap-3 mt-2">

                                    {otherImages.map(img => (

                                        <div
                                            key={img.id}
                                            className={`border p-2 rounded transition
                                            ${keepFileIds.includes(img.id)
                                                ? "border-gray-300"
                                                : "border-red-500 bg-red-50"
                                            }`}
                                        >
                                            {galleryImageUrls[img.id] ? (
                                                <img
                                                    src={galleryImageUrls[img.id]}
                                                    className="w-full h-24 object-cover rounded cursor-pointer"
                                                    onClick={() => {
                                                        const index = viewerGallery.findIndex(i => i.id === img.id);
                                                        setActiveImageIndex(index);
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
                                            )}


                                            <Button
                                                className="mt-1 w-full bg-red-500 text-white hover:bg-red-600"
                                                type="button"
                                                onClick={() => toggleFile(img.id)}
                                            >
                                                {keepFileIds.includes(img.id) ? "Obriši" : "Vrati"}
                                            </Button>
                                        </div>
                                    ))}

                                    {newImagePreviews.map((img, idx) => {

                                        return (
                                            <div key={idx} className="border p-2 rounded border-green-400">
                                                <img
                                                    src={img.url}
                                                    className="w-full h-24 object-cover rounded cursor-pointer"
                                                    onClick={() => {
                                                        const index = viewerGallery.findIndex(i => i.url === img.url);
                                                        setActiveImageIndex(index);
                                                    }}
                                                />
                                                <span className="text-xs text-green-600">Nova fotografija</span>
                                            </div>
                                        );
                                    })}

                                </div>

                                <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setNewOtherImages(Array.from(e.target.files))}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <h3 className="font-semibold">Dokumenti</h3>

                                {documents.length > 0 ? (
                                    <div className="space-y-2 mt-2">
                                        {documents.map(file => (
                                            <div
                                                key={file.id}
                                                className={`flex justify-between items-center border p-2 rounded
                                                    ${keepFileIds.includes(file.id)
                                                    ? "border-gray-300"
                                                    : "border-red-500 bg-red-50"
                                                }`}
                                            >
                                                <span className="text-sm truncate">{file.name}</span>

                                                <div className="flex gap-2">
                                                    <Button
                                                        className="bg-pink-500 text-white"
                                                        type="button"
                                                        onClick={() => handleDownloadFiles(file)}
                                                    >
                                                        Preuzmi
                                                    </Button>

                                                    <Button
                                                        className="bg-red-500 text-white hover:bg-red-600"
                                                        type="button"
                                                        onClick={() => toggleFile(file.id)}
                                                    >
                                                        {keepFileIds.includes(file.id) ? "Obriši" : "Vrati"}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 mt-2">Nema dokumenata</p>
                                )}

                                <Input
                                    type="file"
                                    multiple
                                    onChange={(e) => setNewDocuments(Array.from(e.target.files))}
                                    className="mt-2"
                                />
                            </div>
                        </Card>
                    </div>

                    <div className="flex flex-col space-y-6">

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Opis</CardTitle>
                            <Textarea placeholder="Unesite kratak opis" value={description}
                                      onChange={(e) => setDescription(e.target.value)}/>
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Ključne riječi</CardTitle>
                            <Textarea
                                placeholder="Unesite ključne riječi odvojene točkom-zarezom (;). Npr. Uređaj; Laptop"
                                value={keywords} onChange={(e) => setKeywords(e.target.value)}/>
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Pribor i potrošni materijal</CardTitle>
                            <Textarea placeholder="Unesite pribor i potrošni materijal" value={materials}
                                      onChange={(e) => setMaterials(e.target.value)}/>
                        </Card>
                    </div>
                </form>

            </CardContent>

            <div className="flex justify-center">
                <Button className="m-5 bg-pink-500 text-white"
                        onClick={handleUpdate}>
                    Spremi izmjene
                </Button>
            </div>


            {activeImageIndex !== null && (

                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setActiveImageIndex(null)}
                >

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(prev =>
                                prev === 0 ? viewerGallery.length - 1 : prev - 1
                            );
                        }}
                        className="absolute left-4 text-white text-4xl"
                    >
                        ‹
                    </button>

                    <img
                        src={viewerGallery[activeImageIndex]?.url}
                        className="max-h-[85vh] max-w-[95vw] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(prev =>
                                prev === viewerGallery.length - 1 ? 0 : prev + 1
                            );
                        }}
                        className="absolute right-4 text-white text-4xl"
                    >
                        ›
                    </button>

                    <div className="absolute bottom-4 right-4 flex gap-2">


                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadImages(viewerGallery[activeImageIndex]);
                            }}
                            className="bg-pink-500 text-white px-3 py-1 rounded"
                        >
                            Preuzmi
                        </button>
                        {viewerGallery[activeImageIndex]?.type !== "new" && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();

                                    const item = viewerGallery[activeImageIndex];

                                    if (item?.id) {
                                        toggleFile(item.id);
                                    }
                                }}
                                className={`px-3 py-1 rounded text-white ${
                                    viewerGallery[activeImageIndex] &&
                                    keepFileIds.includes(viewerGallery[activeImageIndex].id)
                                        ? "bg-red-600"
                                        : "bg-green-600"
                                }`}
                            >
                                {viewerGallery[activeImageIndex] &&
                                    keepFileIds.includes(viewerGallery[activeImageIndex].id)
                                } Obriši
                            </button>
                        )}
                    </div>

                </div>
            )}
        </Card>
    );
}

export default ExperimentEdit;