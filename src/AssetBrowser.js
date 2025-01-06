import React, { useState, useEffect } from 'react';
import './AssetBrowser.css';
import CategorySelector from './CategorySelector';
import SearchBar from './SearchBar';
import AssetGrid from './AssetGrid';
import Pagination from './Pagination';

function AssetBrowser({ addAsset }) {
    const [selectedCategory, setSelectedCategory] = useState('3D Models');
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [assets, setAssets] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/assets.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch assets');
                }
                return response.json();
            })
            .then((data) => {
                setAssets(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching assets:', error);
                setLoading(false);
            });
    }, []);

    const itemsPerPage = 8;
    const filteredAssets = (assets[selectedCategory] || []).filter((asset) =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
    const currentItems = filteredAssets.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentPage(0);
        setSearchQuery('');
    };

    const handleModelImport = (asset) => {
        const confirmed = window.confirm(`Do you want to import ${asset.name}?`);
        if (confirmed) {
            if (asset.maps) {
                // If the asset has maps (textures), add all maps to the project
                Object.entries(asset.maps).forEach(([mapType, mapPath]) => {
                    addAsset(`${asset.name} (${mapType})`, mapPath);
                });
            } else {
                // If it's a regular asset (e.g., 3D model), add it directly
                addAsset(asset.name, asset.file);
            }
            window.history.back();
        }
    };

    return (
        <div>
            <h1>Asset Store</h1>
            <hr />
            <CategorySelector selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} />
            <hr />
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            {loading ? (
                <div>Loading assets...</div>
            ) : (
                <>
                    <AssetGrid assets={currentItems} onModelImport={handleModelImport} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onNextPage={() => setCurrentPage(currentPage + 1)}
                        onPreviousPage={() => setCurrentPage(currentPage - 1)}
                    />
                </>
            )}
        </div>
    );
}

export default AssetBrowser;