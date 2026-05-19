import '../Open.css'
import { Link } from 'react-router-dom';
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import * as React from "react";

export default function Home() {

    const items = [
        { path: "/experiments/public", label: "Eksperimenti" },
        { path: "/login", label: "Prijava" }
    ];

    return (
        <div className="flex h-[calc(100dvh-64px)] items-center justify-center">
            <div className="grid grid-cols-2 gap-4">
                {items.map((item, index) => {
                    return (
                        <div key={index} className="p-1">
                            <Link to={item.path}>
                                <Card className="hover:bg-pink-500 hover:text-white transition duration-300">
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-2xl font-bold">
                                            {item.label}
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}