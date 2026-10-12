import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Daftar — OKFT-UH",
  description: "Buat akun dengan NIM Anda.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
