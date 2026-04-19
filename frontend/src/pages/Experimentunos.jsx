import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";

function Experimentunos() {
    const [komponente, setKomponente] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [allComponents, setAllComponents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [files, setFiles] = useState([]);
    const [isSearchVisible, setIsSearchVisible] = useState(false); // Kontrolira prikaz pretrage
    const [formData, setFormData] = useState({
        name: "",
        field: "",
        subject: "",
        description: "",
        materials: "",
        log: "",
    });
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [keywords, setKeywords] = useState("");
    const [validationMessage, setValidationMessage] = useState("");
    const [otherFiles, setOtherFiles] = useState([]);
    const [internalCode, setInternalCode] = useState("");
    const [optionalNumbers, setOptionalNumbers] = useState("");
    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfileImage(file);
        } else {
            alert('Please select a valid image file.');
        }
    };

    const handleOtherFilesChange = (e) => {
        setOtherFiles(Array.from(e.target.files));
    };


    useEffect(() => {
        // Dohvaćanje svih komponenti iz backend-a
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
                    setAllComponents(data);
                } else {
                    console.error("Greška pri dohvaćanju komponenti:", response.statusText);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchComponents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("jwt");

        const formToSend = new FormData();

        const requestData = {
            name: formData.name,
            zpf: internalCode + optionalNumbers,
            field: formData.field,
            subject: formData.subject,
            description: formData.description,
            materials: formData.materials,
            keywords: formData.keywords
                ? formData.keywords.split(";").map(k => k.trim())
                : [],
            componentIds: komponente.map(c => c.id),
        };

        formToSend.append(
            "data",
            new Blob([JSON.stringify(requestData)], {type: "application/json"})
        );

        files.forEach(file => formToSend.append("files", file));

        if (profileImage) {
            formToSend.append("profileImage", profileImage);
        }

        try {
            const response = await fetch("/vatroslav/api/experiment/add", {
                method: "POST",
                headers: {
                    Authorization: token,
                },
                body: formToSend,
            });

            if (response.ok) {
                navigate("/experimenti/");
            } else {
                const text = await response.text();
                alert(`Greška: ${text}`);
            }

        } catch (error) {
            console.error(error);
            alert("Došlo je do greške.");
        }
    };


    const handleInputChange = (e) => {
        const {id, value} = e.target;
        setFormData((prev) => ({...prev, [id]: value}));
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (!query) {
            setSearchResults([]);
            return;
        }

        const filteredComponents = allComponents.filter((component) =>
            component.name.toLowerCase().includes(query)
        );
        setSearchResults(filteredComponents);
    };

    const addComponent = (component, event) => {
        event.preventDefault();
        if (!komponente.some((komp) => komp.id === component.id)) {
            setKomponente([...komponente, component]);
        }
    };

    const removeComponent = (index) => {
        const updatedKomponente = komponente.filter((_, i) => i !== index);
        setKomponente(updatedKomponente);
    };

    const toggleSearchVisibility = () => {
        setIsSearchVisible((prev) => !prev);
    };

    return (
        <Card

        >
            <CardHeader>
                <CardTitle className="text-4xl font-bold grid w-full justify-center gap-4">
                    Naziv eksperimenta
                </CardTitle>
                <div className="flex flex-col items-center space-y-1.5 w-full">
                    <Input
                        className="w-[40vw]"
                        id="name"
                        placeholder="Unesite naziv eksperimenta"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>
                <br/>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full justify-center gap-4">
                        {[
                            {
                                id: "subject",
                                label: "Nastavni predmet",
                                placeholder: "Unesite naziv predmeta",
                                value: formData.subject
                            },
                            {
                                id: "field",
                                label: "Područje fizike",
                                placeholder: "Unesite naziv područja fizike",
                                value: formData.field
                            },
                            {
                                id: "description",
                                label: "Kratak opis",
                                placeholder: "Unesite kratak opis",
                                value: formData.description
                            },
                            {
                                id: "materials",
                                label: "Pribor i potrošni materijal",
                                placeholder: "Unesite pribor i potrošni materijal",
                                value: formData.materials
                            },
                            {
                                id: "keywords",
                                label: "Ključne riječi",
                                placeholder: "Unesite ključne riječi odvojene točka-zarezom (;)",
                                value: formData.keywords
                            },
                        ].map(({id, label, placeholder, value}) => (
                            <div key={id} className="flex flex-col items-center space-y-1.5 w-full">
                                <CardTitle>{label}</CardTitle>
                                <Input
                                    className="w-[40vw]"
                                    id={id}
                                    placeholder={placeholder}
                                    value={value}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}

                        <div className="flex flex-col items-center w-full">
                            <label htmlFor="profileImage" className="font-semibold">Profilna slika:</label>
                            <Input
                                id="profileImage"
                                type="file"
                                accept="image/*"  // Restricts to images
                                onChange={handleProfileImageChange}
                            />
                            {profileImage && (
                                <p className="text-sm text-gray-600">Selected: {profileImage.name}</p>
                            )}
                        </div>

                        {/* Other Files Picker */}
                        <div className="flex flex-col items-center w-full">
                            <label htmlFor="otherFiles" className="font-semibold">Ostale datoteke:</label>
                            <Input
                                id="otherFiles"
                                type="file"
                                multiple
                                onChange={handleOtherFilesChange}
                            />
                            {otherFiles.length > 0 && (
                                <ul className="text-sm text-gray-600">
                                    {otherFiles.map((file, idx) => (
                                        <li key={idx}>{file.name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="w-full max-w-4xl flex flex-col space-y-1.5">
                            <CardTitle>Interna oznaka (ZPF)</CardTitle>
                            <Input
                                id="intozn-letters"
                                placeholder="Unesite 5 velikih slova (obavezno)"
                                value={internalCode}
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
                                    setInternalCode(value);
                                    // Live validation for letters
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
                                    if (value.length === 0 || (value.length === 2 && /^[0-9]{2}$/.test(value))) {
                                    } else {
                                    }
                                }}
                            />
                            {validationMessage && (
                                <p className={`text-sm ${validationMessage === "Ispravno (slova)" ? "text-green-600" : "text-red-600"}`}>
                                    {validationMessage}
                                </p>
                            )}
                        </div>


                        <Tabs defaultValue="komponente" className="w-[40vw] mx-auto">
                            <TabsList className="grid w-full grid-cols-1">
                                <TabsTrigger value="komponente" onClick={toggleSearchVisibility}>
                                    Komponente
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="komponente">
                                {isSearchVisible && (
                                    <ScrollArea className="w-full rounded-md border p-4">
                                        <div className="mb-4">
                                            <Input
                                                placeholder="Pretraži komponente"
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium leading-none">Rezultati pretrage</h4>
                                            {searchResults.map((component) => (
                                                <div
                                                    key={component.id}
                                                    className="flex items-center justify-between border-b py-2"
                                                >
                                                    <span>{component.name}</span>
                                                    <Button
                                                        onClick={(e) => addComponent(component, e)}
                                                        className="bg-blue-500 text-white hover:bg-blue-600"
                                                    >
                                                        Dodaj
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="text-sm font-medium leading-none">Odabrane komponente</h4>
                                            {komponente.map((komponenta, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between border-b py-2"
                                                >
                                                    <span>{komponenta.name}</span>
                                                    <Button
                                                        onClick={() => removeComponent(index)}
                                                        className="bg-red-500 text-white hover:bg-red-600"
                                                    >
                                                        Ukloni
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </form>
                <CardFooter className="flex justify-center">
                    <Button
                        type="button"
                        className="m-5 bg-pink-500 text-white"
                        onClick={handleSubmit}
                    >
                        Završi
                    </Button>
                </CardFooter>
            </CardContent>
        </Card>

    );
}

export default Experimentunos;