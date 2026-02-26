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
            const response = await fetch("/vatroslav/api/experiment/add", {
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
        <div className="flex flex-col items-center space-y-1.5 w-full">
            <Input
                className="w-[40vw]"
                id="name"
                placeholder="Unesite naziv eksperimenta"
                value={formData.name}
                onChange={handleInputChange}
            />
        </div>
        <br />
    </CardHeader>
    <CardContent>
        <form>
            <div className="grid w-full justify-center gap-4">
                {[
                    { id: "field", label: "Područje fizike", placeholder: "Unesite naziv područja fizike", value: formData.field },
                    { id: "subject", label: "Nastavni predmet", placeholder: "Unesite naziv predmeta", value: formData.subject },
                    { id: "description", label: "Kratak opis", placeholder: "Unesite kratak opis", value: formData.description },
                    { id: "materials", label: "Potrošni materijal", placeholder: "Unesite napomene", value: formData.materials },
                ].map(({ id, label, placeholder, value }) => (
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
                    <label htmlFor="files">Dodaj dokumentaciju (više datoteka):</label>
                    <input
                        className="w-[40vw]"
                        type="file"
                        id="files"
                        multiple
                        onChange={(e) => setFiles(Array.from(e.target.files))}
                    />
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