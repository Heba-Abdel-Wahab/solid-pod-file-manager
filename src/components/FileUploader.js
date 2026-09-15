function FileUploader({ selectedFile, onFileChange, onUpload }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onUpload();
  };

  return (
    <form className="control-group" onSubmit={handleSubmit}>
      <label htmlFor="file-upload">Upload file</label>
      <div className="inline-control">
        <input
          id="file-upload"
          type="file"
          onChange={(event) => onFileChange(event.target.files?.[0] || null)}
        />
        <button className="button" type="submit" disabled={!selectedFile}>
          Upload
        </button>
      </div>
    </form>
  );
}

export default FileUploader;
