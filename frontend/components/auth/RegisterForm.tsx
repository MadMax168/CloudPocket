import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function RegisterForm() {
    return (
        <form className="space-y-2">
            <Input type="text" placeholder="email@domain.com" />
            <Input type="text" placeholder="username" />
            <Input type="password"  placeholder="Password" />
            <Input type="password"  placeholder="Confirmed-Password" />
            <hr className="text-zinc-400"/>
            <Button type="submit" className="w-full bg-green-700 hover:bg-green-600">
                SIGN-UP WITH EMAIL
            </Button>
        </form>
    )
}