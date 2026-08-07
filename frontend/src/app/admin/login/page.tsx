"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { BrandMark } from "@/components/brand/brand-mark";
import { CtaButton } from "@/components/ui/cta-button";
import { TextField } from "@/components/ui/text-field";
import { adminLogin } from "@/lib/admin-api";
import { saveAdminToken } from "@/lib/admin-session";
import { ApiError } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { token } = await adminLogin(password);
      saveAdminToken(token);
      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Ocurrió un error inesperado. Inténtalo de nuevo.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-obsidian px-5">
      <div className="surface-card w-full max-w-sm p-8">
        <BrandMark compact />

        <p className="font-heading mt-6 text-xl font-bold text-ivory">
          Panel de administración
        </p>
        <p className="font-body mt-1 text-sm text-graphite">
          Ingresa la contraseña para ver los leads.
        </p>

        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-6 flex flex-col gap-4"
        >
          <TextField
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 font-body text-sm text-ivory"
            >
              {error}
            </div>
          )}

          <CtaButton type="submit" loading={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </CtaButton>
        </form>
      </div>
    </div>
  );
}
