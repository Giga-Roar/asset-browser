import React from 'react';

function CategorySelector({ selectedCategory, onCategorySelect }) {
    const categories = [
        '3D Models',
        'Lighting Profiles',
        'Materials & Textures',
        'Physics Models'
    ];

    return (
        <div className='categories'>
            {categories.map((category, index) => (
                <button
                    key={index}
                    onClick={() => onCategorySelect(category)}
                    className={`category ${selectedCategory === (category === 'Lighting Profiles [HDRIs]' ? 'Lighting Profiles' : category) ? 'active' : ''}`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}

export default CategorySelector;