import React, { useState } from 'react';
import './AssetBrowser.css';

function AssetBrowser({ addAsset }) {
    const [selectedCategory, setSelectedCategory] = useState('3D Models');
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 8; // Change this value to adjust items per page

    // Hardcoded assets data
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
            { name: 'Red Brick Texture', file: '/assets/textures/red_brick_4k.zip', price: 'FREE', thumbnail: '/assets/thumbnails/red_brick_4k.png' },
            { name: 'Rocky Terrain', file: '/assets/textures/rocky_terrain_02_4k.zip', price: 'FREE', thumbnail: '/assets/thumbnails/rocky_terrain_02_4k.png' },
        ]
    };

    // Filter assets based on selected category and search query
    const filteredAssets = (assets[selectedCategory] || []).filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

    // Get current items for the current page
    const currentItems = filteredAssets.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    // Handle category selection
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentPage(0); // Reset to the first page when category changes
        setSearchQuery(''); // Reset search when changing categories
    };

    // Handle asset import
    const handleModelImport = (model) => {
        const confirmed = window.confirm(`Do you want to import ${model.name}?`);
        if (confirmed) {
            addAsset(model.name, model.file); // Pass the name and file path to the App component
            window.history.back(); // Return to the main page
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
            <hr />
            <div className='categories'>
                <button onClick={() => handleCategorySelect('3D Models')} className='category'>3D Models</button>
                <button onClick={() => handleCategorySelect('Lighting Profiles')} className='category'>Lighting Profiles [HDRIs]</button>
                <button onClick={() => handleCategorySelect('Materials & Textures')} className='category'>Materials & Textures</button>
                <button onClick={() => handleCategorySelect('Physics Model')} className='category'>Physics Models</button>
            </div>
            <hr />
            <div className='search'>
                <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='search_btn'
                />
            </div>
            <div className='category_content'>
                {currentItems.length > 0 ? (
                    <div className="asset-grid">
                        {currentItems.map((model, index) => (
                            <div className="asset-card" key={index}>
                                <div className="asset-thumbnail">
                                    <img src={model.thumbnail} alt={model.name} />
                                </div>
                                <div className="asset-title">{model.name}</div>
                                <div className="asset-price">{model.price}</div>
                                <button onClick={() => handleModelImport(model)} className="add-to-cart">Add to Cart</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>No assets found.</div>
                )}
            </div>
            <div className="pagination">
                <button onClick={goToPreviousPage} disabled={currentPage === 0}>Previous</button>
                <span>Page {currentPage + 1} of {totalPages}</span>
                <button onClick={goToNextPage} disabled={currentPage === totalPages - 1}>Next</button>
            </div>
        </div>
    );
}

export default AssetBrowser;
