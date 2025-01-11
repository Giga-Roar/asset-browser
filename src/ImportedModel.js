import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as THREE from 'three';

function ImportedModel({ assetPath, isHDR }) {
    // Access the Three.js scene
    const { scene } = useThree();

    // State to store the loaded 3D model
    const [model, setModel] = useState(null);

    useEffect(() => {
        if (isHDR) {
            // Load an HDR environment map if the asset is an HDR file
            const hdrLoader = new RGBELoader();
            hdrLoader.load(
                assetPath,
                (texture) => {
                    // Set the texture mapping and apply it as the background and environment map
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    scene.background = texture; // Set HDRI as the background
                    scene.environment = texture; // Set HDRI as the environment map for lighting
                },
                undefined,
                (error) => {
                    console.error('Error loading HDRI:', error);
                }
            );
        } else {
            // Load a 3D model if the asset is not an HDR file
            const fbxLoader = new FBXLoader();
            fbxLoader.load(
                assetPath,
                (loadedModel) => {
                    // Scale and position the model
                    loadedModel.scale.set(0.1, 0.1, 0.1);
                    loadedModel.position.set(0, 0, 0);

                    // Ensure the model's materials use the environment map
                    loadedModel.traverse((child) => {
                        if (child.isMesh && child.material) {
                            child.material.envMap = scene.environment; // Apply HDRI environment map
                            child.material.needsUpdate = true; // Ensure the material updates
                        }
                    });

                    // Store the loaded model in state
                    setModel(loadedModel);
                },
                undefined,
                (error) => {
                    console.error('Error loading 3D model:', error);
                }
            );
        }

        // Cleanup function to remove the model or HDR environment when the component unmounts
        return () => {
            if (isHDR) {
                // Remove the HDR background and environment map
                scene.background = null;
                scene.environment = null;
            } else if (model) {
                // Remove the 3D model from the scene
                scene.remove(model);
            }
        };
    }, [assetPath, isHDR, scene, model]); // Re-run the effect if any of these dependencies change

    // Render the 3D model if it has been loaded
    return model ? <primitive object={model} /> : null;
}

export default ImportedModel;