import * as React from "react";
import { Link, Navigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger
} from "@/components/ui/menubar";
import { jwtDecode } from "jwt-decode";

const isTokenValid = () => {
    const token = localStorage.getItem("jwt");
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
        console.log("Token is valid");
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

export default function CarouselSize() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);

    React.useEffect(() => {
        verifyToken().then(setIsAuthenticated);
    }, []);

    if (isAuthenticated === false || !isTokenValid()) {
        localStorage.removeItem("jwt");
        return <Navigate to="/login" />;
    }

    if (isAuthenticated === null) {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
        <div>
            <Carousel opts={{ align: "start" }} className="w-[65vw] h-[70vh]">
                <CarouselContent>
                    {[
                        { path: "/experimenti", label: "Eksperimenti" },
                        { path: "/komponente", label: "Komponente" },
                        { path: "/experimentunos", label: "Dodaj eksperiment +" },
                        { path: "/komponenteunos", label: "Dodaj komponentu +" }
                    ].map((item, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                            <div className="p-1">
                                <Link to={item.path}>
                                    <Card className="hover:bg-pink-500 hover:text-white transition duration-300">
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <span className="text-3xl font-bold">{item.label}</span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <Menubar>
                <MenubarMenu>
                    <Link to="/home">
                        <MenubarTrigger className="w-40 hover:bg-red-500" onClick={() => localStorage.removeItem("token")}>
                            Odjava
                        </MenubarTrigger>
                    </Link>
                   
                </MenubarMenu>
            </Menubar>
        </div>
        </div>
    );
}
