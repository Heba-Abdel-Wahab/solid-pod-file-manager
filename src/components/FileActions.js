function FileActions({ folderName, onFolderNameChange, onCreateFolder }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onCreateFolder();
  };

  return (
    <form className="control-group" onSubmit={handleSubmit}>
      <label htmlFor="folder-name">New folder</label>
      <div className="inline-control">
        <input
          id="folder-name"
          type="text"
          placeholder="e.g. documents"
          value={folderName}
          onChange={(event) => onFolderNameChange(event.target.value)}
        />
        <button className="button" type="submit" disabled={!folderName.trim()}>
          Create
        </button>
      </div>
    </form>
  );
}

export default FileActions;
