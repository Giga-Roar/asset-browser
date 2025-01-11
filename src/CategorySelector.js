import React from 'react';

function CategorySelector({ selectedCategory, onCategorySelect }) {
    // List of available categories
    const categories = [
        '3D Models',
        'Lighting Profiles',
        'Materials & Textures',
        'Physics Models'
    ];

    return (
        <div className='categories'>
            {/* Map through the categories and render a button for each */}
            {categories.map((category, index) => (
                <button
                    key={index} // Unique key for each button
                    onClick={() => onCategorySelect(category)} // Handle category selection
                    className={`category ${selectedCategory === (category === 'Lighting Profiles [HDRIs]' ? 'Lighting Profiles' : category) ? 'active' : ''}`} // Apply 'active' class if the category is selected
                >
                    {/* Display the category name */}
                    {category}
                </button>
            ))}
        </div>
    );
}

export default CategorySelector;