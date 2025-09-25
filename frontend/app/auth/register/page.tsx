import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Register() {
    return (
        <div className="w-full flex flex-row">
            <div className="">
                sidebar
            </div>
            <div className="justify-center items-center">
                <div className="space-y-5">
                    CLOUD POCKET
                    <div>
                        Create Account
                    </div>
                </div>
                <div className="">
                    <RegisterForm />
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}