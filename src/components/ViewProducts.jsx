import { useProducts } from "../ProductsContext";
import { Link } from "react-router-dom";

function ViewProducts() {
  const { products } = useProducts();

  return (
    <div>
      <h2>Lista de Productos</h2>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Precio: ${product.price}</p>
              <Link to={`/update-product/${product._id}`}>
                <button>Editar</button>
              </Link>
              <button onClick={() => console.log("Eliminar", product._id)}>Eliminar</button>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles</p>
        )}
      </div>
    </div>
  );
}

export default ViewProducts;
