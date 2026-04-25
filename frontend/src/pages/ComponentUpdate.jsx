import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";

function ComponentUpdate() {
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

    const [profileImage, setProfileImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]);
    const [documents, setDocuments] = useState([]);

    // existing images (IMPORTANT)
    const [existingImages, setExistingImages] = useState([]);
    const [keepImages, setKeepImages] = useState([]);

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

    const toggleImage = (id) => {
        setKeepImages((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem("jwt");

        // Ensure locationID is a valid number
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
            locationID: locationID,  // Use the validated locationID
            description,
            keywords: keywords ? keywords.split(";").map(k => k.trim()).filter(k => k !== "") : [],
            experimentIds: selectedExperiments.map(exp => exp.id),  // Ensure experimentIds is an array of Long values
            keepExistingImageIds: keepImages,
        };

        const formData = new FormData();

        formData.append(
            "data",
            new Blob([JSON.stringify(dto)], { type: "application/json" })
        );

        if (profileImage) formData.append("profileImage", profileImage);
        otherImages.forEach(f => formData.append("otherImages", f));
        documents.forEach(f => formData.append("files", f));

        const res = await fetch(`/vatroslav/api/component/update/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `${token}`,
                // Don't manually set Content-Type for FormData; the browser will do this for you.
            },
            body: formData,  // Let the browser set Content-Type to multipart/form-data
        });

        if (res.ok) {
            alert("Komponenta ažurirana");
            navigate("/components");
        } else {
            alert(await res.text());
        }
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
                    value={componentName}
                    onChange={(e) => setComponentName(e.target.value)}
                />
            </CardHeader>

            <CardContent className="w-full p-2 lg:p-6">


                <form className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6 w-full">
                    <div className="flex flex-col space-y-6">
                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>ZPF</CardTitle>
                            <Input value={internalCode}
                                   onChange={(e) => {
                                       const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
                                       setInternalCode(value);
                                       if (value.length === 5 && /^[A-Z]{5}$/.test(value)) {
                                           setValidationMessage("Ispravno (slova)");
                                       } else {
                                           setValidationMessage("Neispravno: Točno 5 velikih slova!");
                                       }
                                   }}/>
                            <Input value={optionalNumbers}
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
                            <CardTitle>FER Inventarska oznaka</CardTitle>
                            <Input value={fer} onChange={(e) => setFer(e.target.value)}/>
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Status FER inventarne oznake</CardTitle>
                            <Select value={ferStatus} onValueChange={setFerStatus}>
                                <SelectTrigger>
                                    <SelectValue/>
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
                                value={deprecatedMarks}
                                onChange={(e) => setDeprecatedMarks(e.target.value)}
                            />
                        </Card>
                    </div>


                    <div className="flex flex-col space-y-6">

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Eksperimenti</CardTitle>

                            <Input
                                placeholder="Pretraži eksperimente"
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
                            <CardTitle>Gdje se nalazi</CardTitle>
                            <Input
                                placeholder="Pretraži lokacije..."
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

                            <div className="w-full max-w-4xl flex flex-col space-y-1.5">
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
                                <div className="w-full max-w-4xl flex flex-col space-y-1.5">
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


                        <Card className="p-2">
                            <CardTitle>DATOTEKE TODO</CardTitle>
                        </Card>

                    </div>


                    <div className="flex flex-col space-y-6">

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Količina</CardTitle>
                            <Input value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Kratak opis</CardTitle>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)}/>
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Ključne riječi</CardTitle>
                            <Textarea value={keywords} onChange={(e) => setKeywords(e.target.value)}/>
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
        </Card>
    );
}

export default ComponentUpdate;