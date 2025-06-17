import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { addPetAdditionalImages } from '../services/petService';
import { Box, Typography, Button } from '@mui/material';
import useApiActions from '../hooks/useApiActions';

const GallerySection = ({ additionalImages, petId, token }) => {
    const navigate = useNavigate();
    const [images, setImages] = useState(additionalImages || []);
    const [isChange, setIsChange] = useState(false);
    const { execute, loading, error } = useApiActions();

    const onAdditionalPhotosDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const newPhotos = acceptedFiles[0];
            const updatedAdditionalPhotos = [...images, newPhotos];
            setImages(updatedAdditionalPhotos);
            setIsChange(true);
        }
    };

    const handleDeletePhoto = (indexToDelete) => {
        setImages((prevPhotos) => prevPhotos.filter((_, index) => index !== indexToDelete));
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
        try {
            const formData = new FormData();
            images.forEach((image) => {
                formData.append('additionalImages', image);
            });
            await execute(addPetAdditionalImages, [formData, token, petId]);
            toast.success('Changes saved successfully!');
            setIsChange(false);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
            toast.error('Failed to save images changes. Please try again.');
        } 
    };

    return (
        <Box sx={{ backgroundColor: '#fff', boxShadow: 2, border: 1, borderColor: '#ccc', p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>Gallery</Typography>
            {images.length > 0 ? (
                <Box sx={{ display: 'flex', overflowX: 'auto', gap: '20px', padding: '10px', maxWidth: '80%' }}>
                    {images.map((photo, index) => (
                        <Box key={index} sx={{ position: 'relative', display: 'inline-block' }}>
                            <img
                                src={URL.createObjectURL(photo)}
                                alt={`Additional Photo ${index + 1}`}
                                style={{ width: '150px', borderRadius: '5px' }}
                            />
                            <FontAwesomeIcon 
                                icon={faTimes} 
                                onClick={() => handleDeletePhoto(index)} 
                                style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    cursor: 'pointer',
                                    zIndex: 1,
                                    color: '#f44336'
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography>No photos in the gallery yet.</Typography>
            )}

            <Box
                {...additionalPhotosDropzone.getRootProps()}
                sx={{
                    maxWidth: 'fit-content',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '2px dashed #ccc',
                    borderRadius: '5px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    padding: '10px',
                    mt: 2,
                }}
            >
                <input {...additionalPhotosDropzone.getInputProps()} />
                <Typography>Drag 'n' drop an image here, or click to select one</Typography>
            </Box>

            {isChange && (
                <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleChange}
                >
                    Save Changes
                </Button>
            )}
        </Box>
    );
};

export default GallerySection;
