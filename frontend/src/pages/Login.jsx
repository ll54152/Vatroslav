import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jwtDecode } from "jwt-decode";

const isTokenValid = (token) => {
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (error) {
        return false;
    }
};

const verifyToken = async (token) => {
    if (!token) return false;
    try {
        const response = await fetch("http://localhost:8080/auth/verify", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer${token}`,
            },
        });
        return response.ok;
    } catch (error) {
        return false;
    }
};

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Dodajemo loading stanje za čekanje

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("jwt");
            if (isTokenValid(token)) {
                setIsAuthenticated(true);
                navigate("/mainpage"); // Preusmjerenje na mainpage ako je token validan
            } else {
                const valid = await verifyToken(token);
                if (valid) {
                    setIsAuthenticated(true);
                    navigate("/mainpage"); // Preusmjerenje na mainpage nakon uspješne verifikacije
                } else {
                    setIsAuthenticated(false);
                }
            }
            setLoading(false); // Kada završi provjera, postavimo loading na false
        };

        checkToken();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const token = await response.text(); // JWT token je plain text
                localStorage.setItem("jwt", token); // Čuvanje tokena
                console.log("Login successful, Token:", token);
                navigate("/mainpage");
            } else {
                const error = await response.text();
                alert(`Error: ${error}`);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred.");
        }
    };

    // Ako još uvijek čekamo na odgovor o autentifikaciji, prikazujemo loading
    if (loading) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return (
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Prijava</CardTitle>
                    <CardDescription>Prijava u bazu podataka.</CardDescription>
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
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Lozinka</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="lozinka"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <CardFooter className="flex justify-between">
                            <Link to="/home">
                                <Button className="m-5 bg-pink-500 text-white">Nazad</Button>
                            </Link>
                            <Button type="submit" className="m-5 bg-pink-500 text-white">Prijavi se</Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        );
    }

    return null;
}

export default Login;
