import * as React from "react"
import {Link} from 'react-router-dom';
import {Button} from "@/components/ui/button"
import {useEffect, useState} from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


function Signup() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (formData.password !== formData.confirmPassword) {
            alert("Lozinke se ne podudaraju!");
            return;
        }

        try {
            const response = await fetch("/vatroslav/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.ime,
                    lastName: formData.prezime,
                    role: formData.role
                }),
            });

            if (response.ok) {
                const data = await response.text();
                alert(`Uspjeh: ${data}`);
            } else if (response.status === 403) {
                alert("Nemate ovlasti za registraciju novog korisnika!");
            } else if (response.status === 400) {
                const error = await response.text();
                alert(`Greška: ${error}`);
            } else {
                alert("Došlo je do neočekivane pogreške. Pokušajte ponovno.");
            }
        } catch (err) {
            console.error(err);
            alert("Greška pri povezivanju s backendom.");
        }
    };

    const token = localStorage.getItem("jwt");
    if (!token) {
        return (
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Niste prijavljeni</CardTitle>
                    <CardDescription>
                        Morate se prijaviti prije nego što možete registrirati korisnike.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link to="/login">
                        <Button className="bg-pink-500 text-white">Prijava</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    } else {
        return (
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Registracija</CardTitle>
                    <CardDescription>Registracija u bazu podataka.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">


                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="ime">Ime</Label>
                                <Input id="ime" name="ime" placeholder="ime" onChange={handleChange}/>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="prezime">Prezime</Label>
                                <Input id="prezime" name="prezime" placeholder="prezime" onChange={handleChange}/>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" placeholder="email" onChange={handleChange}/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Lozinka</Label>
                                <Input id="password" name="password" type="password" placeholder="lozinka"
                                       onChange={handleChange}/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="confirm-password">Potvrda lozinke</Label>
                                <Input id="confirm-password" name="confirmPassword" type="password"
                                       placeholder="Potvrda lozinke" onChange={handleChange}/>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label>Razina autorizacije</Label>
                                <Select onValueChange={(value) => setFormData({...formData, role: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Odaberi ulogu"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ROLE_USER">USER</SelectItem>
                                        <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <CardFooter className="flex justify-between">
                            <Button type="submit" className="m-5 bg-pink-500 text-white">Registriraj se</Button>
                            <Link to="/home">
                                <Button className="m-5 bg-pink-500 text-white">Nazad</Button>
                            </Link>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        );
    }


}

export default Signup;