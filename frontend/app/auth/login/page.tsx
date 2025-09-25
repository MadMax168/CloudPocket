import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { House } from "lucide-react";

export default function Login() {
    return (
        <div className="w-full min-h-screen flex flex-col md:flex-row">
            {/* Header (Mobile Only) */}
            <div className="w-full py-4 px-6 shadow-sm sm:hidden flex justify-between items-center">
                <span className="font-bold">Header</span>
                <Link href="/" className="text-blue-600 font-medium text-sm">
                    <House />
                </Link>
            </div>

            {/* Left Section (Desktop / iPad) */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 flex-col justify-center items-center text-white p-10 space-y-6">
                <h1 className="text-4xl font-bold">CLOUD POCKET</h1>
                <Link href="/" className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition">
                   Go to Main Page
                </Link>
            </div>

            {/* Right Section */}
            <div className="flex flex-1 justify-center items-center">
                <div className="w-full max-w-md space-y-3 p-6 bg-white rounded-2xl sm:shadow-md">
                
                {/* Header Title (mobile only) */}
                <div className="sm:hidden text-center">
                    <h1 className="text-2xl font-bold">CLOUD POCKET</h1>
                </div>

                {/* Title */}
                <div className="space-y-2 text-center">
                    <h2 className="text-lg font-semibold">Login</h2>
                    <p className="text-gray-500 text-sm">
                        Enter your email and password to sign in
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-1">
                    <LoginForm />
                    <div className="text-right text-sm">
                        Don't have an account?{" "}
                        <Link href="/auth/register" className="text-blue-600 font-medium hover:underline">
                            Create One
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-zinc-500 text-sm">
                    Take the <span className="text-black font-semibold">first step</span> to better{" "}
                    <span className="text-black font-semibold">money management.</span>
                </div>
                </div>
            </div>
        </div>
    )
}
