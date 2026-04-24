import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {useNavigate} from "react-router-dom";
import React, {useState, useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";

function ComponentAdd() {
    const [componentName, setComponentName] = useState();
    const [internalCode, setInternalCode] = useState();
    const [location, setLocation] = useState();
    const [experiments, setExperiments] = useState([]);
    const [experimentSearchQuery, setExperimentSearchQuery] = useState();
    const [experimentSearchResults, setExperimentSearchResults] = useState([]);
    const [selectedExperiments, setSelectedExperiments] = useState([]);
    const [keywords, setKeywords] = useState();
    const [ferStatus, setFerStatus] = useState();
    const [fer, setFer] = useState();
    const [deprecatedMarks, setDeprecatedMarks] = useState();
    const [showAddLocation, setShowAddLocation] = useState(false);
    const [quantity, setQuantity] = useState();
    const [description, setDescription] = useState();
    const [locations, setLocations] = useState([]);
    const [newLocationAddress, setNewLocationAddress] = useState();
    const [newLocationRoom, setNewLocationRoom] = useState();
    const [locationSearchQuery, setLocationSearchQuery] = useState();
    const [profileImage, setProfileImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [validationMessage, setValidationMessage] = useState();
    const navigate = useNavigate();
    const [optionalNumbers, setOptionalNumbers] = useState();


    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const token = localStorage.getItem("jwt");
                const response = await fetch("/vatroslav/api/location/getAll", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setLocations(data);
                } else {
                    console.error("Failed to fetch locations");
                }
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };

        const fetchExperiments = async () => {
            try {
                const token = localStorage.getItem("jwt");
                const response = await fetch("/vatroslav/api/experiment/getAll", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setExperiments(data);
                } else {
                    console.error("Failed to fetch experiments");
                }
            } catch (error) {
                console.error("Error fetching experiments:", error);
            }
        };

        fetchLocations().then(r => console.log("Locations fetched:", r));
        fetchExperiments().then(r => console.log("Experiments fetched:", r));
    }, []);

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

    const handleSaveComponent = async () => {
        const token = localStorage.getItem("jwt");

        const formToSend = new FormData();

        const requestData = {
            name: componentName,
            fer: fer,
            ferStatus: ferStatus,
            deprecatedInventoryMarks: deprecatedMarks
                ? deprecatedMarks.split("; ").map(b => b.trim())
                : [],
            zpf: internalCode + optionalNumbers,
            quantity: Number(quantity),
            locationID: Number(location),
            description: description,
            keywords: keywords
                ? keywords
                    .split(";")
                    .map(k => k.trim())
                    .filter(k => k !== "")
                : [],
            experimentIds: selectedExperiments.map(e => e.id),
        };


        formToSend.append(
            "data",
            new Blob([JSON.stringify(requestData)], { type: "application/json" })
        );

        if (profileImage) {
            formToSend.append("profileImage", profileImage);
        }

        otherImages.forEach((file) => {
            formToSend.append("otherImages", file);
        });

        documents.forEach((file) => {
            formToSend.append("files", file);
        });

        try {
            const response = await fetch("/vatroslav/api/component/add", {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                },
                body: formToSend,
            });

            if (response.ok) {
                alert("Nova komponenta je dodana");
                navigate("/components");
            } else {
                const errorMessage = await response.text();
                alert(`Greška: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Error saving component:", error);
            alert("Došlo je do greške prilikom slanja podataka.");
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
                <CardTitle className="text-4xl font-bold mb-4">Naziv komponente</CardTitle>
                <div className="w-full flex flex-col space-y-1.5">
                    <Input
                        id="nazivkomponente"
                        placeholder="Unesite naziv komponente"
                        value={componentName}
                        onChange={(e) => setComponentName(e.target.value)}
                    />
                </div>
            </CardHeader>

            <CardContent className="w-full p-2 lg:p-6">
                <form className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6 w-full">
                    <div className="flex flex-col space-y-6">
                        <Card className="w-full flex flex-col space-y-1.5">
                            <CardTitle><CardHeader>ZPF Inventarna oznaka</CardHeader></CardTitle>
                            <Input
                                id="intozn-letters"
                                placeholder="Unesite 5 velikih slova (obavezno)"
                                value={internalCode}
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
                                    setInternalCode(value);
                                    if (value.length === 5 && /^[A-Z]{5}$/.test(value)) {
                                        setValidationMessage("Ispravno (slova)");
                                    } else {
                                        setValidationMessage("Neispravno: Točno 5 velikih slova!");
                                    }
                                }}
                            />
                            <Input
                                id="intozn-numbers"
                                placeholder="Unesite 2 broja (opcionalno)"
                                value={optionalNumbers}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                                    setOptionalNumbers(value);
                                }}
                            />
                            {validationMessage && (
                                <p className={`text-sm ${validationMessage === "Ispravno (slova)" ? "text-green-600" : "text-red-600"}`}>
                                    {validationMessage}
                                </p>
                            )}
                        </Card>

                        <Card className="w-full flex flex-col space-y-1.5">
                            <CardHeader><CardTitle>FER Inventarska oznaka</CardTitle></CardHeader>
                            <Input
                                placeholder="Unesite FER"
                                value={fer}
                                onChange={(e) => setFer(e.target.value)}
                            />
                        </Card>

                        <Card className="w-full flex flex-col space-y-1.5">
                           <CardTitle><CardHeader>Status FER inventarne oznake</CardHeader></CardTitle>
                            <Select value={ferStatus} onValueChange={setFerStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Odaberi status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CATALOGED">Cataloged</SelectItem>
                                    <SelectItem value="UNCATALOGED">Uncataloged</SelectItem>
                                    <SelectItem value="UNKNOWN">Unknown</SelectItem>
                                </SelectContent>
                            </Select>
                        </Card>

                        <Card className="w-full flex flex-col space-y-1.5">
                           <CardHeader><CardTitle>Zastarjele inventarne oznake</CardTitle></CardHeader>
                            <Textarea
                                placeholder="Unesite zastarjele oznake (ako postoje)"
                                value={deprecatedMarks}
                                onChange={(e) => setDeprecatedMarks(e.target.value)}
                            />
                        </Card>

                    </div>

                    <div className="flex flex-col space-y-6">
                        <Card className="w-full flex flex-col space-y-1.5">
                            <CardHeader><CardTitle>Eksperimenti</CardTitle></CardHeader>
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

                        <Card className="w-full flex flex-col space-y-1.5">
                           <CardHeader><CardTitle>Gdje se nalazi</CardTitle></CardHeader>
                            <Input
                                placeholder="Pretraži lokacije..."
                                value={locationSearchQuery}
                                onChange={(e) => setLocationSearchQuery(e.target.value)}
                            />
                            {location && (
                                <p className="text-sm text-green-600">
                                    Odabrano: {
                                    locations.find(loc => loc.id === parseInt(location))?.address
                                } - {
                                    locations.find(loc => loc.id === parseInt(location))?.room
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
                                                        setLocation(loc.id.toString());
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

                        <Card className="flex flex-col space-y-6">
                            <CardHeader><CardTitle>Datoteke:</CardTitle></CardHeader>
                        <div className="w-full max-w-4xl flex flex-col space-y-1.5">
                            <CardTitle>Profilna slika</CardTitle>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProfileImage(e.target.files[0])}
                            />
                        </div>

                        <div className="w-full max-w-4xl flex flex-col space-y-1.5">
                            <CardTitle>Ostale slike</CardTitle>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setOtherImages(Array.from(e.target.files))}
                            />
                        </div>

                        <div className="w-full max-w-4xl flex flex-col space-y-1.5">
                            <CardTitle>Dokumentacija</CardTitle>
                            <input
                                type="file"
                                multiple
                                onChange={(e) => setDocuments(Array.from(e.target.files))}
                            />
                        </div>
                        </Card>
                    </div>

                    <div className="flex flex-col space-y-6">
                        <Card className="w-full flex flex-col space-y-1.5">
                            <CardHeader><CardTitle>Količina</CardTitle></CardHeader>
                            <Input
                                id="kolicina"
                                placeholder="Unesite količinu"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </Card>

                        <Card className="w-full flex flex-col space-y-1.5">
                            <CardHeader><CardTitle>Kratak opis</CardTitle></CardHeader>
                            <Textarea
                                id="opis"
                                placeholder="Unesite kratak opis"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Card>

                        <Card className="w-full flex flex-col space-y-1.5">
                            <CardHeader><CardTitle>Ključne riječi</CardTitle></CardHeader>
                            <Textarea
                                id="keywords"
                                placeholder="Unesite ključne riječi odvojene točkom-zarezom (;)"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                            />
                        </Card>

                    </div>
                </form>
            </CardContent>

            <div className="flex justify-center">
                <Button className="m-5 bg-pink-500 text-white" onClick={handleSaveComponent}>
                    Završi
                </Button>
            </div>
        </Card>

    );
}

export default ComponentAdd;