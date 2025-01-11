function AssetGrid({ assets, onModelImport }) {
    return (
        <div className="category_content">
            {/* Check if there are assets to display */}
            {assets.length > 0 ? (
                <div className="asset-grid">
                    {/* Map through the assets and render each one */}
                    {assets.map((asset, index) => (
                        <div className="asset-card" key={index}>
                            {/* Thumbnail image for the asset */}
                            <div className="asset-thumbnail">
                                <img src={asset.thumbnail} alt={asset.name} />
                            </div>

                            {/* Name of the asset */}
                            <div className="asset-title">{asset.name}</div>

                            {/* Price of the asset (defaults to "FREE" if not provided) */}
                            <div className="asset-price">{asset.price || "FREE"}</div>

                            {/* Button to add the asset to the project */}
                            <button onClick={() => onModelImport(asset)} className="add-to-cart">
                                Add to Project
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                // Display a message if no assets are found
                <div>No valid assets found.</div>
            )}
        </div>
    );
}

export default AssetGrid;