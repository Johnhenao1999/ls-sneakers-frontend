import Select from "react-select";
import { useBrands } from "../BrandsContext";
import "../css/brandFilter.css";

function BrandFilter({ selectedBrand, setSelectedBrand }) {
  const { brands, loadingBrands, error } = useBrands();

  if (loadingBrands) return <p className="filter-label">Cargando marcas...</p>;
  if (error) return <p className="filter-error">{error}</p>;

  // Convertimos las marcas a formato compatible con react-select
  const options = [
    { value: "", label: "Todas" },
    ...brands.map((brand) => ({ value: brand, label: brand })),
  ];

  // Encontrar la opción actual seleccionada
  const selectedOption =
    options.find((option) => option.value === selectedBrand) || options[0];

  return (
    <section className="filter-container">
      <label className="filter-label">Filtrar por:</label>
      <div className="filter-select-wrapper">
        <Select
          options={options}
          value={selectedOption}
          onChange={(option) => setSelectedBrand(option.value)}
          placeholder="Selecciona o busca una marca..."
          isSearchable
          styles={{
            control: (base, state) => ({
              ...base,
              width: 250,
              border: `2px solid ${state.isFocused ? "#b50a34" : "#e11d48"}`,
              boxShadow: state.isFocused
                ? "0 0 5px rgba(225, 29, 72, 0.5)"
                : "0 3px 8px rgba(0,0,0,0.1)",
              borderRadius: 8,
              padding: 2,
              transition: "all 0.3s ease-in-out",
              cursor: "pointer",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? "#e11d48"
                : state.isFocused
                ? "#fbe7ec"
                : "white",
              color: state.isSelected ? "white" : "#333",
              cursor: "pointer",
            }),
            placeholder: (base) => ({
              ...base,
              color: "#666",
            }),
            singleValue: (base) => ({
              ...base,
              color: "#222",
              fontWeight: "500",
            }),
          }}
        />
      </div>
    </section>
  );
}

export default BrandFilter;
