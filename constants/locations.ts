export const COUNTRY_OPTIONS = ["Chile", "Perú", "Argentina", "Uruguay", "Colombia"] as const;

export const CITY_OPTIONS_BY_COUNTRY = {
  Chile: ["Santiago", "Valparaiso", "Concepcion", "La Serena", "Puerto Montt"],
  "Perú": ["Lima", "Arequipa", "Cusco", "Trujillo", "Piura"],
  Argentina: ["Buenos Aires", "Cordoba", "Rosario", "Mendoza", "Mar del Plata"],
  Uruguay: ["Montevideo", "Punta del Este", "Maldonado", "Colonia", "Salto"],
  Colombia: ["Bogota", "Medellin", "Cali", "Barranquilla", "Cartagena"]
} as const;

export type SupportedCountry = (typeof COUNTRY_OPTIONS)[number];
