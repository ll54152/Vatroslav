import '../Open.css'
import {Link} from 'react-router-dom';
import {Button} from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


export default function Home() {

    return (

        <Card>

            <CardHeader>
                <CardTitle>Inventar Vatroslav</CardTitle>
            </CardHeader>

            <CardContent className="font-mono">
                <Link to="/login">
                    <Button className="m-5 bg-pink-500 text-white">Prijava</Button>
                </Link>
            </CardContent>

        </Card>

    );

}

