const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set destination based on file type
        if (file.mimetype === 'application/octet-stream' || file.mimetype === 'model/fbx') {
            cb(null, 'public/assets/models'); // FBX files
        } else if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, 'public/assets/thumbnails'); // Image files (thumbnails)
        } else {
            cb(new Error('Invalid file type'), false);
        }
    },
    filename: function (req, file, cb) {
        // Set filename to be the same as the original file's name
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Define route for handling file uploads
app.post('/api/upload', upload.fields([{ name: 'fbx' }, { name: 'image' }]), (req, res) => {
    if (!req.files.fbx || !req.files.image) {
        return res.status(400).json({ success: false, message: 'Both FBX and image files are required.' });
    }

    const fbxFile = req.files.fbx[0];
    const imageFile = req.files.image[0];

    // You can add additional validation or processing here

    res.json({ success: true, message: 'Files uploaded successfully!' });
});

// Start the server
app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});