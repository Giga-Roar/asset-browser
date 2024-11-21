import React, { useEffect, useState } from 'react';
// import { useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { useThree } from '@react-three/fiber';

function ImportedModel({ assetPath, isHDR }) {
    const { scene } = useThree(); // Access the Three.js scene
    const [fbx, setFbx] = useState(null); // State for FBX model

    // Load the FBX file if it is not an HDR file
    useEffect(() => {
        if (!isHDR) {
            const loader = new FBXLoader();
            loader.load(assetPath, (model) => {
                setFbx(model); // Set the loaded model to state
            });
        } else {
            // Load the HDR file and set it as background
            const hdrLoader = new RGBELoader();
            hdrLoader.load(assetPath, (texture) => {
                scene.background = texture; // Set the HDR texture as the scene background
                scene.environment = texture; // Optionally set it as the environment map for reflections
            });
        }

        return () => {
            // Clean up: Reset the scene background if necessary
            if (isHDR) {
                scene.background = null;
                scene.environment = null;
            }
        };
    }, [assetPath, isHDR, scene]);

    // Return the loaded FBX as a primitive object to render inside the mesh, if loaded
    return fbx ? <primitive object={fbx} scale={0.1} /> : null;
}

export default ImportedModel;
