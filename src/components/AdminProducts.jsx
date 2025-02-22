import React, { useState } from 'react';
import "../css/adminpanel.css";

const AddProducts = () => {
  const preset_name = 'lsneakersuploadassets'; // Upload preset de Cloudinary
  const cloud_name = 'dj2v5y8li'; // Nombre del cloud_name en Cloudinary

  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    branch: '',
    gender: '',
    sizes: [],
    gender: '', // Nuevo campo para Hombre, Mujer o Unisex
  });

  const categories = ['Adidas', 'Nike', 'Puma', 'Armani', 'New Balance']; // Opciones de categorías
  const availableSizes = ['36 MUJER', '37 MUJER', '38 MUJER', '36 HOMBRE', '37 HOMBRE', '38 HOMBRE']; // Opciones de tallas
  const genders = ['Hombre', 'Mujer', 'Unisex']; // Opciones para género

  // Handler para actualizar los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler para actualizar las tallas seleccionadas
  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      sizes: checked
        ? [...prev.sizes, value] // Agregar talla seleccionada
        : prev.sizes.filter((size) => size !== value), // Remover talla deseleccionada
    }));
  };

  // Subir imagen a Cloudinary
  const uploadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', preset_name);

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        { method: 'POST', body: data }
      );
      const file = await response.json();
      setImage(file.secure_url);
      setLoading(false);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      setLoading(false);
    }
  };

  // Enviar datos del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Por favor, sube una imagen antes de enviar.');
      return;
    }

    const payload = { ...formData, imageUrl: image };
    console.log('Datos a enviar:', payload);
    try {
      const response = await fetch('https://ls-sneakers-backend.vercel.app/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowModal(true); // Mostrar modal de confirmación
        setFormData({
          name: '',
          price: '',
          branch: '',
          gender: '',
          sizes: [],
          gender: '',
        });
        setImage('');
      } else {
        const error = await response.json();
        alert(`Error al crear el producto: ${error.message}`);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Error al enviar los datos.');
    }
  };

  return (
    <div className="form-container">
      <h1>Subir Producto</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del producto:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Precio:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange} 
            required
          />
        </div>

        <div className="form-group">
          <label>Categoría:</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Género:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione el género</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tallas disponibles:</label>
          <div className="checkbox-group">
            {availableSizes.map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  value={size}
                  checked={formData.sizes.includes(size)}
                  onChange={handleSizeChange}
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Imagen del producto:</label>
          <input type="file" name="file" onChange={uploadImage} required />
          {loading ? (
             <div className="loader"></div> // Loader animado
          ) : (
            image &&  <p>Imagen subida exitosamente.</p>
          )}
        </div>

        <button type="submit" className="submit-button">Crear Producto</button>
      </form>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Producto creado exitosamente.</p>
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProducts;
