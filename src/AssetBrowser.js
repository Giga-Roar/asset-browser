import React, { useState } from 'react';
import './AssetBrowser.css';
import CategorySelector from './CategorySelector';
import SearchBar from './SearchBar';
import AssetGrid from './AssetGrid';
import Pagination from './Pagination';

function AssetBrowser({ addAsset }) {
    const [selectedCategory, setSelectedCategory] = useState('3D Models');
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUploadButtons, setShowUploadButtons] = useState(false); // State for showing the buttons
    const [selectedFBXFile, setSelectedFBXFile] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const setAssets = useState(null);

    const itemsPerPage = 8;

    // Hardcoded assets data (kept the same as original)
    const assets = {
        "3D Models": [
            { name: 'Cube', file: '/assets/models/Cube.fbx', price: 'FREE', thumbnail: "/assets/thumbnails/Cube.png" },
            { name: 'Cylinder', file: '/assets/models/Cylinder.fbx', price: 'FREE', thumbnail: "/assets/thumbnails/Cylinder.png" },
            { name: 'Donut', file: '/assets/models/donut.fbx', price: 'FREE', thumbnail: "/assets/thumbnails/Donut.png" },
            { name: 'Table', file: '/assets/models/table.fbx', price: 'FREE', thumbnail: "/assets/thumbnails/Table.png" },
            { name: 'Chair', file: '/assets/models/Chair.fbx', price: 'FREE', thumbnail: "/assets/thumbnails/Chair.png" },
            { name: 'Axe', file: '/assets/models/Axe.fbx', price: 'FREE', thumbnail: "/assets/thumbnails/Axe.png" },
            { name: 'Timba', file: '/assets/models/Timba.fbx', price: 'FREE', thumbnail: "/assets/thumbnails/Timba.png" },
            { name: 'Pikachu', file: '/assets/models/Pikachu.fbx', price: 'FREE', thumbnail: "/assets/thumbnails/Pikachu.png" },
            { name: 'Iron Man', file: '/assets/models/Iron Man.fbx', price: 'FREE', thumbnail: "/assets/thumbnails/Iron Man.png" },
        ],
        "Lighting Profiles": [
            { name: 'Autumn Field', file: '/assets/HDRIs/autumn_field_puresky_4k.hdr', price: 'FREE', thumbnail: '/assets/thumbnails/Autumn Field.png' },
            { name: 'Goegap Road', file: '/assets/HDRIs/goegap_road_4k.hdr', price: 'FREE', thumbnail: '/assets/thumbnails/Goegap road.png' },
            { name: 'Qwantani Sunrise', file: '/assets/HDRIs/qwantani_sunrise_4k.hdr', price: 'FREE', thumbnail: '/assets/thumbnails/Qwantani Sunrise.png' },
            { name: 'Wildflower Field', file: '/assets/HDRIs/wildflower_field_4k.hdr', price: 'FREE', thumbnail: '/assets/thumbnails/Wildflower Field.png' },
            { name: 'Blue Photo Studio', file: '/assets/HDRIs/blue_photo_studio_4k.hdr', price: 'FREE', thumbnail: '/assets/thumbnails/Blue Photo Studio.png' },
            { name: 'Brown Photo Studio', file: '/assets/HDRIs/brown_photostudio_02_4k.hdr', price: 'FREE', thumbnail: '/assets/thumbnails/Brown Photo Studio.png' },
            { name: 'Christmas Photo Studio', file: '/assets/HDRIs/christmas_photo_studio_01_4k.hdr', price: 'FREE', thumbnail: '/assets/thumbnails/Christmas Photo Studio.png' },
            { name: 'Small Studio', file: '/assets/HDRIs/studio_small_06_4k.hdr', price: 'FREE', thumbnail: '/assets/thumbnails/Small Studio.png' },
        ],
        "Materials & Textures": [
            { name: 'Red Brick', file: '/assets/M_T/red_brick_4k.zip', price: 'FREE', thumbnail: '/assets/thumbnails/red_brick_4k.jpg' },
            { name: 'Rocky Terrain', file: '/assets/M_T/rocky_terrain_02_4k.zip', price: 'FREE', thumbnail: '/assets/thumbnails/rocky_terrain_02_4k.jpg' },
            { name: 'Cliff Side', file: '/assets/M_T/cliff_side_4k.zip', price: 'FREE', thumbnail: '/assets/thumbnails/cliff_side_4k.jpg' },
            { name: 'Rusty metal grid', file: '/assets/M_T/rusty_metal_grid_4k.zip', price: 'FREE', thumbnail: '/assets/thumbnails/rusty_metal_grid_4k.jpg' },
            { name: 'Brick pavement', file: '/assets/M_T/brick_pavement_02_4k.zip', price: 'FREE', thumbnail: '/assets/thumbnails/brick_pavement_02_4k.jpg' },
        ]
    };

    // Filter assets based on selected category and search query
    const filteredAssets = (assets[selectedCategory] || []).filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

    // Get current items for the current page
    const currentItems = filteredAssets.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // Handle category selection
    const handleCategorySelect = (category) => {
        const normalizedCategory = category === 'Lighting Profiles [HDRIs]'
            ? 'Lighting Profiles'
            : category;

        setSelectedCategory(normalizedCategory);
        setCurrentPage(0);
        setSearchQuery('');
    };

    // Handle asset import
    const handleModelImport = (model) => {
        const confirmed = window.confirm(`Do you want to import ${model.name}?`);
        if (confirmed) {
            addAsset(model.name, model.file);
            window.history.back();
        }
    };

    // Handle file upload and show instructions in an alert box
    const handleFileUpload = () => {
        alert("Only .fbx files are accepted, and the image file should have the same name as the .fbx file. The uploaded assets will be available for everyone using the Asset Store.");
        setShowUploadButtons(true); // Show upload buttons after the alert
    };

    // Handle file selection for FBX and image
    const handleFBXFileChange = (event) => {
        setSelectedFBXFile(event.target.files[0]);
    };

    const handleImageFileChange = (event) => {
        setSelectedImageFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (
            selectedFBXFile &&
            selectedImageFile &&
            selectedFBXFile.name.split('.')[0] === selectedImageFile.name.split('.')[0]
        ) {
            // Handle the file upload logic
            const formData = new FormData();
            formData.append('fbx', selectedFBXFile);
            formData.append('image', selectedImageFile);

            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Asset uploaded successfully!");
                        // Add asset to the list or do any further actions
                    } else {
                        alert("Failed to upload asset: " + data.message);
                    }
                })
                .catch(error => {
                    console.error("Error uploading files:", error);
                    alert("Error uploading files: " + error.message);
                });
        } else {
            alert("Please ensure the FBX and image file names match.");
        }
    };

    const uploadFiles = async (files) => {
        const formData = new FormData();
        formData.append('fbx', files.fbx);
        formData.append('image', files.image);

        try {
            const response = await fetch('http://localhost:3001/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();  // This is where the error occurs
            console.log(data);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    // Handle pagination
    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <h1>Asset Store</h1>
            <button className="upload-button" onClick={handleFileUpload}>Upload Asset</button>
            {/* Upload buttons shown after alert */}
            {showUploadButtons && (
                <div className="upload-section">
                    <input type="file" accept=".fbx" onChange={handleFBXFileChange} />
                    <input type="file" accept=".png, .jpg, .jpeg" onChange={handleImageFileChange} />
                    <button onClick={handleUpload}>Upload</button>
                </div>
            )}
            <hr />
            <CategorySelector
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
            />
            <hr />
            <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
            <AssetGrid
                assets={currentItems}
                onModelImport={handleModelImport}
                selectedCategory={selectedCategory}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNextPage={goToNextPage}
                onPreviousPage={goToPreviousPage}
            />
        </div>
    );
}

export default AssetBrowser;