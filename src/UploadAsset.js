import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Import the Supabase client
import './UploadAsset.css'; // Import the CSS file for styling

function UploadAsset({ onUpload, selectedCategory }) {
    // State to store the file to upload (e.g., 3D model or HDR)
    const [file, setFile] = useState(null);

    // State to store the display image for the asset
    const [thumbnail, setDisplayImage] = useState(null);

    // State to store the name of the asset
    const [name, setname] = useState('');

    // State to track whether the upload is in progress
    const [uploading, setUploading] = useState(false);

    // State to control the visibility of the rules box
    const [showRules, setShowRules] = useState(false);

    // State to control the visibility of the modal for entering asset details
    const [showModal, setShowModal] = useState(false);

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && !selectedFile.name.endsWith('.fbx')) {
            alert('Only .fbx files are allowed.');
            e.target.value = ''; // Clear the file input
            return;
        }
        setFile(selectedFile);
    };

    // Handle display image selection
    const handleDisplayImageChange = (e) => {
        setDisplayImage(e.target.files[0]);
    };

    // Handle changes to the asset name input
    const handlenameChange = (e) => {
        setname(e.target.value);
    };

    // Handle the upload process
    const handleUpload = async () => {
        if (!file || !name || !thumbnail) {
            alert('Please provide a name, upload a file, and select a display image.');
            return;
        }

        setUploading(true);

        try {
            // Upload the main file (e.g., 3D model or HDR) to Supabase Storage
            const filePath = `${selectedCategory}/${name}-${Date.now()}-${file.name}`;
            const { error: fileUploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file);

            if (fileUploadError) {
                throw fileUploadError;
            }

            // Get the public URL of the uploaded file
            const { data: fileUrlData } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath);

            // Upload the display image to Supabase Storage
            const displayImagePath = `${selectedCategory}/display-images/${name}-${Date.now()}-${thumbnail.name}`;
            const { error: imageUploadError } = await supabase.storage
                .from('assets')
                .upload(displayImagePath, thumbnail);

            if (imageUploadError) {
                throw imageUploadError;
            }

            // Get the public URL of the display image
            const { data: displayImageUrlData } = supabase.storage
                .from('assets')
                .getPublicUrl(displayImagePath);

            // Create the asset object with the required structure
            const asset = {
                name: name, // Use the name provided by the user
                file: fileUrlData.publicUrl, // URL of the uploaded file
                price: "FREE", // Add "FREE" as the price
                thumbnail: displayImageUrlData.publicUrl, // URL of the display image
            };

            // Notify the parent component about the upload
            onUpload(asset, selectedCategory);

            // Reset the form
            setFile(null);
            setDisplayImage(null);
            setname('');
            setShowModal(false);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
        }
    };

    // Toggle the visibility of the rules box
    const handleRulesToggle = () => {
        setShowRules(!showRules);
    };

    // Toggle the visibility of the modal for entering asset details
    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    return (
        <div className="upload-asset-container">
            <h3>Upload Asset</h3>
            <div className="file-input-container">
                <label htmlFor="file-upload" className="custom-file-upload">
                    Choose File
                </label>
                <input id="file-upload" type="file" onChange={handleFileChange} />
                <span className="file-name">{file ? file.name : 'No file chosen'}</span>
                {selectedCategory === '3D Models' && (
                    <button onClick={handleRulesToggle} className="rules-btn">
                        ?
                    </button>
                )}
            </div>
            {selectedCategory === '3D Models' && showRules && (
                <div className="rules-box">
                    <h4>Upload Rules for 3D Models</h4>
                    <ul>
                        <li>Rule 1: Models must be in FBX format.</li>
                        <li>Rule 2: Maximum file size is 100MB.</li>
                        <li>Rule 3: Ensure the model is properly scaled.</li>
                        <li>Rule 4: You must upload an image of the model too.</li>
                        <li><b>NOTE:</b> The asset you upload will be available globally for any user who may use our service.</li>
                    </ul>
                </div>
            )}
            <button onClick={handleModalToggle} className="upload-btn" disabled={!file}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>

            {/* Modal for entering asset name and selecting display image */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Enter Asset Details</h3>
                        <div className="modal-content">
                            <label htmlFor="asset-name">Asset Name:</label>
                            <input
                                id="asset-name"
                                type="text"
                                value={name}
                                onChange={handlenameChange}
                                placeholder="Enter asset name"
                            />
                            <label htmlFor="display-image">Display Image:</label>
                            <input
                                id="display-image"
                                type="file"
                                onChange={handleDisplayImageChange}
                                accept="image/*"
                            />
                            <span className="file-name">
                                {thumbnail ? thumbnail.name : 'No image chosen'}
                            </span>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleModalToggle}>Cancel</button>
                            <button onClick={handleUpload} disabled={!name || !thumbnail || uploading}>
                                {uploading ? 'Uploading...' : 'Confirm Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadAsset;