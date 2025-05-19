import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

function Experimentiprimjer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [eksperiment, setEksperiment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newLog, setNewLog] = useState("");

    const isTokenValid = () => {
        const token = localStorage.getItem("jwt");
        if (!token) return false;
        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            const currentTime = Date.now() / 1000;
            return decoded.exp > currentTime;
        } catch (error) {
            return false;
        }
    };

    const verifyToken = async () => {
        const token = localStorage.getItem("jwt");
        if (!token) return false;
        try {
            const response = await fetch("http://localhost:8080/auth/verify", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    useEffect(() => {
        const fetchEksperiment = async () => {
            const isValid = isTokenValid();
            const isVerified = await verifyToken();
            if (!isValid || !isVerified) {
                localStorage.removeItem("jwt");
                navigate("/login");
                return;
            }

            const token = localStorage.getItem("jwt");
            try {
                const response = await fetch(`http://localhost:8080/experiment/get/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                });
                if (!response.ok) throw new Error("Eksperiment nije pronađen.");
                const data = await response.json();
                setEksperiment(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEksperiment();
    }, [id, navigate]);

    const handleAddLog = async () => {
        const token = localStorage.getItem("jwt");

        const logData = {
            note: newLog,
            entityType: "eksperiment",  // po zahtjevu
            entityId: Number(id),      // id iz useParams
        };

        try {
            const response = await fetch(`http://localhost:8080/log/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(logData),
            });

            if (!response.ok) {
                throw new Error("Neuspješno dodavanje loga.");
            }

            const addedLog = await response.text();

            setEksperiment((prev) => ({
                ...prev,
                logs: [addedLog, ...(prev.logs || [])],
            }));

            setNewLog("");
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!eksperiment) return null;

    return (
        <Card className="w-[75vw] min-h-screen">
            <CardHeader>
                <CardTitle className="text-4xl font-bold grid w-full justify-center gap-4">
                    {eksperiment.name}
                </CardTitle>
                <CardDescription>Detalji eksperimenta</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid w-full justify-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <CardTitle>Područje fizike</CardTitle>
                        <CardDescription>{eksperiment.field}</CardDescription>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <CardTitle>Nastavni predmet</CardTitle>
                        <CardDescription>{eksperiment.subject}</CardDescription>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <CardTitle>Kratak opis</CardTitle>
                        <CardDescription>{eksperiment.description}</CardDescription>
                    </div>
                </div>

                <br />
                <div className="flex flex-col space-y-1.5">
                    <CardTitle>Napomene</CardTitle>
                    <CardDescription>{eksperiment.materials}</CardDescription>
                </div>

                <br />
                <div className="flex flex-col space-y-1.5 mt-6">
                    <CardTitle>Dokumentacija</CardTitle>
                    {eksperiment.files && eksperiment.files.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {eksperiment.files.map((file, idx) => {
                                const byteCharacters = atob(file.fileByte);
                                const byteNumbers = new Array(byteCharacters.length)
                                    .fill()
                                    .map((_, i) => byteCharacters.charCodeAt(i));
                                const byteArray = new Uint8Array(byteNumbers);
                                const blob = new Blob([byteArray]);
                                const url = URL.createObjectURL(blob);

                                return (
                                    <li key={idx}>
                                        <a
                                            href={url}
                                            download={file.name}
                                            className="text-blue-600 underline"
                                        >
                                            {file.name}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <CardDescription>Nema dostupne dokumentacije.</CardDescription>
                    )}
                </div>

                <br />
                <Tabs defaultValue="komponente" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="komponente">Komponente</TabsTrigger>
                        <TabsTrigger value="materijal">Potrošni materijal</TabsTrigger>
                    </TabsList>

                    <TabsContent value="komponente">
                        <ScrollArea className="h-72 w-full rounded-md border">
                            <div className="p-4">
                                <h4 className="mb-4 text-sm font-medium leading-none">
                                    Komponente
                                </h4>
                                {eksperiment.komponente?.map((komp) => (
                                    <React.Fragment key={komp.id}>
                                        <div
                                            className="text-sm cursor-pointer"
                                            onClick={() => navigate(`/komponenteprimjer/${komp.id}`)}
                                        >
                                            {komp.name}
                                        </div>
                                        <Separator className="my-2" />
                                    </React.Fragment>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="materijal">
                        <Card>
                            <CardDescription className="p-4">
                                {eksperiment.materials}
                            </CardDescription>
                        </Card>
                    </TabsContent>
                </Tabs>

                <br />
                <div className="flex flex-col space-y-1.5 mt-6">
                    <CardTitle>Logovi eksperimenta</CardTitle>
                    {eksperiment.logs && eksperiment.logs.length > 0 ? (
                        <ScrollArea className="h-60 w-full rounded-md border">
                            <div className="p-4 space-y-2">
                                {eksperiment.logs.map((log, index) => (
                                    <div key={index} className="text-sm">
                                        <p>
                                            <strong>
                                                {new Date(log.timestamp).toLocaleString()}
                                            </strong>{" "}
                                            — {log.note}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Dodao: {log.user?.firstName} {log.user?.lastName}
                                        </p>
                                        <Separator className="my-2" />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <CardDescription>Nema logova za ovaj eksperiment.</CardDescription>
                    )}

                    {/* Unos novog loga */}
                    <div className="mt-4 space-y-2">
                        <textarea
                            className="w-full border rounded-md p-2 text-sm"
                            rows={3}
                            placeholder="Unesite novi log..."
                            value={newLog}
                            onChange={(e) => setNewLog(e.target.value)}
                        />
                        <Button onClick={handleAddLog} disabled={!newLog.trim()}>
                            Dodaj log
                        </Button>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between"></CardFooter>
        </Card>
    );
}

export default Experimentiprimjer;
