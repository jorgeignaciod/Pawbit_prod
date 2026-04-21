import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonResponse(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, init);
}

export function logApiError(scope: string, error: unknown) {
  console.error(`[api:${scope}]`, error);
}

export function validationErrorResponse(error: ZodError) {
  return jsonResponse(
    {
      error: "validation_error",
      message: "Hay datos invalidos en la solicitud",
      fields: error.flatten()
    },
    { status: 400 }
  );
}

export function internalServerErrorResponse() {
  return jsonResponse(
    {
      error: "internal_error",
      message: "No pudimos completar la solicitud."
    },
    { status: 500 }
  );
}
