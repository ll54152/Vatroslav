import React, {useState, useEffect, useRef} from "react";
import {Link, useNavigate} from "react-router-dom";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";

const DEBOUNCE_DELAY = 300;

function ExperimentAdd() {
    const [components, setComponents] = useState([]);
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [keywords, setKeywords] = useState("");
    const [validationMessage, setValidationMessage] = useState("");
    const [internalCode, setInternalCode] = useState("");

    const [experimentName, setExperimentName] = useState();
    const [field, setField] = useState();
    const [description, setDescription] = useState();
    const [materials, setMaterials] = useState();
    const [isItPublic, setIsItPublic] = useState(false);
    const [subject, setSubject] = useState();
    const [otherImages, setOtherImages] = useState([]);
    const [documents, setDocuments] = useState([]);

    const [componentSearchQuery, setComponentSearchQuery] = useState("");
    const [componentSearchResults, setComponentSearchResults] = useState([]);
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchDebounceTimer = useRef(null);


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

    useEffect(() => {
        if (searchDebounceTimer.current) {
            clearTimeout(searchDebounceTimer.current);
        }

        if (!componentSearchQuery.trim()) {
            setComponentSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        searchDebounceTimer.current = setTimeout(() => {
            const query = componentSearchQuery.toLowerCase();
            const filtered = components
                .filter((comp) =>
                    comp.name.toLowerCase().includes(query) ||
                    comp.zpf?.toLowerCase().includes(query) ||
                    comp.description?.toLowerCase().includes(query)
                )

            setComponentSearchResults(filtered);
            setIsSearching(false);

        }, DEBOUNCE_DELAY);

        return () => {
            if (searchDebounceTimer.current) {
                clearTimeout(searchDebounceTimer.current);
            }
        };
    }, [componentSearchQuery, components]);

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
            isItPublic: isItPublic,
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
                alert("Novi eksperiment uspješno dodan");
                navigate(`/experiment/view/${newExperimentId}`);
            } else {
                try {
                    const errorData = await response.json();
                    const errorMsg = errorData.message || "Došlo je do greške";
                    const errorDetails = errorData.details ? ` - ${errorData.details}` : "";
                    alert(`Greška: ${errorMsg}${errorDetails}`);
                } catch (jsonErr) {
                    const text = await response.text();
                    alert(`Greška: ${text}`);
                }
            }

        } catch (error) {
            console.error(error);
            alert("Došlo je do greške pri slanju podataka: " + error.message);
        }
    };

    return (
        <Card className="w-full p-2 lg:p-4">
            <CardHeader className="flex flex-col items-center p-3 lg:p-6">
                <CardTitle className="text-4xl font-bold mb-4">Unos novog eksperimenta</CardTitle>
                <br/>
                <br/>
                <br/>

                <Card className="w-full flex flex-col space-y-2.5 p-2">
                    <CardTitle>Naziv eksperimenta</CardTitle>
                    <Input
                        id="nazivEksperimenta"
                        placeholder="Unesite naziv eksperimenta"
                        value={experimentName}
                        onChange={(e) => setExperimentName(e.target.value)}
                    />
                </Card>

            </CardHeader>

            <CardContent className="w-full p-2 lg:p-6">

                <form className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6 w-full">

                    <div className="flex flex-col space-y-6">

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>ZPF oznaka</CardTitle>
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
                                placeholder="Pretražite komponente po imenu, ZPF inventarnoj oznaci ili opisu"

                                value={componentSearchQuery}
                                onChange={(e) => {
                                    setComponentSearchQuery(e.target.value);
                                }}
                            />

                            {isSearching && (
                                <div className="text-sm text-gray-500 italic">
                                    Pretraga u tijeku...
                                </div>
                            )}

                            {componentSearchQuery && componentSearchResults.length === 0 && !isSearching && (
                                <div className="text-sm text-gray-500">
                                    Nema pronađenih komponenti
                                </div>
                            )}

                            {componentSearchResults.length > 0 && (
                                <div className="text-xs text-gray-600 mb-2">
                                    Pronađeno {componentSearchResults.length} rezultata
                                </div>
                            )}

                            <br/>
                            <hr></hr>
                            <br/>

                            {componentSearchResults.length === 0 ? (
                                    <p className="text-xs text-gray-500 italic">Nema pretraženih komponenti</p>
                                ) :
                                <ScrollArea className="h-64 border rounded p-2">
                                    {componentSearchResults.map((comp) => (
                                        <div key={comp.id}
                                             className="w-full flex flex-col space-y-1.5 mb-3 pb-2 border-b last:border-b-0">
                                            <Link
                                                to={`/component/view/${comp.id}`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                {comp.name}
                                            </Link>
                                            {comp.zpf && <span className="text-xs text-gray-600">ZPF: {comp.zpf}</span>}
                                            {comp.description && <span
                                                className="text-xs text-gray-600 line-clamp-2">{comp.description}</span>}
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    console.log(`[DEBUG] Dodaj button clicked for component:`, comp);
                                                    if (!selectedComponents.some(c => c.id === comp.id)) {
                                                        console.log(`[DEBUG] Adding component to selectedComponents:`, comp.id, comp.name);
                                                        setSelectedComponents(prev => [...prev, comp]);
                                                    } else {
                                                        console.log(`[DEBUG] Component already selected:`, comp.id);
                                                        alert("Komponenta je već odabrana");
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

                            <div className="mt-2">
                                <h4 className="text-sm font-medium">Odabrane komponente
                                    ({selectedComponents.length}):</h4>
                                {selectedComponents.length === 0 ? (
                                    <p className="text-xs text-gray-500 italic">Nema odabranih komponenti</p>
                                ) : (
                                    <ScrollArea className="h-40 border rounded p-2">
                                        {selectedComponents.map((comp, index) => (
                                            <div key={comp.id}
                                                 className="flex justify-between items-center border-b py-2 px-1 last:border-b-0">
                                                <div className="flex-1">
                                                    <span className="text-sm">
                                                        <Link
                                                            to={`/component/view/${comp.id}`}
                                                            className="text-blue-500 hover:underline"
                                                        >
                                            {comp.name}
                                        </Link>
                                                    </span>
                                                    {comp.zpf && <span
                                                        className="text-xs text-gray-600 block">ZPF: {comp.zpf}</span>}
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        console.log(`[DEBUG] Removing component:`, comp.id);
                                                        setSelectedComponents(selectedComponents.filter((_, i) => i !== index));
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

                        <Card className="w-full flex flex-col space-y-2.5 p-2">
                            <CardTitle>Vidljivost</CardTitle>
                            <Select
                                value={String(isItPublic)}
                                onValueChange={(value) => setIsItPublic(value === "true")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Odaberite vidljivost eksperimenta"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">
                                        Javno (Eksperiment vidljiv ne prijavljenim korisnicima)
                                    </SelectItem>
                                    <SelectItem value="false">
                                        Privatno
                                    </SelectItem>
                                </SelectContent>
                            </Select>
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