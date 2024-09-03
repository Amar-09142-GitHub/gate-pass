import React, { useState, useRef, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';

const CameraComponent = ({ onCapture }) => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
      } catch (err) {
        console.error('Error accessing camera: ', err);
        setError('Error accessing camera');
      }
    };

    getMediaStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch(err => {
          console.error('Error playing video: ', err);
          setError('Error playing video');
        });
      };
    }
  }, [stream]);

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], 'captured.png', { type: 'image/png' });
        const url = URL.createObjectURL(file);
        setCapturedImage(url);
        onCapture(file);
      } else {
        setError('Failed to capture image');
      }
    }, 'image/png');
  };

  const handleRecapture = async () => {
    setCapturedImage(null);
    setError(''); // Clear any previous error

    // Reinitialize the video stream
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
    } catch (err) {
      console.error('Error accessing camera: ', err);
      setError('Error accessing camera');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {error && <Typography color="error">{error}</Typography>}
      {capturedImage ? (
        <>
          <Box component="img" src={capturedImage} alt="Captured" sx={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }} />
          <Button variant="contained" color="primary" onClick={handleRecapture} sx={{ mt: 2 }}>
            Recapture
          </Button>
        </>
      ) : (
        <>
          <Box component="div" sx={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
            <video
              ref={videoRef}
              playsInline
              style={{ width: '100%', height: 'auto', borderRadius: '8px', background: '#000' }}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handleCapture} sx={{ mt: 2 }}>
            Capture
          </Button>
        </>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Box>
  );
};

export default CameraComponent;
