// 🔹 Variable que exportaremos igual que antes
export let BRANDS = [];

// 🔹 Función para cargar dinámicamente las marcas desde el backend
export async function loadBrands() {
  try {
    const response = await fetch("https://ls-sneakers-backend.vercel.app/api/brands");
    if (!response.ok) throw new Error("Error al obtener marcas");

    const data = await response.json();
    BRANDS = data.map((b) => b.name);
    console.log("✅ Marcas cargadas desde backend:", BRANDS);
  } catch (error) {
    console.warn("⚠️ Usando marcas locales por error o backend inactivo:", error);
  }
}

export const sizesByGender = {
  Hombre: ['40 EUR - H', '41 EUR - H', '42 EUR - H', '43 EUR - H', '44 EUR - H'],
  Mujer: ['36 EUR - M', '37 EUR - M', '38 EUR - M', '39 EUR - M'],
  Unisex: [],
  Niños: ['28 EUR - N', '29 EUR - N', '30 EUR - N', '31 EUR - N', '32 EUR - N', '33 EUR - N', '34 EUR - N', '35 EUR - N'],
};
sizesByGender.Unisex = [...sizesByGender.Hombre, ...sizesByGender.Mujer];
export const genders = ['Hombre', 'Mujer', 'Guayos', 'Niños', 'Unisex'];
