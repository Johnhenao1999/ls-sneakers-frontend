import React from 'react';
import { useParams } from "react-router-dom";
import EditProduct from '../components/EditProduct';

function PageEditProduct() {
    const { id } = useParams();
    return (
        <div>
            <EditProduct productId={id}/>
        </div>
    );
}
 
export default PageEditProduct;
