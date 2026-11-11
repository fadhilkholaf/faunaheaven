import Link from "next/link";
import { AuthForm } from "../../components/auth-form";
import { MainNav } from "../../components/main-nav";
export default function SignupPage() {
    return (
        <main className="min-h-screen bg-[#fffaf4]">
            <MainNav />
            <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-10">
            <section className="w-full max-w-md rounded-[28px] border border-[#e5ece6] bg-white p-8 shadow-xl">
                <Link href="/" className="font-bold text-[#1f7a5c]">
                    ← FaunaHeaven
                </Link>
                <h1 className="mt-10 font-serif text-4xl text-[#18352a]">
                    Mulai menjelajah.
                </h1>
                <p className="mt-3 mb-8 text-[#708078]">
                    Buat akun gratis dan pelajari alam bersama kami.
                </p>
                <AuthForm mode="signup" />
                <p className="mt-6 text-center text-sm text-[#708078]">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="font-bold text-[#1f7a5c]">
                        Masuk
                    </Link>
                </p>
            </section>
            </div>
        </main>
    );
}
