import React from 'react';

function AssetGrid({ assets, onModelImport, selectedCategory }) {

    // Handle download of zip files dynamically
    const handleDownload = (filePath, assetName) => {
        // Create a new anchor element
        const link = document.createElement('a');
        link.href = filePath;  // Path to the zip file (relative to public folder)
        link.download = assetName;  // Set the filename for download

        // Ensure the download is triggered by adding and clicking the link programmatically
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className='category_content'>
            {assets.length > 0 ? (
                <div className="asset-grid">
                    {assets.map((asset, index) => (
                        <div className="asset-card" key={index}>
                            <div className="asset-thumbnail">
                                <img src={asset.thumbnail} alt={asset.name} />
                            </div>
                            <div className="asset-title">{asset.name}</div>
                            <div className="asset-price">{asset.price}</div>
                            {selectedCategory === 'Materials & Textures' ? (
                                // Show download button for Materials & Textures
                                <button
                                    onClick={() => handleDownload(asset.file, asset.name)} // Dynamically trigger download for the asset
                                    className="add-to-cart"
                                >
                                    Download
                                </button>
                            ) : (
                                <button
                                    onClick={() => onModelImport(asset)}
                                    className="add-to-cart"
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div>No assets found.</div>
            )}
        </div>
    );
}

export default AssetGrid;
