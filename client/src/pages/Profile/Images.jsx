import { Button, Upload, message } from 'antd'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../redux/loaderSlice';
import { EditProduct, UploadProductImages } from '../../apicalls/products';

const Images = ({ selectedProduct, setShowProductForm,getData }) => {
    const [file = null, setFile] = useState(null);
    const [showPreview = false, setShowPreview] = useState(true);
    const [image = [], setImage] = useState(selectedProduct.image);
    const dispatch = useDispatch();
    
    const upload = async () =>{
        try {
            dispatch(SetLoader(true));
            // upload images to cloudinary
            const formData = new FormData();
            formData.append("file",file);
            formData.append("productId", selectedProduct._id);
            const response = await UploadProductImages(formData);
            dispatch(SetLoader(false));
            if(response.success){
                message.success(response.message);
                setImage([...image, response.data]);
                setShowPreview(false);
                setFile(null);
                // setFile([]);
                getData();
        
            } else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    }

    const deleteImage = async (images) =>{
        try {
            const updatedImagesArray = image.filter((img) =>img !== images);
            const updatedProduct = {...selectedProduct, image:updatedImagesArray};
            const response = await EditProduct( selectedProduct._id, updatedProduct);
            if(response.success){
                message.success(response.message);
                setImage(updatedImagesArray);
                setFile(null);
                getData();
            }else{
                throw new Error (response.message);
            }

            dispatch(SetLoader(true));
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    }

  return (
    <div>
        <div className='flex gap-5 mb-5'>
                {image.map((image) => {
                    return <div className=' flex gap-2 border border-solid border-gray-400 rounded p-2 items-end'>
                        <img className=' h-20 w-20 object-cover'
                        src={image} alt=''/>
                        <i className="ri-delete-bin-2-line cursor-pointer" onClick={()=> deleteImage(image)}></i>
                    </div>
                })}
            </div>
        <Upload 
        listType='picture'
        beforeUpload={()=>false}
            onChange={(info)=>{
                setFile(info.file);
                setShowPreview(true);
            }}
            fileList={file ? [file] : []}
            showUploadList={showPreview}
        >
            <Button type='dashed'>
                Upload Image
            </Button>
        </Upload>
        
        <div className=' flex justify-end gap-5 mt-5'>
            <Button type='default'
             onClick={() =>{
                setShowProductForm(false);
             }}
             >
                Cancel
             </Button>

             <Button
                type='primary'
                disabled={!file}
                onClick={upload}    
            >
                Upload

             </Button>
        </div>

    </div>
    
    
  )
}

export default Images