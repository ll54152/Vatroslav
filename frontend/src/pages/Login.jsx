import React, {useState, useEffect} from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {jwtDecode} from "jwt-decode";

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
        const response = await fetch("/vatroslav/api/auth/verify", {
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("jwt");
            if (isTokenValid(token)) {
                setIsAuthenticated(true);
                navigate("/mainpage");
            } else {
                const valid = await verifyToken(token);
                if (valid) {
                    setIsAuthenticated(true);
                    navigate("/mainpage");
                } else {
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };

        checkToken();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/vatroslav/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            });

            if (response.ok) {
                const token = await response.text();
                localStorage.setItem("jwt", token);
                console.log("Login successful, Token:", token);
                navigate("/mainpage");
            } else {
                const error = await response.json();
                alert(`Error: ${error.details}`);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred.");
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return (
            <div className="flex h-[calc(100dvh-64px)] items-center justify-center overflow-hidden">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Prijava</CardTitle>
                        <CardDescription>
                            Prijava u bazu podataka.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div>
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

                            <CardFooter className="mt-6 flex flex-col items-center justify-center gap-4">
                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        className="bg-pink-500 text-white hover:bg-pink-600"
                                    >
                                        Prijavi se
                                    </Button>

                                    <Link to="/home">
                                        <Button className="bg-pink-500 text-white hover:bg-pink-600">
                                            Nazad
                                        </Button>
                                    </Link>
                                </div>

                                <Link to="/forgot-password">
                                    <Button
                                        variant="link"
                                        className="text-pink-500"
                                    >
                                        Zaboravili ste lozinku?
                                    </Button>
                                </Link>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
}

export default Login;
