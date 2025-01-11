import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AssetBrowser from './AssetBrowser';
import ImportedModel from './ImportedModel';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import './App.css';

function App() {
  // State to store the list of assets added to the project
  const [assets, setAssets] = useState([]);

  // State to track the currently active asset (e.g., the one being displayed in the canvas)
  const [activeAsset, setActiveAsset] = useState(null);

  // State to store the HDR background file (used for lighting profiles)
  const [hdrBackground, setHdrBackground] = useState(null);

  // Function to add an asset to the project
  // If the asset is a lighting profile or HDR file, set it as the background
  // Otherwise, add it to the list of assets and set it as the active asset
  const addAsset = (assetName, assetFile, type) => {
    if (type === 'Lighting Profile' || assetFile.endsWith('.hdr')) {
      setHdrBackground(assetFile); // Set HDR as the background
    } else {
      setAssets((prevAssets) => [...prevAssets, { name: assetName, file: assetFile }]);
      setActiveAsset({ name: assetName, file: assetFile });
    }
  };

  return (
    // Main router to handle navigation between the home page and asset browser
    <Router>
      <Routes>
        {/* Home route: Displays the 3D canvas and asset list */}
        <Route
          path="/"
          element={
            <div className="app-container">
              {/* 3D Canvas for rendering assets */}
              <div className="canvas-container">
                <Canvas
                  camera={{
                    position: [5, 5, 10], // Camera is positioned at [5, 5, 10]
                    fov: 45, // Field of view is set to 45 degrees
                  }}
                >
                  {/* Ambient and directional lighting for the scene */}
                  <ambientLight intensity={1.5} />
                  <directionalLight position={[10, 10, 5]} intensity={1.5} />

                  {/* Suspense for lazy loading assets */}
                  <Suspense fallback={null}>
                    {/* Render the active asset if it exists */}
                    {activeAsset && (
                      <ImportedModel
                        assetPath={activeAsset.file}
                        isHDR={activeAsset.file.endsWith('.hdr')}
                      />
                    )}

                    {/* Set the HDR background if it exists */}
                    {hdrBackground && <Environment files={hdrBackground} background />}
                  </Suspense>

                  {/* OrbitControls for camera navigation (allows users to rotate, zoom, and pan the camera) */}
                  <OrbitControls />
                </Canvas>
              </div>

              {/* Asset browser section: Displays a link to the asset store and the list of added assets */}
              <div className="asset-browser-container">
                {/* Link to navigate to the asset browser */}
                <Link to="/asset-browser" className="asset-store-btn">
                  Asset Store
                </Link>
                <hr />

                {/* List of added assets */}
                <div className="asset-list">
                  <h3>Assets</h3>
                  <hr />
                  {assets.length > 0 ? (
                    assets.map((asset, index) => (
                      <div key={index} className="asset-item">
                        {/* Button to set the asset as active */}
                        <button onClick={() => setActiveAsset(asset)} className="asset_btn">
                          {asset.name}
                        </button>
                        <hr />
                      </div>
                    ))
                  ) : (
                    <div>No assets added yet.</div>
                  )}
                </div>
              </div>
            </div>
          }
        />

        {/* Route for the asset browser: Allows users to browse and add assets */}
        <Route path="/asset-browser" element={<AssetBrowser addAsset={addAsset} />} />
      </Routes>
    </Router>
  );
}

export default App;