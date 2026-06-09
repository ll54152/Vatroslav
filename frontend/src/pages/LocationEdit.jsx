import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function LocationEdit() {
    const {id} = useParams();

    const [address, setAddress] = useState("");
    const [room, setRoom] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocation = async () => {
            const token = localStorage.getItem("jwt");

            try {
                const response = await fetch(
                    `/vatroslav/api/location/get/${id}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Greška pri dohvaćanju lokacije");
                }

                const data = await response.json();

                setAddress(data.address || "");
                setRoom(data.room || "");
            } catch (err) {
                alert(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLocation();
    }, [id]);

    const handleSave = async () => {
        const token = localStorage.getItem("jwt");

        const requestData = {
            address,
            room,
        };

        try {
            const response = await fetch(
                `/vatroslav/api/location/update/${id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                }
            );

            if (response.ok) {
                alert("Lokacija uspješno ažurirana");
                navigate(`/location/view/${id}`);
            } else {
                try {
                    const errorData = await response.json();

                    const errorMsg =
                        errorData.message || "Greška pri spremanju";

                    const errorDetails = errorData.details
                        ? ` - ${errorData.details}`
                        : "";

                    alert(`Greška: ${errorMsg}${errorDetails}`);
                } catch {
                    const errorMessage = await response.text();
                    alert(`Greška: ${errorMessage}`);
                }
            }
        } catch (error) {
            console.error(error);
            alert("Došlo je do greške prilikom spremanja.");
        }
    };

    if (loading) {
        return <div className="p-6">Učitavanje...</div>;
    }

    return (
        <Card className="w-full p-2 lg:p-4">
            <CardHeader className="flex flex-col items-center p-3 lg:p-6">
                <CardTitle className="text-4xl font-bold">
                    Uredi lokaciju
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="max-w-2xl mx-auto flex flex-col gap-6">

                    <Card className="p-4">
                        <CardTitle className="mb-3">Adresa</CardTitle>

                        <Input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Unesite adresu"
                        />
                    </Card>

                    <Card className="p-4">
                        <CardTitle className="mb-3">Prostorija</CardTitle>

                        <Input
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            placeholder="Unesite prostoriju"
                        />
                    </Card>

                </div>
            </CardContent>

            <div className="flex justify-center">
                <Button
                    className="m-5 bg-pink-500 text-white"
                    onClick={handleSave}
                >
                    Spremi promjene
                </Button>
            </div>
        </Card>
    );
}