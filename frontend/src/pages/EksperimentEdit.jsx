import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function EksperimentEdit() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [experiment, setExperiment] = useState(null);
    const [komponente, setKomponente] = useState([]);
    const [allComponents, setAllComponents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [logs, setLogs] = useState([]);
    const [files, setFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [deletedFileIds, setDeletedFileIds] = useState([]);


    const [formData, setFormData] = useState({
        name: "",
        field: "",
        subject: "",
        description: "",
        materials: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("jwt");

        const fetchExperiment = async () => {
            try {
                const response = await fetch(`http://localhost:8080/experiment/get/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setExperiment(data);
                    setFormData({
                        name: data.name || "",
                        field: data.field || "",
                        subject: data.subject || "",
                        description: data.description || "",
                        materials: data.materials || "",
                    });
                    setKomponente(data.komponente || []);
                    setLogs(data.logs || []);
                    setFiles(data.files || []);
                } else {
                    console.error("Greška pri dohvaćanju eksperimenta", await response.text());
                }
            } catch (error) {
                console.error("Greška u fetch pozivu:", error);
            }
        };

        const fetchComponents = async () => {
            const response = await fetch("http://localhost:8080/component/getAll", {
                headers: {
                    Authorization: `${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setAllComponents(data);
            }
        };

        fetchExperiment();
        fetchComponents();
    }, [id]);

    const handleInputChange = (e) => {
        const {id, value} = e.target;
        setFormData((prev) => ({...prev, [id]: value}));
    };

    const removeFile = (fileId) => {
        setDeletedFileIds((prev) => [...prev, fileId]);
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
    };


    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        if (!query) {
            setSearchResults([]);
            return;
        }
        const filtered = allComponents.filter((comp) =>
            comp.name.toLowerCase().includes(query)
        );
        setSearchResults(filtered);
    };

    const addComponent = (component, e) => {
        e.preventDefault();
        if (!komponente.some((k) => k.id === component.id)) {
            setKomponente([...komponente, component]);
        }
    };

    const removeComponent = (index) => {
        setKomponente((prev) => prev.filter((_, i) => i !== index));
    };

    const removeLog = (index) => {
        setLogs((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setNewFiles(selectedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwt");

        const data = new FormData();
        data.append("name", formData.name);
        data.append("field", formData.field);
        data.append("subject", formData.subject);
        data.append("description", formData.description);
        data.append("materials", formData.materials);
        data.append("komponente", JSON.stringify(komponente.map((k) => k.id)));
        data.append("logovi", JSON.stringify(logs.map((log) => log.id)));
        data.append("deletedFileIds", JSON.stringify(deletedFileIds));

        if (newFiles.length > 0) {
            newFiles.forEach((file) => {
                if (file instanceof File) {
                    data.append("files", file);
                }
            });
        } else {
            const empty = new Blob([], {type: "application/octet-stream"});
            data.append("files", empty, "");
        }

        const response = await fetch(`http://192.168.18.27:8080/experiment/update/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `${token}`,
            },
            body: data,
        });

        if (response.ok) {
            navigate("/experiments");
        } else {
            const text = await response.text();
            console.error("Greška:", text);
            alert("Greška pri ažuriranju eksperimenta.");
        }
    };


    if (!experiment) return <div>Učitavanje...</div>;

    return (
        <Card className="w-[75vw] mx-auto mt-10 p-6">
            <CardHeader>
                <CardTitle>Uredi eksperiment</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input id="name" placeholder="Naziv" value={formData.name} onChange={handleInputChange}/>
                    <Input id="field" placeholder="Područje fizike" value={formData.field}
                           onChange={handleInputChange}/>
                    <Input id="subject" placeholder="Nastavni predmet" value={formData.subject}
                           onChange={handleInputChange}/>
                    <Textarea id="description" placeholder="Opis" value={formData.description}
                              onChange={handleInputChange}/>
                    <Textarea id="materials" placeholder="Potrošni materijal" value={formData.materials}
                              onChange={handleInputChange}/>

                    {/* Komponente */}
                    <div>
                        <h3 className="font-semibold mb-2">Komponente</h3>
                        <Input placeholder="Pretraži komponente" value={searchQuery} onChange={handleSearchChange}/>
                        <ScrollArea className="h-40 mt-2 border rounded">
                            {searchResults.map((comp) => (
                                <div key={comp.id} className="flex justify-between p-2 border-b">
                                    <span>{comp.name}</span>
                                    <Button size="sm" onClick={(e) => addComponent(comp, e)}>Dodaj</Button>
                                </div>
                            ))}
                        </ScrollArea>
                        <div className="mt-4">
                            <h4 className="font-semibold">Odabrane komponente:</h4>
                            {komponente.map((comp, index) => (
                                <div key={index} className="flex justify-between p-2 border-b">
                                    <span>{comp.name}</span>
                                    <Button size="sm" variant="destructive"
                                            onClick={() => removeComponent(index)}>Ukloni</Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Logovi */}
                    <div className="mt-6">
                        <h3 className="text-xl font-bold">Logovi</h3>
                        {logs.length > 0 ? (
                            <ul className="mt-2 space-y-2">
                                {logs.map((log, index) => (
                                    <li key={log.id || index} className="border p-3 rounded-md">
                                        <p><strong>Bilješka:</strong> {log.note}</p>
                                        <p><strong>Korisnik:</strong> {log.user?.username || "Nepoznato"}</p>
                                        <p><strong>Vrijeme:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                                        <Button variant="destructive" size="sm"
                                                onClick={() => removeLog(index)}>Obriši</Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-600">Nema logova za ovaj eksperiment.</p>
                        )}
                    </div>

                    {/* Dokumentacija */}
                    <div className="mt-6">
                        <h3 className="text-xl font-bold">Dokumentacija</h3>
                        {files.length > 0 ? (
                            <ul className="mt-2 space-y-2">
                                {files.map((file) => (
                                    <li key={file.id}
                                        className="border p-3 rounded-md flex justify-between items-center">
                                        <span>{file.name}</span>
                                        <div className="flex gap-3">
                                            <a
                                                href={`data:application/octet-stream;base64,${file.fileByte}`}
                                                download={file.name}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Preuzmi
                                            </a>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => removeFile(file.id)}
                                            >
                                                Ukloni
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-600">Nema dokumentacije za ovaj eksperiment.</p>
                        )}


                        {/* Novi fajlovi za upload */}
                        <div className="mt-4">
                            <label htmlFor="fileUpload" className="font-semibold">Dodaj nove datoteke:</label>
                            <Input id="fileUpload" type="file" multiple onChange={handleFileChange}/>
                            {newFiles.length > 0 && (
                                <ul className="mt-2 list-disc ml-4 text-sm text-gray-700">
                                    {newFiles.map((file, idx) => (
                                        <li key={idx}>{file.name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="justify-end">
                <Button type="submit" onClick={handleSubmit}>Spremi promjene</Button>
            </CardFooter>
        </Card>
    );
}
