"use client";

import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Oops, algo salió mal!
        </h1>
        <p className="mt-4 text-muted-foreground">
          Lo sentimos, pero ocurrió un error inesperado. Por favor, inténtalo de
          nuevo más tarde o contacta al soporte si el problema persiste.
        </p>
        <div className="mt-6">
          <Button
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => window.location.reload()}
          >
            Intentar de nuevo
          </Button>
        </div>
      </div>
    </div>
  );
}
