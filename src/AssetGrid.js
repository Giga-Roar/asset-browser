function AssetGrid({ assets, onModelImport }) {
    return (
        <div className="category_content">
            {assets.length > 0 ? (
                <div className="asset-grid">
                    {assets.map((asset, index) => (
                        <div className="asset-card" key={index}>
                            <div className="asset-thumbnail">
                                <img src={asset.thumbnail} alt={asset.name} />
                            </div>
                            <div className="asset-title">{asset.name}</div>
                            <div className="asset-price">{asset.price || "FREE"}</div> {/* Default to "FREE" if price is missing */}
                            <button onClick={() => onModelImport(asset)} className="add-to-cart">
                                Add to Project
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No valid assets found.</div>
            )}
        </div>
    );
}

export default AssetGrid