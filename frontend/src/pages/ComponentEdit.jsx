import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";

function ComponentEdit() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [validationMessage, setValidationMessage] = useState();

    const [componentName, setComponentName] = useState("");
    const [internalCode, setInternalCode] = useState("");
    const [optionalNumbers, setOptionalNumbers] = useState("");

    const [fer, setFer] = useState("");
    const [ferStatus, setFerStatus] = useState("");
    const [deprecatedMarks, setDeprecatedMarks] = useState("");

    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [keywords, setKeywords] = useState("");

    const [location, setLocation] = useState("");
    const [locationSearchQuery, setLocationSearchQuery] = useState();
    const [locations, setLocations] = useState([]);
    const [showAddLocation, setShowAddLocation] = useState(false);
    const [newLocationAddress, setNewLocationAddress] = useState();
    const [newLocationRoom, setNewLocationRoom] = useState();

    const [experiments, setExperiments] = useState([]);
    const [experimentSearchQuery, setExperimentSearchQuery] = useState("");
    const [experimentSearchResults, setExperimentSearchResults] = useState([]);
    const [selectedExperiments, setSelectedExperiments] = useState([]);

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

        const fetchComponent = async () => {
            const res = await fetch(`/vatroslav/api/component/get/${id}`, {
                headers: {Authorization: token},
            });

            if (!res.ok) return;

            const data = await res.json();

            setComponentName(data.name);
            setInternalCode(data.zpf?.substring(0, 5) || "");
            setOptionalNumbers(data.zpf?.substring(5) || "");

            setFer(data.fer);
            setFerStatus(data.ferStatus);
            setDeprecatedMarks((data.deprecatedInventoryMarks || []).join("; "));
            setQuantity(data.quantity);
            setDescription(data.description);
            setKeywords((data.keywords || []).join("; "));
            setLocation(data.locationDTO);

            setSelectedExperiments(data.experimentDTOList || []);

            setExistingImages(data.images || []);
            setKeepImages((data.images || []).map(img => img.id));

            setExistingFiles(data.fileShowDTOList || []);
            setKeepFileIds((data.fileShowDTOList || []).map(f => f.id));
        };

        const fetchLocations = async () => {
            const res = await fetch("/vatroslav/api/location/getAll", {
                headers: {Authorization: token},
            });

            if (res.ok) {
                setLocations(await res.json());
            }
        };

        const fetchExperiments = async () => {
            const res = await fetch("/vatroslav/api/experiment/getAll", {
                headers: {Authorization: token},
            });

            if (res.ok) {
                setExperiments(await res.json());
            }
        };

        fetchComponent();
        fetchLocations();
        fetchExperiments();
    }, [id]);

    useEffect(() => {
        return () => {
            if (profileImageUrl) URL.revokeObjectURL(profileImageUrl);
            Object.values(galleryImageUrls).forEach(URL.revokeObjectURL);
        };
    }, [profileImageUrl, galleryImageUrls]);

    const newProfilePreview = newProfileImage
        ? URL.createObjectURL(newProfileImage)
        : null;

    const newGalleryPreviews = newOtherImages.map(file => ({
        file,
        url: URL.createObjectURL(file),
    }));

    const toggleImage = (id) => {
        setKeepImages((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

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
            // keep all new images
            if (item.type === "new") return true;

            // keep profile always
            if (item.type === "profile") return true;

            // ONLY keep existing if NOT deleted
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

        const locationID = isNaN(Number(location.id)) ? null : Number(location.id);

        const dto = {
            name: componentName,
            zpf: internalCode + optionalNumbers,
            fer,
            ferStatus,
            deprecatedInventoryMarks: deprecatedMarks
                ? deprecatedMarks.split(";").map(k => k.trim()).filter(k => k !== "")
                : [],
            quantity: Number(quantity),
            locationID: locationID,
            description,
            keywords: keywords ? keywords.split(";").map(k => k.trim()).filter(k => k !== "") : [],
            experimentIds: selectedExperiments.map(exp => exp.id),
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

        const res = await fetch(`/vatroslav/api/component/edit/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `${token}`,
            },
            body: formData,
        });

        if (res.ok) {
            alert("Komponenta ažurirana");
            navigate(`/component/view/${id}`);

        } else {
            alert(await res.text());
        }
    };

    const handleDownloadImages = async (file) => {
        if (!file) return;

        // NEW FILES (not uploaded yet)
        if (file.type === "new") {
            const a = document.createElement("a");
            a.href = file.url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            return;
        }

        // EXISTING FILES (backend)
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

    const handleDeleteLocation = async (locationId) => {
        const token = localStorage.getItem("jwt");

        if (!window.confirm("Jesi siguran da želiš obrisati lokaciju?")) return;

        try {
            const response = await fetch(`/vatroslav/api/location/delete/${locationId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                },
            });

            if (response.ok) {
                setLocations(locations.filter(loc => loc.id !== locationId));

                if (location === locationId.toString()) {
                    setLocation("");
                }
            } else {
                const err = await response.text();
                alert(`Greška: ${err}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const toggleFile = (fileId) => {
        setKeepFileIds(prev =>
            prev.includes(fileId)
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        );
    };

    const handleAddLocation = async (event) => {
        event.preventDefault();
        const newLocation = {
            address: newLocationAddress,
            room: newLocationRoom,
        };

        try {
            const token = localStorage.getItem("jwt");
            const response = await fetch("/vatroslav/api/location/add", {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newLocation),
            });

            const textResponse = await response.text();
            console.log("Response text:", textResponse);

            let data;
            try {
                data = JSON.parse(textResponse);
                console.log("Parsed response data:", data);
            } catch (jsonError) {
                console.error("Failed to parse response as JSON:", jsonError);
            }

            if (response.ok) {
                alert("Nova lokacija je dodana");
                setLocations([...locations, data]);
                setNewLocationAddress("");
                setNewLocationRoom("");
                setShowAddLocation(false);
            } else {
                alert(`Greška: ${textResponse}`);
            }
        } catch (error) {
            console.error("Error adding location:", error);
            alert("Došlo je do greške prilikom dodavanja lokacije.");
        }
    };

    return (
        <Card className="w-full p-2 lg:p-4">
            <CardHeader className="flex flex-col items-center p-3 lg:p-6">
                <CardTitle className="text-4xl font-bold mb-4">
                    Uredi komponentu
                </CardTitle>

                <Input
                    placeholder="Unesite naziv komponente"
                    value={componentName}
                    onChange={(e) => setComponentName(e.target.value)}
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
                                           setValidationMessage("Ispravno (slova)");
                                       } else {
                                           setValidationMessage("Neispravno: Točno 5 velikih slova!");
                                       }
                                   }}/>
                            <Input placeholder="Unesite 2 broja (opcionalno)" value={optionalNumbers}
                                   onChange={(e) => {
                                       const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                                       setOptionalNumbers(value);
                                   }}/>
                            {validationMessage && (
                                <p className={`text-sm ${validationMessage === "Ispravno (slova)" ? "text-green-600" : "text-red-600"}`}>
                                    {validationMessage}
                                </p>
                            )}
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>FER inventarska oznaka</CardTitle>
                            <Input placeholder="Unesite FER inventarsku oznaku" value={fer}
                                   onChange={(e) => setFer(e.target.value)}/>
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Status FER inventarne oznake</CardTitle>
                            <Select value={ferStatus} onValueChange={setFerStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Odaberite status FER inventarne oznake"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CATALOGED">Cataloged</SelectItem>
                                    <SelectItem value="UNCATALOGED">Uncataloged</SelectItem>
                                    <SelectItem value="UNKNOWN">Unknown</SelectItem>
                                </SelectContent>
                            </Select>
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Zastarjele inventarne oznake</CardTitle>
                            <Textarea
                                placeholder="Unesite zastarjele oznake (ako postoje) odvojene točkom-zarezom (;) . Npr. ZPF-ABCGSD01; PMF-ABCD232"
                                value={deprecatedMarks}
                                onChange={(e) => setDeprecatedMarks(e.target.value)}
                            />
                        </Card>
                    </div>


                    <div className="flex flex-col space-y-6">

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Eksperimenti</CardTitle>

                            <Input
                                placeholder="Pretražite eksperimente"
                                value={experimentSearchQuery}
                                onChange={(e) => {
                                    const query = e.target.value.toLowerCase();
                                    setExperimentSearchQuery(query);
                                    if (!query) {
                                        setExperimentSearchResults([]);
                                        return;
                                    }
                                    const filtered = experiments.filter((exp) =>
                                        exp.name.toLowerCase().includes(query)
                                    );
                                    setExperimentSearchResults(filtered);
                                }}
                            />
                            {experimentSearchResults.map((exp) => (
                                <div key={exp.id} className="w-full flex flex-col space-y-1.5">
                                    <span>{exp.name}</span>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            if (!selectedExperiments.some(e => e.id === exp.id)) {
                                                setSelectedExperiments([...selectedExperiments, exp]);
                                            }
                                        }}
                                        className="bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        Dodaj
                                    </Button>
                                </div>
                            ))}

                            <div className="mt-2">
                                <h4 className="text-sm font-medium">Odabrani eksperimenti:</h4>
                                {selectedExperiments.map((exp, index) => (
                                    <div key={exp.id} className="flex justify-between items-center border-b py-1">
                                        <span>{exp.name}</span>
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                setSelectedExperiments(selectedExperiments.filter((_, i) => i !== index))
                                            }
                                            className="bg-red-500 text-white hover:bg-red-600"
                                        >
                                            Ukloni
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Lokacija</CardTitle>
                            <Input
                                placeholder="Pretražite lokacije..."
                                value={locationSearchQuery}
                                onChange={(e) => setLocationSearchQuery(e.target.value)}
                            />
                            {location && (
                                <p className="text-sm text-green-600">
                                    Odabrano: {
                                    location.address || locations.find(loc => loc.id === parseInt(location))?.address
                                } - {
                                    location.room || locations.find(loc => loc.id === parseInt(location))?.room
                                }
                                </p>
                            )}

                            {locationSearchQuery && (
                                <div className="border rounded-md max-h-60 overflow-y-auto mt-1">
                                    {locations
                                        .filter(loc =>
                                            `${loc.address} ${loc.room}`
                                                .toLowerCase()
                                                .includes(locationSearchQuery.toLowerCase())
                                        )
                                        .map((loc) => (
                                            <div
                                                key={loc.id}
                                                className={`flex justify-between items-start px-3 py-2 border-b ${
                                                    location === loc.id.toString() ? "bg-gray-100" : ""
                                                }`}
                                            >
                                                <div
                                                    className="flex flex-col cursor-pointer gap-0.5 min-w-0"
                                                    onClick={() => {
                                                        setLocation(loc);
                                                        setLocationSearchQuery("");
                                                    }}
                                                >
                                                    <span
                                                        className="text-sm truncate"><strong>Address:</strong> {loc.address}</span>
                                                    <span className="text-sm truncate"><strong>Room:</strong> {loc.room}</span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={() => handleDeleteLocation(loc.id)}
                                                    className="ml-4 flex-shrink-0 mt-0.5 bg-red-500 text-white hover:bg-red-600"
                                                >
                                                    Obriši
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                            )}

                            <div className="w-full flex flex-col space-y-1.5">
                                <input
                                    id="addLocationCheckbox"
                                    type="checkbox"
                                    checked={showAddLocation}
                                    onChange={(e) => setShowAddLocation(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="addLocationCheckbox">Dodaj novu lokaciju</label>
                            </div>

                            {showAddLocation && (
                                <div className="w-full  flex flex-col space-y-1.5">
                                    <CardTitle>Dodaj novu lokaciju</CardTitle>
                                    <Input
                                        id="newLocationAddress"
                                        placeholder="Unesite adresu"
                                        value={newLocationAddress}
                                        onChange={(e) => setNewLocationAddress(e.target.value)}
                                    />
                                    <Input
                                        id="newLocationRoom"
                                        placeholder="Unesite dvoranu"
                                        value={newLocationRoom}
                                        onChange={(e) => setNewLocationRoom(e.target.value)}
                                    />
                                    <Button className="bg-pink-500 text-white" onClick={handleAddLocation}>
                                        Dodaj lokaciju
                                    </Button>
                                </div>
                            )}
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
                            <CardTitle>Količina</CardTitle>
                            <Input placeholder="Unesite količinu" value={quantity}
                                   onChange={(e) => setQuantity(e.target.value)}/>
                        </Card>

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

export default ComponentEdit;