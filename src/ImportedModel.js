import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as THREE from 'three';

function ImportedModel({ assetPath, isHDR }) {
    const { scene } = useThree();
    const [model, setModel] = useState(null);

    useEffect(() => {
        if (isHDR) {
            const hdrLoader = new RGBELoader();
            hdrLoader.load(
                assetPath,
                (texture) => {
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

                    setModel(loadedModel);
                },
                undefined,
                (error) => {
                    console.error('Error loading 3D model:', error);
                }
            );
        }

        return () => {
            if (isHDR) {
                scene.background = null;
                scene.environment = null;
            } else if (model) {
                scene.remove(model);
            }
        };
    }, [assetPath, isHDR, scene, model]);

    return model ? <primitive object={model} /> : null;
}

export default ImportedModel;