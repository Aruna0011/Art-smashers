import React, { useState } from 'react';
import './ImagePicker.css';

const ImagePicker = ({ images, selected = [], onSelect, label }) => {
  const [search, setSearch] = useState('');
  const [showHints, setShowHints] = useState(false);

  // Ensure selected is always an array
  const selectedImages = Array.isArray(selected) ? selected : selected ? [selected] : [];
  console.log('ImagePicker selectedImages:', selectedImages);

  // Hints: filter from all images, exclude already selected
  const hintImages = images.filter(img =>
    img.toLowerCase().includes(search.toLowerCase()) && !selectedImages.includes(img)
  );

  return (
    <div className="image-picker">
      {label && <label className="image-picker-label">{label}</label>}
      <input
        type="text"
        className="image-picker-search"
        placeholder="Search images..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setShowHints(true);
        }}
        onFocus={() => setShowHints(true)}
        onBlur={() => setTimeout(() => setShowHints(false), 150)}
        autoComplete="off"
      />
      {showHints && search && hintImages.length > 0 && (
        <ul className="image-picker-hints">
          {hintImages.map(img => (
            <li
              key={img}
              className="image-picker-hint-item"
              onMouseDown={e => {
                e.preventDefault();
                if (!selectedImages.includes(img)) {
                  onSelect([...selectedImages, img]);
                }
                setSearch('');
                setShowHints(false);
              }}
            >
              {img.split('/').pop()}
            </li>
          ))}
        </ul>
      )}
      <div className="image-picker-grid">
        {selectedImages.length === 0 && (
          <div className="image-picker-empty">No image selected.</div>
        )}
        {selectedImages.map(img => (
          <div key={img} className="image-picker-thumb selected">
            <img src={new URL(`../assets/${img}`, import.meta.url).href} alt="" />
            <button
              className="image-picker-remove"
              onClick={() => onSelect(selectedImages.filter(i => i !== img))}
              title="Remove image"
              type="button"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePicker; 