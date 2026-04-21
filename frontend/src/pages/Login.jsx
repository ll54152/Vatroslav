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
                const error = await response.text();
                alert(`Error: ${error}`);
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
            <Card className="w-1/2 p-2 lg:p-4 mx-auto mt-10">
                <CardHeader>
                    <CardTitle>Prijava</CardTitle>
                    <CardDescription>Prijava u bazu podataka.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid items-center gap-4">
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
                        <CardFooter className="flex flex-col items-center gap-2">
                            <div className="flex gap-2">
                                <Button type="submit" className="m-5 bg-pink-500 text-white">Prijavi se</Button>
                                <Link to="/home">
                                    <Button className="m-5 bg-pink-500 text-white">Nazad</Button>
                                </Link>
                            </div>
                            <Link to="/forgot-password">
                                <Button variant="link" className="m-10 bg-pink-500 text-white">
                                    Zaboravili ste lozinku?
                                </Button>
                            </Link>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        );
    }

    return null;
}

export default Login;
