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
                setMessage("If account exists, a reset link has been sent to your email.");
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
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Reset Lozinke</CardTitle>
                <CardDescription>Unesite email da biste dobili link za reset lozinke.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                placeholder="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <CardFooter className="flex justify-between mt-4">
                        <Button type="submit" className="m-10 bg-pink-500 text-white">Pošalji</Button>
                    </CardFooter>
                </form>
                {message && <p className="mt-4 text-sm">{message}</p>}
            </CardContent>
        </Card>
    );
}