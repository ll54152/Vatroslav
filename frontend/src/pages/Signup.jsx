import * as React from "react"
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Lozinke se ne podudaraju!");
            return;
        }

        const response = await fetch("http://192.168.18.5:8080/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email, password: formData.password }),
        });

        const data = await response.text();
        alert(data);
    };

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
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" placeholder="email" onChange={handleChange} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Lozinka</Label>
                            <Input id="password" name="password" type="password" placeholder="lozinka" onChange={handleChange} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="confirm-password">Potvrda lozinke</Label>
                            <Input id="confirm-password" name="confirmPassword" type="password" placeholder="Potvrda lozinke" onChange={handleChange} />
                        </div>
                    </div>
                    <CardFooter className="flex justify-between">
                        <Link to="/home">
                            <Button className="m-5 bg-pink-500 text-white">Nazad</Button>
                        </Link>
                        <Button type="submit" className="m-5 bg-pink-500 text-white">Registriraj se</Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}

export default Signup;