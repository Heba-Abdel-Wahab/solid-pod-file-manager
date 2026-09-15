function FileTable({ resources, status, onOpenFolder, onDownload }) {
  return (
    <div className="table-wrapper">
      <table className="file-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {resources.length === 0 && !status ? (
            <tr>
              <td colSpan="2" className="empty-state">
                This folder is empty.
              </td>
            </tr>
          ) : (
            resources.map((item) => (
              <tr key={item.url}>
                <td>
                  {item.isFolder ? (
                    <button
                      className="folder-link"
                      onClick={() => onOpenFolder(item.url)}
                    >
                      📁 {item.name}/
                    </button>
                  ) : (
                    <span>📄 {item.name}</span>
                  )}
                </td>
                <td>
                  {!item.isFolder && (
                    <button
                      className="button button-secondary"
                      onClick={() => onDownload(item.url, item.name)}
                    >
                      Download
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FileTable;
