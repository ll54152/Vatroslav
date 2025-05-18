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
    const [experiment, setExperiment] = useState("");  // Novo stanje za eksperiment
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState("active");
    const [locations, setLocations] = useState([]);
    const [experiments, setExperiments] = useState([]);  // Stanje za eksperimente
    const [newLocationAddress, setNewLocationAddress] = useState("");
    const [newLocationRoom, setNewLocationRoom] = useState("");
    const [showAddLocation, setShowAddLocation] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch("http://localhost:8080/location/getAll");
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
                const response = await fetch("http://localhost:8080/experiment/getAll");
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
        const newComponent = {
            name: componentName,
            zpf: internalCode,
            locationID: location,
            quantity,
            description,
            log: notes,
            fer: status,
            eksperimentID: experiment,
        };

        try {
            const response = await fetch("http://localhost:8080/component/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newComponent),
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
            const response = await fetch("http://localhost:8080/location/add", {
                method: "POST",
                headers: {
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
            <CardHeader>
                <CardTitle className="text-4xl font-bold grid w-full justify-center gap-4">
                    Naziv komponente
                </CardTitle>
                <div className="flex flex-col space-y-1.5">
                    <Input
                        id="nazivkomponente"
                        placeholder="Unesite naziv komponente"
                        value={componentName}
                        onChange={(e) => setComponentName(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full justify-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <CardTitle>Interna oznaka (ZPF)</CardTitle>
                            <Input
                                id="intozn"
                                placeholder="Unesite internu oznaku"
                                value={internalCode}
                                onChange={(e) => setInternalCode(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <CardTitle>Odaberite eksperiment</CardTitle>
                            <Select value={experiment} onValueChange={setExperiment}>
                                <SelectTrigger id="experiment">
                                    <SelectValue placeholder="Odaberite eksperiment">
                                        {experiment ? experiments.find(exp => exp.id === parseInt(experiment))?.name : "Odaberite eksperiment"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {experiments.map((exp) => (
                                        <SelectItem key={exp.id} value={exp.id.toString()}>
                                            {exp.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <CardTitle>Gdje se nalazi</CardTitle>
                            <Select value={location} onValueChange={(value) => {
                                setLocation(value);
                                console.log("Selected location:", value);
                            }}>
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
                            <div className="flex flex-col space-y-1.5">
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
                                <Button
                                    className="m-5 bg-pink-500 text-white"
                                    onClick={handleAddLocation}
                                >
                                    Dodaj lokaciju
                                </Button>
                            </div>
                        )}

                        <div className="flex flex-col space-y-1.5">
                            <CardTitle>Količina</CardTitle>
                            <Input
                                id="kolicina"
                                placeholder="Unesite količinu"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <CardTitle>Kratak opis</CardTitle>
                            <Input
                                id="opis"
                                placeholder="Unesite kratak opis"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        

                        <div className="flex flex-col space-y-1.5">
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
                    </div>
                </form>
            </CardContent>
            <Button
                className="m-5 bg-pink-500 text-white"
                onClick={handleSaveComponent}
            >
                Završi
            </Button>
        </Card>
    );
}

export default Komponenteunos;
