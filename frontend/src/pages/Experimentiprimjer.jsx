import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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

const tags = Array.from({ length: 10 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

function Experimentiprimjer() {
    const { id } = useParams();
    const [eksperiment, setEksperiment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEksperiment = async () => {
            try {
                const response = await fetch(`http://localhost:8080/experiment/get/${id}`);
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
    }, [id]);

    if (loading) return <div>Učitavanje...</div>;
    if (error) return <div>Greška: {error}</div>;
    if (!eksperiment) return null;

    return (
        <Card className="w-[75vw] h-[160vh]">
            <CardHeader>
                <CardTitle className="text-4xl font-bold grid w-full justify-center gap-4 ">
                    {eksperiment.name}
                </CardTitle>
                <CardDescription>{eksperiment.description}</CardDescription>
            </CardHeader>

            <CardContent>
                <form>
                    <div className="grid w-full justify-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <CardTitle>Područje fizike</CardTitle>
                            <CardDescription>{eksperiment.field}</CardDescription>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <CardTitle>Nastavni predmet</CardTitle>
                            <CardDescription>{eksperiment.subject}</CardDescription>
                        </div>

                        <br />

                        <div className="flex flex-col space-y-1.5">
                            <CardTitle>Kratak opis</CardTitle>
                            <CardDescription>{eksperiment.description}</CardDescription>
                        </div>
                    </div>

                    <Card className="w-[350px] grid w-full justify-center gap-4 ">
                        <CardHeader>
                            <CardDescription>
                                <p>&nbsp;</p>
                                {eksperiment.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent></CardContent>
                        <CardFooter className="flex justify-between"></CardFooter>
                    </Card>

                    <br />

                    <div className="flex flex-col space-y-1.5">
                        <CardTitle>Napomene</CardTitle>
                        <CardDescription>{eksperiment.materials}</CardDescription>
                    </div>

                    <Card className="w-[350px] grid w-full justify-center gap-4 ">
                        <CardHeader>
                            <CardDescription>
                                <p>&nbsp;</p>
                                {eksperiment.materials}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <br />

                    <div className="flex flex-col space-y-1.5">
                        <CardTitle>Dokumentacija</CardTitle>
                        <CardDescription> {/* Ako imaš neki dokumentacijski tekst, ubaci ovdje */}</CardDescription>
                    </div>

                    <Card className="w-[350px] grid w-full justify-center gap-4 ">
                        <CardHeader>
                            <CardDescription>
                                <p>&nbsp;</p>
                                {/* Možeš ovdje prikazati neki dokumentacijski sadržaj ako ga ima */}
                                Nema dostupne dokumentacije.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <br />

                    <Tabs defaultValue="komponente" className="w-100">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="komponente">Komponente</TabsTrigger>
                            <TabsTrigger value="potrošni">Potrošni materijal</TabsTrigger>
                        </TabsList>

                        <TabsContent value="komponente">
                            <ScrollArea className="h-72 w-100 rounded-md border">
                                <div className="p-4">
                                    <h4 className="mb-4 text-sm font-medium leading-none">Komponente</h4>
                                    {eksperiment.komponente && eksperiment.komponente.length > 0 ? (
                                        eksperiment.komponente.map((komp, idx) => (
                                            <React.Fragment key={idx}>
                                                <div className="text-sm">{komp.naziv || komp.name || `Komponenta ${idx + 1}`}</div>
                                                <Separator className="my-2" />
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <div>Nema komponenti</div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="potrošni">
                            <Card>
                                <br />
                                <CardDescription>
                                    Sed euismod ultrices enim id facilisis. Nullam a elit tortor. Nulla posuere lorem a purus facilisis
                                    varius. Donec vulputate quam ut lacinia tempus. Integer molestie scelerisque quam, eget mollis arcu
                                    vehicula eu. Aliquam id diam non nibh vulputate lacinia.
                                </CardDescription>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <br />
                </form>
            </CardContent>

            <CardFooter className="flex justify-between"></CardFooter>
        </Card>
    );
}

export default Experimentiprimjer;
