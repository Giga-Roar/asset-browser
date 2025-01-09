import React, { useState, useEffect } from 'react';
import './AssetBrowser.css';
import CategorySelector from './CategorySelector';
import SearchBar from './SearchBar';
import AssetGrid from './AssetGrid';
import Pagination from './Pagination';
import UploadAsset from './UploadAsset';
import { supabase } from './supabaseClient';

function AssetBrowser({ addAsset }) {
    const [selectedCategory, setSelectedCategory] = useState('3D Models');
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [assets, setAssets] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch default assets from the JSON file
    useEffect(() => {
        fetch('/assets.json')
            .then((response) => response.json())
            .then((data) => {
                setAssets(data); // Set default assets
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching assets:', error);
                setLoading(false);
            });
    }, []);

    // Fetch uploaded assets from Supabase Storage
    useEffect(() => {
        const fetchUploadedAssets = async () => {
            try {
                const { data, error } = await supabase.storage
                    .from('assets')
                    .list(selectedCategory);

                if (error) throw error;

                const uploadedAssets = await Promise.all(
                    data.map(async (file) => {
                        const { data: urlData } = supabase.storage
                            .from('assets')
                            .getPublicUrl(`${selectedCategory}/${file.name}`);
                        return { name: file.name, file: urlData.publicUrl };
                    })
                );

                setAssets((prevAssets) => ({
                    ...prevAssets,
                    [selectedCategory]: [...(prevAssets[selectedCategory] || []), ...uploadedAssets],
                }));
            } catch (error) {
                console.error('Error fetching uploaded assets:', error);
            }
        };

        if (selectedCategory === '3D Models' || selectedCategory === 'Lighting Profiles') {
            fetchUploadedAssets();
        }
    }, [selectedCategory]);

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

    const handleUpload = async (assetName, fileUrl, displayImageUrl, category) => {
        setAssets((prevAssets) => ({
            ...prevAssets,
            [category]: [
                ...(prevAssets[category] || []),
                { name: assetName, file: fileUrl, displayImage: displayImageUrl },
            ],
        }));
    };

    const isUploadAllowed = selectedCategory === '3D Models' || selectedCategory === 'Lighting Profiles';

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
                    {isUploadAllowed && (
                        <UploadAsset onUpload={handleUpload} selectedCategory={selectedCategory} />
                    )}
                </>
            )}
        </div>
    );
}

export default AssetBrowser;