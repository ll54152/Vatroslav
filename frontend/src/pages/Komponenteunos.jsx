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
import {Label} from "@/components/ui/label";

function Komponenteunos() {
    const [componentName, setComponentName] = useState("");
    const [internalCode, setInternalCode] = useState("");
    const [location, setLocation] = useState("");
    //const [experiment, setExperiment] = useState("");  // Novo stanje za eksperiment
    //const [experiments, setExperiments] = useState([]);  // Stanje za eksperimente
    const [experiments, setExperiments] = useState([]); // svi dohvaćeni eksperimenti
    const [experimentSearchQuery, setExperimentSearchQuery] = useState("");
    const [experimentSearchResults, setExperimentSearchResults] = useState([]);
    const [selectedExperiments, setSelectedExperiments] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState("active");
    const [locations, setLocations] = useState([]);
    const [newLocationAddress, setNewLocationAddress] = useState("");
    const [newLocationRoom, setNewLocationRoom] = useState("");
    const [showAddLocation, setShowAddLocation] = useState(false);
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

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

        const fetchExperiments = async () => {  // Nova funkcija za dohvat eksperimenata
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

        fetchLocations();
        fetchExperiments();  // Pozivamo funkciju za eksperimente
    }, []);

    const handleSaveComponent = async () => {
        const token = localStorage.getItem("jwt");

        const formToSend = new FormData();
        formToSend.append("name", componentName);
        formToSend.append("zpf", internalCode);
        formToSend.append("locationID", location);
        formToSend.append("quantity", quantity);
        formToSend.append("description", description);
        formToSend.append("log", notes);
        formToSend.append("fer", status);
        formToSend.append("eksperimentIDs", JSON.stringify(selectedExperiments.map(e => e.id)));

        files.forEach((file) => {
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
                navigate("/komponente");
            } else {
                const errorMessage = await response.text();
                alert(`Greška: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Error saving component:", error);
            alert("Došlo je do greške prilikom slanja podataka.");
        }
    };


    const handleAddLocation = async () => {
        event.preventDefault();
        const newLocation = {
            adress: newLocationAddress,
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

            // Log the response body before parsing it as JSON
            const textResponse = await response.text();
            console.log("Response text:", textResponse);

            // Check if the response is valid JSON
            let data;
            try {
                data = JSON.parse(textResponse);
                console.log("Parsed response data:", data);
            } catch (jsonError) {
                console.error("Failed to parse response as JSON:", jsonError);
            }

            if (response.ok) {
                alert("Nova lokacija je dodana");
                setLocations([...locations, newLocation]);
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
        <Card
            className="w-[75vw] h-[160vh]"
            style={{
                backgroundImage: 'url("/images/background1.jpg")',
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }}
        >
            <CardHeader className="flex flex-col items-center">
                <CardTitle className="text-4xl font-bold mb-4">Naziv komponente</CardTitle>
                <div className="w-full max-w-[600px]">
                    <Input
                        id="nazivkomponente"
                        placeholder="Unesite naziv komponente"
                        value={componentName}
                        onChange={(e) => setComponentName(e.target.value)}
                    />
                </div>
            </CardHeader>

            <CardContent>
                <form className="flex flex-col items-center gap-4">
                    {/* Common input block style */}
                    <div className="w-full max-w-[600px] flex flex-col space-y-1.5">
                        <CardTitle>Interna oznaka (ZPF)</CardTitle>
                        <Input
                            id="intozn"
                            placeholder="Unesite internu oznaku"
                            value={internalCode}
                            onChange={(e) => setInternalCode(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col space-y-1.5">
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

                        {/* Rezultati pretrage */}
                        {experimentSearchResults.map((exp) => (
                            <div key={exp.id} className="flex justify-between items-center border-b py-1">
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

                        {/* Odabrani eksperimenti */}
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
                    </div>

                    <div className="w-full max-w-[600px] flex flex-col space-y-1.5">
                        <CardTitle>Gdje se nalazi</CardTitle>
                        <Select value={location} onValueChange={(value) => setLocation(value)}>
                            <SelectTrigger id="location">
                                <SelectValue placeholder="Odaberite lokaciju">
                                    {location ? locations.find(loc => loc.id === parseInt(location))?.adress : "Odaberite lokaciju"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent position="popper">
                                {locations.map((loc) => (
                                    loc && loc.id ? (
                                        <SelectItem key={loc.id} value={loc.id.toString()}>
                                            {loc.adress} - {loc.room}
                                        </SelectItem>
                                    ) : null
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                            <input
                                id="addLocationCheckbox"
                                type="checkbox"
                                checked={showAddLocation}
                                onChange={(e) => setShowAddLocation(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="addLocationCheckbox">Dodaj novu lokaciju</label>
                        </div>
                    </div>

                    {showAddLocation && (
                        <div className="w-full max-w-[600px] flex flex-col space-y-1.5">
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

                    <div className="w-full max-w-[600px] flex flex-col space-y-1.5">
                        <CardTitle>Količina</CardTitle>
                        <Input
                            id="kolicina"
                            placeholder="Unesite količinu"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>

                    <div className="w-full max-w-[600px] flex flex-col space-y-1.5">
                        <CardTitle>Kratak opis</CardTitle>
                        <Input
                            id="opis"
                            placeholder="Unesite kratak opis"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <CardTitle>Dokumentacija</CardTitle>
                        <input
                            type="file"
                            id="files"
                            multiple
                            onChange={(e) => setFiles(Array.from(e.target.files))}
                        />
                    </div>

                    <div className="w-full max-w-[600px] flex flex-col space-y-1.5">
                        <CardTitle>Status</CardTitle>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger id="framework">
                                <SelectValue placeholder="Status"/>
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="unknown">Unknown</SelectItem>
                            </SelectContent>
                        </Select>
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

export default Komponenteunos;