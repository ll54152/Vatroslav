import React, {useState, useEffect} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`/vatroslav/api/user/reset-password?token=${token}&newPassword=${newPassword}`, {
                method: "POST",
            });

            if (response.ok) {
                setMessage("Password updated successfully. Redirecting to login...");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                const error = await response.text();
                setMessage(`Error: ${error}`);
            }
        } catch (err) {
            console.error(err);
            setMessage("An error occurred.");
        }
    };

    if (!token) return <p>Invalid reset link.</p>;

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Reset Lozinke</CardTitle>
                <CardDescription>Unesite novu lozinku.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="newPassword">Nova lozinka</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="confirmPassword">Potvrdi lozinku</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <CardFooter className="flex justify-between mt-4">
                        <Button type="submit" className="bg-pink-500 text-white">Reset</Button>
                    </CardFooter>
                </form>
                {message && <p className="mt-4 text-sm">{message}</p>}
            </CardContent>
        </Card>
    );
}