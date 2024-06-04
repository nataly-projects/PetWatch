import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { addPetAdditionalImages } from '../services/petService';
import '../styles/section.css';

const GallerySection = ({additionalImages, petId, token}) => {
    const navigate = useNavigate();

    const [images, setImages] = useState(additionalImages || []);
    const [isChange, setIsChange] = useState(false);

    const onAdditionalPhotosDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const newPhotos = acceptedFiles[0];
            const updatedAdiitionalPhotos = [...images, newPhotos];
            setImages(updatedAdiitionalPhotos);
            setIsChange(true);
        }
    };

    const handleDeletePhoto = (indexToDelete) => {
        setImages((prevPhotos) => prevPhotos.filter((photo, index) => index !== indexToDelete));
        setIsChange(true);
    };

    const additionalPhotosDropzone = useDropzone({
        onDrop: onAdditionalPhotosDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
        },
        multiple: true,
    });

    const handleChange = async () => {
        try{
            const formData = new FormData();
            images.forEach((image) => {
                formData.append('additionalImages', image);
            });
            await addPetAdditionalImages(formData, token, petId);
            toast.success('Changes saved successfully!');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('UNAUTHORIZED_ERROR');
                navigate('/login');
            }
            toast.error('Failed to save images changes. Please try again.');
        } 
    };
  
  
    return (
        <div className="section">
            <h3>Gallery</h3>
            { images && images.length > 0 
            ?
            (<>
                {images.length > 0 && (
                <div className="additional-photos">
                    {images.map((photo, index) => (
                    <div key={index} className="additional-photo-wrapper">
                        <img
                        key={index}
                        className="additional-photo"
                        src={URL.createObjectURL(photo)}
                        alt={`Additional Photo ${index + 1}`}
                        />
                        <FontAwesomeIcon icon={faTimes} className='delete-photo-icon' onClick={() => handleDeletePhoto(index)}/>
                    </div>
                    ))}
                </div>
                )}
            </>)  
            :
            <p>No photos in the gallery yet.</p>  
        }

        <div className="upload-overlay" {...additionalPhotosDropzone.getRootProps()}>
          <input {...additionalPhotosDropzone.getInputProps()} />
          <p>Drag 'n' drop an image here, or click to select one</p>
        </div>   

        {isChange && <button className='btn' onClick={handleChange}>Save Changes</button>}

      </div>
    );
  };

export default GallerySection;
