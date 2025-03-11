export const BRANDS = [
  'Adidas', 
  'Nike', 
  'Puma', 
  'Armani', 
  'New Balance', 
  'Reebok', 
  'Versace', 
  'Louis Vuitton', 
  'Gucci', 
  'Prada', 
  'Off-White', 
  'Naked Wolfe',
  'Jordan',
  'Calvin Klein',
  'Hugo Boss',
  'Coach',
  'Diesel',
  'Lacoste',
  'Lecoq Sportif',
  'Tommy Hilfiger'
];
export const sizesByGender = {
  Hombre: ['40 EUR - H', '41 EUR - H', '42 EUR - H', '43 EUR - H', '44 EUR - H'],
  Mujer: ['36 EUR - M', '37 EUR - M', '38 EUR - M', '39 EUR - M'],
  Unisex: [],
  Niños: ['28 EUR - N', '29 EUR - N', '30 EUR - N', '31 EUR - N', '32 EUR - N', '33 EUR - N', '34 EUR - N', '35 EUR - N'],
};
sizesByGender.Unisex = [...sizesByGender.Hombre, ...sizesByGender.Mujer];
export const genders = ['Hombre', 'Mujer', 'Niños','Unisex'];
