import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Link, useNavigate} from "react-router-dom";
import React, {useState, useEffect, useRef} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {ScrollArea} from "@/components/ui/scroll-area.jsx";

const DEBOUNCE_DELAY = 300;


function ComponentAdd() {
    const [componentName, setComponentName] = useState();
    const [internalCode, setInternalCode] = useState();
    const [location, setLocation] = useState();
    const [experiments, setExperiments] = useState([]);
    const [experimentSearchQuery, setExperimentSearchQuery] = useState("");
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
    const [optionalNumbers, setOptionalNumbers] = useState("");

    const [isSearching, setIsSearching] = useState(false);
    const searchDebounceTimer = useRef(null);


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

    useEffect(() => {
        if (searchDebounceTimer.current) {
            clearTimeout(searchDebounceTimer.current);
        }

        if (!experimentSearchQuery.trim()) {
            setExperimentSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        searchDebounceTimer.current = setTimeout(() => {
            const query = experimentSearchQuery.toLowerCase();
            const filtered = experiments
                .filter((comp) =>
                    comp.name.toLowerCase().includes(query) ||
                    comp.zpf?.toLowerCase().includes(query) ||
                    comp.description?.toLowerCase().includes(query)
                )

            setExperimentSearchResults(filtered);
            setIsSearching(false);

        }, DEBOUNCE_DELAY);

        return () => {
            if (searchDebounceTimer.current) {
                clearTimeout(searchDebounceTimer.current);
            }
        };
    }, [experimentSearchQuery, experiments]);

    const handleSaveComponent = async () => {
        const token = localStorage.getItem("jwt");

        const formToSend = new FormData();

        const requestData = {
            name: componentName,
            fer: fer,
            ferStatus: ferStatus,
            deprecatedInventoryMarks: deprecatedMarks
                ? deprecatedMarks
                    .split(";")
                    .map(k => k.trim())
                    .filter(k => k !== "")
                : [],
            zpf: internalCode + " " + optionalNumbers,
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
            new Blob([JSON.stringify(requestData)], {type: "application/json"})
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
                const newComponentId = await response.json();
                alert("Nova komponenta je dodana");
                navigate(`/component/view/${newComponentId}`);
            } else {
                try {
                    const errorData = await response.json();
                    const errorMsg = errorData.message || "Došlo je do greške";
                    const errorDetails = errorData.details ? ` - ${errorData.details}` : "";
                    alert(`Greška: ${errorMsg}${errorDetails}`);
                } catch (jsonErr) {
                    const errorMessage = await response.text();
                    alert(`Greška: ${errorMessage}`);
                }
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

            if (response.ok) {
                const data = await response.json();
                alert("Nova lokacija je dodana");
                setLocations([...locations, data]);
                setNewLocationAddress("");
                setNewLocationRoom("");
                setShowAddLocation(false);
            } else {
                try {
                    const errorData = await response.json();
                    const errorMsg = errorData.message || "Greška pri dodavanju lokacije";
                    const errorDetails = errorData.details ? ` - ${errorData.details}` : "";
                    alert(`Greška: ${errorMsg}${errorDetails}`);
                } catch (jsonErr) {
                    const errorMessage = await response.text();
                    alert(`Greška: ${errorMessage}`);
                }
            }
        } catch (error) {
            console.error("Error adding location:", error);
            alert("Došlo je do greške prilikom dodavanja lokacije: " + error.message);
        }
    };

    return (
        <Card className="w-full p-2 lg:p-4">
            <CardHeader className="flex flex-col items-center p-3 lg:p-6">
                <CardTitle className="text-4xl font-bold mb-4">Unos nove komponente</CardTitle>
                <br/>
                <br/>
                <br/>

                <Card className="w-full flex flex-col space-y-2.5 p-2">
                    <CardTitle>Naziv komponente</CardTitle>
                    <Input
                        id="nazivkomponente"
                        placeholder="Unesite naziv komponente"
                        value={componentName}
                        onChange={(e) => setComponentName(e.target.value)}
                    />
                </Card>

            </CardHeader>


            <CardContent className="w-full p-2 lg:p-6">
                <form className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6 w-full">
                    <div className="flex flex-col space-y-6">
                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>ZPF inventarna oznaka</CardTitle>
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

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>FER inventarna oznaka</CardTitle>
                            <Input
                                placeholder="Unesite FER inventarnu oznaku"
                                value={fer}
                                onChange={(e) => setFer(e.target.value)}
                            />
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Status FER inventarne oznake</CardTitle>
                            <Select value={ferStatus} onValueChange={setFerStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Odaberite status FER inventarne oznake"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CATALOGED">Na inventaru</SelectItem>
                                    <SelectItem value="NOT_CATALOGED">Nije na inventaru</SelectItem>
                                    <SelectItem value="UNCATALOGED">Deinvetarizirano (Nekad bilo u
                                        inventaru)</SelectItem>
                                    <SelectItem value="UNKNOWN">Nepoznato</SelectItem>
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
                                placeholder="Pretražite eksperimente po imenu, ZPF oznaci ili opisu"

                                value={experimentSearchQuery}
                                onChange={(e) => {
                                    setExperimentSearchQuery(e.target.value);
                                }}
                            />

                            {experimentSearchResults.length === 0 ? (
                                    <p className="text-xs text-gray-500 italic">Nema pretraženih eksperimenata</p>
                                ) :
                                <ScrollArea className="h-64 border rounded p-2">
                                    {experimentSearchResults.map((exp) => (
                                        <div key={exp.id}
                                             className="w-full flex flex-col space-y-1.5 mb-3 pb-2 border-b last:border-b-0">
                                            <Link
                                                to={`/experiment/view/${exp.id}`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                {exp.name}
                                            </Link>
                                            {exp.zpf && <span className="text-xs text-gray-600">ZPF: {exp.zpf}</span>}
                                            {exp.description && <span
                                                className="text-xs text-gray-600 line-clamp-2">{exp.description}</span>}
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    console.log(`[DEBUG] Dodaj button clicked for experiment:`, exp);
                                                    if (!selectedExperiments.some(e => e.id === exp.id)) {
                                                        console.log(`[DEBUG] Adding component to selectedExperiments:`, exp.id, exp.name);
                                                        setSelectedExperiments([...selectedExperiments, exp]);
                                                    } else {
                                                        console.log(`[DEBUG] Experiment already selected:`, exp.id);
                                                        alert("Eksperiment je već odabran");
                                                    }
                                                }}
                                                className="bg-blue-500 text-white hover:bg-blue-600 text-xs py-1"
                                            >
                                                Dodaj
                                            </Button>
                                        </div>
                                    ))}
                                </ScrollArea>
                            }

                            {isSearching && (
                                <div className="text-sm text-gray-500 italic">
                                    Pretraga u tijeku...
                                </div>
                            )}

                            {experimentSearchQuery && experimentSearchResults.length === 0 && !isSearching && (
                                <div className="text-sm text-gray-500">
                                    Nema pronađenih eksperimenata
                                </div>
                            )}

                            {experimentSearchResults.length > 0 && (
                                <div className="text-xs text-gray-600 mb-2">
                                    Pronađeno {experimentSearchResults.length} rezultata
                                </div>
                            )}

                            <br/>
                            <hr></hr>
                            <br/>


                            <div className="mt-2">
                                <h4 className="text-sm font-medium">Odabrani eksperimenti
                                    ({selectedExperiments.length}):</h4>
                                {selectedExperiments.length === 0 ? (
                                    <p className="text-xs text-gray-500 italic">Nema odabranih eksperimenata</p>
                                ) : (
                                    <ScrollArea className="h-40 border rounded p-2">
                                        {selectedExperiments.map((exp, index) => (
                                            <div key={exp.id}
                                                 className="flex justify-between items-center border-b py-2 px-1 last:border-b-0">
                                                <div className="flex-1">
                                                    <span className="text-sm">
                                                        <Link
                                                            to={`/experiment/view/${exp.id}`}
                                                            className="text-blue-500 hover:underline"
                                                        >
                                            {exp.name}
                                        </Link>
                                                    </span>
                                                    {exp.zpf && <span
                                                        className="text-xs text-gray-600 block">ZPF: {exp.zpf}</span>}
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        console.log(`[DEBUG] Removing component:`, exp.id);
                                                        setSelectedExperiments(selectedExperiments.filter((_, i) => i !== index))
                                                    }}
                                                    className="bg-red-500 text-white hover:bg-red-600 text-xs py-1 ml-2"
                                                >
                                                    Ukloni
                                                </Button>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                )}
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
                                <div className="w-full flex flex-col space-y-1.5">
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

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Datoteke</CardTitle>
                            <Card className="w-full flex flex-col space-y-2.5 p-2">
                                <CardTitle>Profilna fotografija</CardTitle>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setProfileImage(e.target.files[0])}
                                />
                            </Card>
                            <br/>
                            <br/>
                            <Card className="w-full flex flex-col space-y-2.5 p-2">
                                <CardTitle>Ostale fotografije</CardTitle>
                                <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setOtherImages(Array.from(e.target.files))}
                                />
                            </Card>
                            <br/>
                            <br/>
                            <Card className="w-full flex flex-col space-y-2.5 p-2">
                                <CardTitle>Dokumentacija</CardTitle>
                                <Input
                                    type="file"
                                    multiple
                                    onChange={(e) => setDocuments(Array.from(e.target.files))}
                                />
                            </Card>
                        </Card>
                    </div>

                    <div className="flex flex-col space-y-6">
                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Opis</CardTitle>
                            <Textarea
                                id="opis"
                                placeholder="Unesite kratak opis"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Ključne riječi</CardTitle>
                            <Textarea
                                id="keywords"
                                placeholder="Unesite ključne riječi odvojene točkom-zarezom (;). Npr. Uređaj; Laptop"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                            />
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Količina</CardTitle>
                            <Input
                                id="kolicina"
                                placeholder="Unesite količinu"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
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