import React from 'react';

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
                            <button onClick={() => onModelImport(asset)} className="add-to-cart">
                                Add to Project
                            </button>
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