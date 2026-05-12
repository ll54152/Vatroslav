import * as React from "react";
import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";


import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {jwtDecode} from "jwt-decode";

function Users() {
    const token = localStorage.getItem("jwt");
    const [role, setRole] = useState(null);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    const [accountForm, setAccountForm] = useState({
        email: "",
        firstName: "",
        lastName: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [signupForm, setSignupForm] = useState({
        ime: "",
        prezime: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
    });

    const isTokenValid = () => {
        const token = localStorage.getItem("jwt");
        if (!token) return false;
        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
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

    const getUserRole = () => {
        const token = localStorage.getItem("jwt");
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded.role;
        } catch {
            return null;
        }
    };


    useEffect(() => {


        const fetchUser = async () => {
            const isValid = isTokenValid();
            const isVerified = await verifyToken();
            if (!isValid || !isVerified) {
                localStorage.removeItem("jwt");
                navigate("/login");
                return;
            }
            try {
                const response = await fetch("/vatroslav/api/user/aboutMe", {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    setUserData(data);
                    setRole(getUserRole());

                    setAccountForm((prev) => ({
                        ...prev,
                        email: data.email || "",
                        firstName: data.firstName || "",
                        lastName: data.lastName || "",
                    }));
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (token) {
            fetchUser();
        }
    }, [navigate, token]);

    const handleAccountChange = (e) => {
        setAccountForm({
            ...accountForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignupChange = (e) => {
        setSignupForm({
            ...signupForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleAccountSubmit = async (e) => {
        e.preventDefault();

        if (
            accountForm.newPassword !== accountForm.confirmPassword
        ) {
            alert("Lozinke se ne podudaraju!");
            return;
        }

        try {
            const response = await fetch(
                "/vatroslav/api/user/updateUser",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                    body: JSON.stringify({
                        email: accountForm.email,
                        firstName: accountForm.firstName,
                        lastName: accountForm.lastName,
                        oldPassword: accountForm.oldPassword,
                        newPassword: accountForm.newPassword,
                    }),
                }
            );

            if (response.ok) {
                const msg = await response.text();
                alert(`Uspjeh: ${msg}`);
            } else {
                const err = await response.text();
                alert(`Greška: ${err}`);
            }
        } catch (err) {
            console.error(err);
            alert("Greška pri povezivanju s backendom.");
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        if (
            !signupForm.ime.trim() ||
            !signupForm.prezime.trim() ||
            !signupForm.email.trim() ||
            !signupForm.password.trim() ||
            !signupForm.confirmPassword.trim() ||
            !signupForm.role
        ) {
            alert("Sva polja moraju biti ispunjena!");
            return;
        }

        if (signupForm.password !== signupForm.confirmPassword) {
            alert("Lozinke se ne podudaraju!");
            return;
        }

        try {
            const response = await fetch(
                "/vatroslav/api/user/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                    body: JSON.stringify({
                        email: signupForm.email,
                        password: signupForm.password,
                        firstName: signupForm.ime,
                        lastName: signupForm.prezime,
                        role: signupForm.role,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.text();
                alert(`Uspjeh: ${data}`);

                setSignupForm({
                    ime: "",
                    prezime: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    role: "",
                });

            } else if (response.status === 403) {
                alert("Nemate ovlasti za registraciju novog korisnika!");

            } else if (response.status === 400) {
                const error = await response.text();
                alert(`Greška: ${error}`);

            } else {
                alert("Došlo je do neočekivane pogreške.");
            }

        } catch (err) {
            console.error(err);
            alert("Greška pri povezivanju s backendom.");
        }
    };

    const isAdmin =
        role === "ROLE_ADMIN" ||
        userData?.roles?.includes("ROLE_ADMIN");

    if (!token) {
        return (
            <Card className="w-full max-w-md mx-auto mt-10 p-4">
                <CardHeader>
                    <CardTitle>Niste prijavljeni</CardTitle>
                    <CardDescription>
                        Morate se prijaviti za pristup stranici.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Link to="/login">
                        <Button className="bg-pink-500 text-white">
                            Prijava
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="flex flex-wrap justify-center items-start gap-10 py-10 px-4">

            <Card className="w-full max-w-md p-4">
                <CardHeader>
                    <CardTitle>Upravljanje računom</CardTitle>
                    <CardDescription>
                        Promijenite svoje podatke.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleAccountSubmit}>
                        <div className="grid w-full items-center gap-4">

                            <div className="flex flex-col space-y-1.5">
                                <Label>Email</Label>
                                <Input
                                    name="email"
                                    placeholder="Email adresa"
                                    value={accountForm.email}
                                    onChange={handleAccountChange}
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label>Ime</Label>
                                <Input
                                    name="firstName"
                                    placeholder="Ime"
                                    value={accountForm.firstName}
                                    onChange={handleAccountChange}
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label>Prezime</Label>
                                <Input
                                    name="lastName"
                                    placeholder="Prezime"
                                    value={accountForm.lastName}
                                    onChange={handleAccountChange}
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label>Stara lozinka</Label>
                                <Input
                                    name="oldPassword"
                                    type="password"
                                    onChange={handleAccountChange}
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label>Nova lozinka</Label>
                                <Input
                                    name="newPassword"
                                    type="password"
                                    onChange={handleAccountChange}
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label>Potvrdi lozinku</Label>
                                <Input
                                    name="confirmPassword"
                                    type="password"
                                    onChange={handleAccountChange}
                                />
                            </div>
                        </div>

                        <CardFooter className="flex flex-col items-center gap-2">
                            <Button
                                type="submit"
                                className="m-5 bg-pink-500 text-white"
                            >
                                Spremi promjene
                            </Button>

                            <Link to="/mainpage">
                                <Button className="m-5 bg-pink-500 text-white">
                                    Nazad
                                </Button>
                            </Link>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>

            {isAdmin && (
                <Card className="w-full max-w-md p-4">
                    <CardHeader>
                        <CardTitle>Registracija korisnika</CardTitle>
                        <CardDescription>
                            Dodajte novog korisnika.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSignupSubmit}>
                            <div className="grid w-full items-center gap-4">

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="ime">Ime</Label>
                                    <Input
                                        id="ime"
                                        name="ime"
                                        placeholder="Ime"
                                        value={signupForm.ime}
                                        onChange={handleSignupChange}
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="prezime">Prezime</Label>
                                    <Input
                                        id="prezime"
                                        name="prezime"
                                        placeholder="Prezime"
                                        value={signupForm.prezime}
                                        onChange={handleSignupChange}
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input
                                        id="signup-email"
                                        name="email"
                                        placeholder="Email"
                                        value={signupForm.email}
                                        onChange={handleSignupChange}
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="password">
                                        Lozinka
                                    </Label>

                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Lozinka"
                                        value={signupForm.password}
                                        onChange={handleSignupChange}
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="confirm-password">
                                        Potvrda lozinke
                                    </Label>

                                    <Input
                                        id="confirm-password"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Potvrda lozinke"
                                        value={signupForm.confirmPassword}
                                        onChange={handleSignupChange}
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label>Razina autorizacije</Label>

                                    <Select
                                        onValueChange={(value) =>
                                            setSignupForm({
                                                ...signupForm,
                                                role: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Odaberi ulogu"/>
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="ROLE_ADMIN">
                                                Admin
                                            </SelectItem>

                                            <SelectItem value="ROLE_USER">
                                                User
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <CardFooter className="flex flex-col items-center gap-2">
                                <Button
                                    type="submit"
                                    className="m-5 bg-pink-500 text-white"
                                >
                                    Registriraj korisnika
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default Users;