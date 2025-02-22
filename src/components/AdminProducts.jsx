import React, { useState } from 'react';
import { BRANDS } from '../constans.js';
import "../css/adminpanel.css";

const AddProducts = () => {
  const preset_name = 'lsneakersuploadassets';
  const cloud_name = 'dj2v5y8li';

  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    branch: '',
    gender: '',
    sizes: [],
    onSale: false,
  });

  const sizesByGender = {
    Hombre: ['36 HOMBRE', '37 HOMBRE', '38 HOMBRE'],
    Mujer: ['36 MUJER', '37 MUJER', '38 MUJER'],
    Unisex: ['36 MUJER', '37 MUJER', '38 MUJER', '36 HOMBRE', '37 HOMBRE', '38 HOMBRE'],
  };

  const genders = ['Hombre', 'Mujer', 'Unisex'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      sizes: name === 'gender' ? [] : prev.sizes,
    }));
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      sizes: checked ? [...prev.sizes, value] : prev.sizes.filter((size) => size !== value),
    }));
  };

  const handleSelectAllSizes = (e) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      sizes: checked ? sizesByGender[formData.gender] || [] : [],
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      onSale: !prev.onSale,
      discountPrice: prev.onSale ? '' : prev.discountPrice,
    }));
  };

  const uploadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', preset_name);

    setLoading(true);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: 'POST',
        body: data,
      });
      const file = await response.json();
      setImage(file.secure_url);
      setLoading(false);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      setLoading(false);
    }
  };

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
        setShowModal(true);
        setFormData({
          name: '',
          price: '',
          discountPrice: '',
          branch: '',
          gender: '',
          sizes: [],
          onSale: false,
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
          <label>Categoría:</label>
          <select name="branch" value={formData.branch} onChange={handleInputChange} required>
            <option value="">Seleccione una categoría</option>
            {BRANDS.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
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
          <label>¿En promoción?</label>
          <label className="switch">
            <input type="checkbox" checked={formData.onSale} onChange={handleCheckboxChange} />
            <span className="slider round"></span>
          </label>
        </div>

        {formData.onSale && (
          <div className="form-group">
            <label>Precio con descuento:</label>
            <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleInputChange} required={formData.onSale} />
          </div>
        )}

        <div className="form-group">
          <label>Género:</label>
          <select name="gender" value={formData.gender} onChange={handleInputChange} required>
            <option value="">Seleccione el género</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>

        {formData.gender && (
          <div className="form-group">
            <label>Tallas disponibles:</label>
            <div className="checkbox-group">
              {sizesByGender[formData.gender].map((size) => (
                <label key={size}>
                  <input type="checkbox" value={size} checked={formData.sizes.includes(size)} onChange={handleSizeChange} />
                  {size}
                </label>
              ))}
            </div>
            <label>
              <input type="checkbox" onChange={handleSelectAllSizes} /> Seleccionar todas
            </label>
          </div>
        )}

        <div className="form-group">
          <label>Imagen del producto:</label>
          <input type="file" name="file" onChange={uploadImage} required />
          {loading ? (
            <div className="loader"></div> // Loader animado
          ) : (
            image && <p>Imagen subida exitosamente.</p>
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
