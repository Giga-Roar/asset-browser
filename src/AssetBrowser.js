import React, { useState, useEffect } from 'react';
import './AssetBrowser.css';
import CategorySelector from './CategorySelector';
import SearchBar from './SearchBar';
import AssetGrid from './AssetGrid';
import Pagination from './Pagination';
import UploadAsset from './UploadAsset';
import { supabase } from './supabaseClient';

function AssetBrowser({ addAsset }) {
    // State to track the currently selected category (e.g., 3D Models, Lighting Profiles)
    const [selectedCategory, setSelectedCategory] = useState('3D Models');

    // State to track the current page for pagination
    const [currentPage, setCurrentPage] = useState(0);

    // State to store the search query for filtering assets
    const [searchQuery, setSearchQuery] = useState('');

    // State to store the list of assets (both default and uploaded)
    const [assets, setAssets] = useState({});

    // State to track whether assets are still loading
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
                // List files in the selected category from Supabase Storage
                const { data, error } = await supabase.storage
                    .from('assets')
                    .list(selectedCategory);

                if (error) throw error;

                // Fetch public URLs for each file and create asset objects
                const uploadedAssets = await Promise.all(
                    data
                        .filter(file => !file.name.startsWith('.empty')) // Filter out empty placeholders
                        .map(async (file) => {
                            const { data: urlData } = supabase.storage
                                .from('assets')
                                .getPublicUrl(`${selectedCategory}/${file.name}`);
                            return { name: file.name, file: urlData.publicUrl };
                        })
                );

                // Merge uploaded assets with existing assets
                setAssets((prevAssets) => ({
                    ...prevAssets,
                    [selectedCategory]: [...(prevAssets[selectedCategory] || []), ...uploadedAssets],
                }));
            } catch (error) {
                console.error('Error fetching uploaded assets:', error);
            }
        };

        // Fetch uploaded assets only for specific categories
        if (selectedCategory === '3D Models' || selectedCategory === 'Lighting Profiles') {
            fetchUploadedAssets();
        }
    }, [selectedCategory]);

    // Pagination and filtering logic
    const itemsPerPage = 8; // Number of assets to display per page
    const filteredAssets = (assets[selectedCategory] || []).filter((asset) =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) && // Filter by search query
        !asset.name.startsWith('.empty') && // Exclude empty placeholders
        !asset.name.includes('display-images') // Exclude display-images entries
    );

    const totalPages = Math.ceil(filteredAssets.length / itemsPerPage); // Calculate total pages
    const currentItems = filteredAssets.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage); // Get assets for the current page

    // Handle category selection
    const handleCategorySelect = (category) => {
        setSelectedCategory(category); // Update selected category
        setCurrentPage(0); // Reset to the first page
        setSearchQuery(''); // Clear the search query
    };

    // Handle importing an asset into the project
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
            window.history.back(); // Navigate back to the previous page
        }
    };

    // Handle uploading a new asset
    const handleUpload = async (asset, category) => {
        setAssets((prevAssets) => ({
            ...prevAssets,
            [category]: [
                ...(prevAssets[category] || []),
                asset, // Add the new asset with the correct structure
            ],
        }));
    };

    // Check if uploading is allowed for the selected category
    const isUploadAllowed = selectedCategory === '3D Models' || selectedCategory === 'Lighting Profiles';

    return (
        <div>
            <h1>Asset Store</h1>
            <hr />
            {/* Category selector for choosing the asset category */}
            <CategorySelector selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} />
            <hr />
            {/* Search bar for filtering assets by name */}
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            {loading ? (
                <div>Loading assets...</div>
            ) : (
                <>
                    {/* Grid to display the current page of assets */}
                    <AssetGrid assets={currentItems} onModelImport={handleModelImport} />
                    {/* Pagination controls for navigating between pages */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onNextPage={() => setCurrentPage(currentPage + 1)}
                        onPreviousPage={() => setCurrentPage(currentPage - 1)}
                    />
                    {/* Upload asset component (only shown for allowed categories) */}
                    {isUploadAllowed && (
                        <UploadAsset onUpload={handleUpload} selectedCategory={selectedCategory} />
                    )}
                </>
            )}
        </div>
    );
}

export default AssetBrowser;