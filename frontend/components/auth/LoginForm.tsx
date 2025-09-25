import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function LoginForm() {
    return (
        <form className="space-y-3">
            <Input type="text" placeholder="email@domain.com" />
            <Input type="password"  placeholder="Password" />
            <Button type="submit" className="w-full bg-green-700 hover:bg-green-600">
                SIGN-IN WITH EMAIL
            </Button>
        </form>
    )
}