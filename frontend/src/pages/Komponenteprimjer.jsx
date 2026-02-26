import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {jwtDecode} from "jwt-decode";

function Komponenteprimjer() {
    const {id} = useParams();
    const [component, setComponent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const isTokenValid = () => {
        const token = localStorage.getItem("jwt");
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
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
            const response = await fetch("/vatroslav/api/auth/verify", {
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
        const fetchComponent = async () => {
            const token = localStorage.getItem("jwt");

            const isValid = isTokenValid();
            const isVerified = await verifyToken();

            if (!isValid || !isVerified) {
                localStorage.removeItem("jwt");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`/vatroslav/api/component/get/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Greška prilikom dohvaćanja podataka!");
                }
                const data = await response.json();
                setComponent(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComponent();
    }, [id, navigate]);

    if (loading) return <div>Učitavanje...</div>;
    if (error) return <div>Greška: {error}</div>;
    if (!component) return <div>Komponenta nije pronađena.</div>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <Card className="w-[75vw] h-[160vh]">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold grid w-full justify-center gap-4 ">
                        {component.name || "Naziv komponente"}
                    </CardTitle>
                    
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full justify-center gap-4">
                            {/* Prikaz svih informacija o komponenti */}
                            <div className="flex flex-col space-y-1.5">
                                <CardTitle>Interna oznaka (ZPF)</CardTitle>
                               <CardDescription className="text-blue-900 text-lg">{component.zpf || "N/A"}</CardDescription>
                                    
                                
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <CardTitle>FER Status (Active/InActive/Unknown)</CardTitle>
                               
                                    <CardDescription className="text-blue-900 text-lg">{component.fer || "N/A"}</CardDescription>
                            
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <CardTitle>Kratki opis</CardTitle>
                                
                                  <CardDescription className="text-blue-900 text-lg">{component.description|| "N/A"}</CardDescription>
                               
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <CardTitle>Gdje se nalazi</CardTitle>
                               
                                    <CardDescription className="text-blue-900 text-lg">
                                        {component.location && component.location.adress && component.location.room
                                            ? `${component.location.adress}, ${component.location.room}`
                                            : "Lokacija nije dostupna"}
                                   </CardDescription>
                                
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <CardTitle>Količina</CardTitle>
                                
                                     <CardDescription className="text-blue-900 text-lg">{component.quantity|| "N/A"}</CardDescription>
                               
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <CardTitle>Zapisi (Logs)</CardTitle>
                                <CardContent>
                                    {component.logs && component.logs.length > 0 ? (
                                        <ul>
                                            {component.logs.map((log, index) => (
                                                <li key={index}>
                                                    <strong>Bilješka:</strong> {log.note} <br/>
                                                    <strong>Vrijeme:</strong> {new Date(log.timestamp).toLocaleString()}
                                                    <br/>
                                                    <strong>Korisnik:</strong> {log.user?.name || "Nepoznato"}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        "Nema zapisa"
                                    )}

                                </CardContent>
                            </div>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="eksperiments">
                                    <AccordionTrigger
                                        style={{
                                            backgroundColor: "white",
                                            color: "black",
                                            padding: "0.5rem 1rem",
                                            borderRadius: "0.25rem",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            textAlign: "center",
                                        }}
                                    >
                                        Eksperimenti
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {component.eksperimenti && component.eksperimenti.length > 0 ? (
                                            <ul>
                                                {component.eksperimenti.map((experiment) => (
                                                    <li
                                                        key={experiment.id}
                                                        className="cursor-pointer text-blue-500 hover:underline"
                                                        onClick={() => navigate(`/experimentiprimjer/${experiment.id}`)}
                                                    >
                                                        {experiment.name || "Nema imena"}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            "Nema eksperimenata"
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between"></CardFooter>
            </Card>
        </div>
    );
}

export default Komponenteprimjer;
