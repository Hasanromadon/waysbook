import React from 'react';

const InputFileImage = ({ title, onChange, border }) => {
  return (
    <div>
      <label
        className={`btn bg-gray file-upload-label ${border ? 'border' : ''}`}
        htmlFor="file-image-upload"
      >
        {title}{' '}
        <img className="ms-1" height={18} src="/assets/icons/clip.svg" alt="" />
      </label>
      <input
        onChange={(e) => onChange(e)}
        id="file-image-upload"
        type="file"
        accept="image/*"
      />
    </div>
  );
};

export default InputFileImage;
