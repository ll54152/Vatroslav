import * as React from "react";
import {Link} from "react-router-dom";
import {useState} from "react";
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

function AccountManagement() {
    const token = localStorage.getItem("jwt");
    const [userData, setUserData] = useState(null);

    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/vatroslav/api/user/aboutMe", {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);

                    setFormData(prev => ({
                        ...prev,
                        email: data.email || "",
                        firstName: data.firstName || "",
                        lastName: data.lastName || ""
                    }));
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            alert("Lozinke se ne podudaraju!");
            return;
        }

        try {
            const response = await fetch("/vatroslav/api/user/updateUser", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                }),
            });

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

    if (!token) {
        return (
            <Card className="w-full max-w-md mx-auto mt-10 p-4">
                <CardHeader>
                    <CardTitle>Niste prijavljeni</CardTitle>
                    <CardDescription>
                        Morate se prijaviti za upravljanje računom.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link to="/login">
                        <Button className="bg-pink-500 text-white">Prijava</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-10 p-4">
            <CardHeader>
                <CardTitle>Upravljanje računom</CardTitle>
                <CardDescription>Promijenite svoje podatke.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label>Email</Label>
                            <Input
                                name="email"
                                placeholder="Email adresa"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label>Ime</Label>
                            <Input
                                name="firstName"
                                placeholder="Ime"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label>Prezime</Label>
                            <Input
                                name="lastName"
                                placeholder="Prezime"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label>Stara lozinka</Label>
                            <Input name="oldPassword" type="password" onChange={handleChange}/>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label>Nova lozinka</Label>
                            <Input name="newPassword" type="password" onChange={handleChange}/>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label>Potvrdi lozinku</Label>
                            <Input name="confirmPassword" type="password" onChange={handleChange}/>
                        </div>

                    </div>

                    <CardFooter className="flex flex-col items-center gap-2">
                        <Button type="submit" className="m-5 bg-pink-500 text-white">
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
    );
}

export default AccountManagement;