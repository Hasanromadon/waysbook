import React from 'react';

const InputFile = ({ title, onChange, border }) => {
  return (
    <div>
      <label
        className={`btn bg-gray file-upload-label ${border ? 'border' : ''}`}
        htmlFor="file-upload"
      >
        {title}{' '}
        <img className="ms-1" height={18} src="/assets/icons/clip.svg" alt="" />
      </label>
      <input onChange={(e) => onChange(e)} id="file-upload" type="file" />
    </div>
  );
};

export default InputFile;
