import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { storage, firestore } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
import axios from 'axios';


// const apiK = process.env.API_KEY;
require('dotenv').config();
console.log("OpenAI API Key:", process.env.REACT_APP_OPENAI_API_KEY);
const Camera = ({updateInventory, setValue, setAlertMessage, setAlertOpen}) => {
    const webcamRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [open, setOpen] = useState(false);
    const [classificationContent, setClassificationContent] = useState(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImageSrc(imageSrc);
        setOpen(true); // Open the modal when the photo is captured
    }, [webcamRef]);
    const uploadImage = async (imageSrc) => {
        
            const blob = await fetch(imageSrc).then(res => res.blob());
            const storageRef = ref(storage, `images/${Date.now()}.jpg`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            console.log('Uploaded image URL:', downloadURL);
            // You can now use this URL for further processing or display
            // setOpen(false);
            return downloadURL;
        
    };


    const callVisionAPI = async (imageURL) => {
        const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        console.log(apiKey);
        const url = 'https://api.openai.com/v1/chat/completions';
        const data = {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "tell me what the person is holding, just one word"
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageURL
                            }
                        }
                    ]
                }
            ],
            max_tokens: 300
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        };

        try {
            const response = await axios.post(url, data, { headers });
            const content = response.data.choices[0].message.content;
            return content;
            
        } catch (error) {
            console.error('Error calling Vision API:', error);
        }
    }
    const handleUploadAndClassify = async () => {
        const imageUrl = await uploadImage(imageSrc);
        const resultContent = await callVisionAPI(imageUrl);
        setClassificationContent(resultContent);
        console.log('Vision API Result:', resultContent);
        if (resultContent) {
            const docRef = doc(collection(firestore, "inventory"), resultContent);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const { quantity } = docSnap.data();
              await setDoc(docRef, { quantity: quantity + 1 });
            } else {
              await setDoc(docRef, { quantity: 1 });
            }
            updateInventory();
            handleClose();
            setValue(0);
            setAlertMessage(`Congrats! "${resultContent}" has been added to your inventory🥳`);
            setAlertOpen(true);
          }
        
    };

    const handleClose = () => {
        setOpen(false);
        setClassificationContent(null);
    };
    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Typography variant="h6">Take a Photo</Typography>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={400}
            />
            <Button variant="contained" color="primary" onClick={capture}>
                Capture Photo
            </Button>

            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box position="absolute" top="50%" left="50%" bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: "translate(-50%, -50%)" }}>
                    <Typography variant="h6" component="h2">Confirm Upload</Typography>
                    {imageSrc && (
                        <img src={imageSrc} alt="Captured" style={{ width: '100%' }} />
                    )}
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button variant="contained" color="secondary" onClick={handleUploadAndClassify}>
                            Upload and Classify
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => setOpen(false)}>
                            Retake Photo
                        </Button>
                    </Stack>
                    {classificationContent && (
                        <Typography variant="body1" component="p" mt={2}>
                            Classification Result: {classificationContent}
                            
                        </Typography>
                    )}
                </Box>
            </Modal>
        </Box>
    );


};

export default Camera;