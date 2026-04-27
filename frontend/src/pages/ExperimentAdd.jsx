import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea.jsx";

function ExperimentAdd() {
    const [components, setComponents] = useState([]);
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [keywords, setKeywords] = useState("");
    const [validationMessage, setValidationMessage] = useState("");
    const [internalCode, setInternalCode] = useState("");
    const [optionalNumbers, setOptionalNumbers] = useState("");

    const [experimentName, setExperimentName] = useState();
    const [field, setField] = useState();
    const [description, setDescription] = useState();
    const [materials, setMaterials] = useState();
    const [subject, setSubject] = useState();
    const [otherImages, setOtherImages] = useState([]);
    const [documents, setDocuments] = useState([]);

    const [componentSearchQuery, setComponentSearchQuery] = useState();
    const [componentSearchResults, setComponentSearchResults] = useState([]);
    const [selectedComponents, setSelectedComponents] = useState([]);


    useEffect(() => {
        const fetchComponents = async () => {
            try {
                const token = localStorage.getItem("jwt");
                const response = await fetch("/vatroslav/api/component/getAll", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setComponents(data);
                } else {
                    console.error("Greška pri dohvaćanju komponenti:", response.statusText);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchComponents();
    }, []);

    const handleSubmit = async () => {
        const token = localStorage.getItem("jwt");

        const formToSend = new FormData();

        const requestData = {
            name: experimentName,
            zpf: internalCode,
            field: field,
            subject: subject,
            description: description,
            materials: materials,
            keywords: keywords
                ? keywords
                    .split(";")
                    .map(k => k.trim())
                    .filter(k => k !== "")
                : [],
            componentIds: selectedComponents.map(c => c.id),
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
            const response = await fetch("/vatroslav/api/experiment/add", {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                },
                body: formToSend,
            });

            if (response.ok) {
                const newExperimentId = await response.json();
                alert("Novi eksperiment dodan");
                navigate(`/experiment/view/${newExperimentId}`);
            } else {
                const text = await response.text();
                alert(`Greška: ${text}`);
            }

        } catch (error) {
            console.error(error);
            alert("Došlo je do greške.");
        }
    };

    return (
        <Card className="w-full p-2 lg:p-4">
            <CardHeader className="flex flex-col items-center p-3 lg:p-6">
                <CardTitle className="text-4xl font-bold mb-4">Naziv eksperimenta</CardTitle>
                <div className="w-full flex flex-col space-y-1.5">
                    <Input
                        id="nazivEksperimenta"
                        placeholder="Unesite naziv eksperimenta"
                        value={experimentName}
                        onChange={(e) => setExperimentName(e.target.value)}
                    />
                </div>
            </CardHeader>

            <CardContent className="w-full p-2 lg:p-6">

                <form className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6 w-full">

                    <div className="flex flex-col space-y-6">

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>ZPF Inventarna oznaka</CardTitle>
                            <Input
                                id="intozn-letters"
                                placeholder="Unesite 5 velikih slova (obavezno)"
                                value={internalCode}
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
                                    setInternalCode(value);
                                    if (value.length === 5 && /^[A-Z]{5}$/.test(value)) {
                                        setValidationMessage("Ispravno");
                                    } else {
                                        setValidationMessage("Neispravno: Točno 5 velikih slova!");
                                    }
                                }}
                            />
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
                                placeholder="Pretraži komponente"
                                value={componentSearchQuery}
                                onChange={(e) => {
                                    const query = e.target.value.toLowerCase();
                                    setComponentSearchQuery(query);
                                    if (!query) {
                                        setComponentSearchResults([]);
                                        return;
                                    }
                                    const filtered = components.filter((comp) =>
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

                        <Card className="flex flex-col space-y-6">
                            <CardTitle>Datoteke:</CardTitle>
                            <div className="w-full flex flex-col space-y-1.5">
                                <CardTitle>Profilna slika</CardTitle>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setProfileImage(e.target.files[0])}
                                />
                            </div>

                            <div className="w-full flex flex-col space-y-1.5">
                                <CardTitle>Ostale slike</CardTitle>
                                <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setOtherImages(Array.from(e.target.files))}
                                />
                            </div>

                            <div className="w-full flex flex-col space-y-1.5">
                                <CardTitle>Dokumentacija</CardTitle>
                                <Input
                                    type="file"
                                    multiple
                                    onChange={(e) => setDocuments(Array.from(e.target.files))}
                                />
                            </div>
                        </Card>

                    </div>

                    <div className="flex flex-col space-y-6">
                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Kratak opis</CardTitle>
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
                                placeholder="Unesite ključne riječi odvojene točkom-zarezom (;). Npr. Uređaj; Laptop;"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                            />
                        </Card>

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Pribor i potrošni materijal</CardTitle>
                            <Textarea
                                id="opis"
                                placeholder="Unesite pribor i potrošni materijal"
                                value={materials}
                                onChange={(e) => setMaterials(e.target.value)}
                            />
                        </Card>
                    </div>

                </form>
            </CardContent>

            <div className="flex justify-center">
                <Button className="m-5 bg-pink-500 text-white" onClick={handleSubmit}>
                    Završi
                </Button>
            </div>
        </Card>
    );
}

export default ExperimentAdd;