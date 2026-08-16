"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { CtaButton } from "@/components/ui/cta-button";
import { PhoneField } from "@/components/ui/phone-field";
import { TextField } from "@/components/ui/text-field";
import { createLead } from "@/lib/api";
import { DEFAULT_COUNTRY_CODE, findCountry } from "@/lib/countries";
import {
  readTrackingParams,
  saveFunnelSession,
  toFunnelSession,
} from "@/lib/funnel-session";
import { leadSchema, type LeadFormValues } from "@/lib/lead-schema";
import { readMetaCookies } from "@/lib/pixel";

interface LeadFormProps {
  id?: string;
}

export function LeadForm({ id }: LeadFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: DEFAULT_COUNTRY_CODE,
      phoneNumber: "",
    },
  });

  const countryCode = useWatch({ control, name: "countryCode" });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    const country = findCountry(values.countryCode);

    try {
      const response = await createLead({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email.trim().toLowerCase(),
        countryCode: country.code,
        dialCode: country.dialCode,
        phoneNumber: values.phoneNumber.replace(/\D/g, ""),
        /*
          Las cookies del pixel se guardan aquí, con el lead: los eventos de
          Conversions API se disparan más tarde desde el backend, que ya no
          tiene forma de leerlas.
        */
        tracking: { ...readTrackingParams(), ...readMetaCookies() },
      });

      saveFunnelSession(toFunnelSession(response));
      router.push("/procesando");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado. Inténtalo de nuevo.",
      );
    }
  });

  return (
    <form
      id={id}
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Nombre"
          placeholder="Escribe tu nombre"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />

        <TextField
          label="Apellido"
          placeholder="Escribe tu apellido"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <TextField
        label="Correo electrónico"
        type="email"
        placeholder="Escribe tu mejor correo electrónico"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Controller
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <PhoneField
            label="Número de WhatsApp"
            countryCode={countryCode}
            onCountryChange={(code) =>
              setValue("countryCode", code, { shouldValidate: false })
            }
            error={errors.phoneNumber?.message}
            value={field.value}
            onChange={(event) =>
              field.onChange(event.target.value.replace(/[^\d\s-]/g, ""))
            }
            onBlur={field.onBlur}
            ref={field.ref}
            name={field.name}
          />
        )}
      />

      {submitError && (
        <div
          role="alert"
          className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 font-body text-sm text-ivory"
        >
          {submitError}
        </div>
      )}

      <CtaButton type="submit" loading={isSubmitting}>
        {isSubmitting ? "Enviando..." : "👉 ¡Quiero mi cupo gratis a la clase!"}
      </CtaButton>

      <p className="px-1 text-center font-body text-[11px] leading-snug text-ivory/70 sm:text-xs">
        Al enviar aceptas unirte al grupo de WhatsApp y recibir ahí el acceso y
        los avisos de la clase
      </p>
    </form>
  );
}
