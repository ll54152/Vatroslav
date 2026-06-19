import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/vatroslav/api/user/forgot-password", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email}),
            });

            if (response.ok) {
                setMessage("Ukoliko korisnički račun postoji, poslana Vam je poveznica za obnovu lozinke.");
            } else {
                const error = await response.text();
                setMessage(`Error: ${error}`);
            }
        } catch (err) {
            console.error(err);
            setMessage("An error occurred.");
        }
    };

    return (
        <div className="flex h-[calc(100dvh-64px)] items-center justify-center overflow-hidden">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Obnova lozinke</CardTitle>

                    <CardDescription>
                        Unesite email adresu na koju će Vam biti poslana poveznica za obnovu lozinke.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>

                                <Input
                                    id="email"
                                    placeholder="Upišite vašu email adresu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <CardFooter className="mt-6 flex justify-center px-0">
                            <Button
                                type="submit"
                                className="bg-pink-500 text-white hover:bg-pink-600"
                            >
                                Pošalji
                            </Button>
                        </CardFooter>
                    </form>

                    {message && (
                        <p className="mt-4 text-center text-sm">
                            {message}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}