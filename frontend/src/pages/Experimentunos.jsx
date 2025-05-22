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

    useEffect(() => {
        // Dohvaćanje svih komponenti iz backend-a
        const fetchComponents = async () => {
            try {
                const token = localStorage.getItem("jwt");
                const response = await fetch("/inventar/api/component/getAll", {
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
        formToSend.append("name", formData.name);
        formToSend.append("field", formData.field);
        formToSend.append("subject", formData.subject);
        formToSend.append("description", formData.description);
        formToSend.append("materials", formData.materials);
        formToSend.append("komponente", JSON.stringify(komponente));

        files.forEach((file) => {
            formToSend.append("files", file);
        });

        try {
            const response = await fetch("/inventar/api/experiment/add", {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                },
                body: formToSend,
            });

            if (response.ok) {
                navigate("/experiments");
            } else {
                const text = await response.text();
                console.error("Greška:", text);
                alert("Greška pri slanju eksperimenta.");
            }
        } catch (error) {
            console.error("Greška:", error);
            alert("Došlo je do greške prilikom slanja.");
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
        event.preventDefault(); // Sprječavanje osvježavanja stranice
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
            className="w-[75vw] h-[160vh]"
            style={{
                backgroundImage: `url('/images/background1.jpg')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }}
        >
            <CardHeader>
                <CardTitle className="text-4xl font-bold grid w-full justify-center gap-4">
                    Naziv eksperimenta
                </CardTitle>
                <div className="flex flex-col space-y-1.5">
                    <Input
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
                        {/* Područje fizike */}
                        <div className="flex flex-col space-y-1.5">
                            <CardTitle>Područje fizike</CardTitle>
                            <Input
                                id="field"
                                placeholder="Unesite naziv područja fizike"
                                value={formData.field}
                                onChange={handleInputChange}
                            />
                        </div>
                        <br/>

                        <div className="flex flex-col space-y-1.5">
                            <CardTitle>Nastavni predmet</CardTitle>
                            <Input
                                id="subject"
                                placeholder="Unesite naziv predmeta"
                                value={formData.subject}
                                onChange={handleInputChange}
                            />
                        </div>
                        <br/>

                        <div className="flex flex-col space-y-1.5">
                            <CardTitle>Kratak opis</CardTitle>
                            <Input
                                id="description"
                                placeholder="Unesite kratak opis"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <br/>

                        <div className="flex flex-col space-y-1.5">
                            <CardTitle>Potrošni materijal</CardTitle>
                            <Input
                                id="materials"
                                placeholder="Unesite napomene"
                                value={formData.materials}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="files">Dodaj dokumentaciju (više datoteka):</label>
                            <input
                                type="file"
                                id="files"
                                multiple
                                onChange={(e) => setFiles(Array.from(e.target.files))}
                            />
                        </div>
                        <br/>

                        <Tabs defaultValue="komponente" className="w-100">
                            <TabsList className="grid w-full grid-cols-1">
                                <TabsTrigger value="komponente" onClick={toggleSearchVisibility}>
                                    Komponente
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="komponente">
                                {isSearchVisible && (
                                    <ScrollArea className="w-200 rounded-md border p-4">
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
                <CardFooter className="flex justify-between">
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