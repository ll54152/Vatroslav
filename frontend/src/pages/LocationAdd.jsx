import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function LocationAdd() {
    const [address, setAddress] = useState("");
    const [room, setRoom] = useState("");

    const navigate = useNavigate();

    const handleSaveLocation = async () => {
        const token = localStorage.getItem("jwt");

        const requestData = {
            address,
            room,
        };

        try {
            const response = await fetch("/vatroslav/api/location/add", {
                method: "POST",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {

                alert("Nova lokacija uspješno dodana");

                navigate(`/locations`);
            } else {
                try {
                    const errorData = await response.json();

                    const errorMsg =
                        errorData.message || "Greška prilikom dodavanja lokacije";

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
            console.error("Error saving location:", error);
            alert("Došlo je do greške prilikom spremanja lokacije.");
        }
    };

    return (
        <Card className="w-full p-2 lg:p-4">
            <CardHeader className="flex flex-col items-center p-3 lg:p-6">
                <CardTitle className="text-4xl font-bold">
                    Unos nove lokacije
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="max-w-2xl mx-auto flex flex-col gap-6">

                    <Card className="p-4">
                        <CardTitle className="mb-3">Adresa</CardTitle>

                        <Input
                            placeholder="Unesite adresu"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </Card>

                    <Card className="p-4">
                        <CardTitle className="mb-3">Prostorija</CardTitle>

                        <Input
                            placeholder="Unesite prostoriju"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                        />
                    </Card>

                </div>
            </CardContent>

            <div className="flex justify-center">
                <Button
                    className="m-5 bg-pink-500 text-white"
                    onClick={handleSaveLocation}
                >
                    Završi
                </Button>
            </div>
        </Card>
    );
}