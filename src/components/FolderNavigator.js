function FolderNavigator({ currentUrl, canGoBack, onBack }) {
  return (
    <div className="folder-navigation">
      <div className="current-url" title={currentUrl}>
        {currentUrl}
      </div>

      {canGoBack && (
        <button className="button button-secondary" onClick={onBack}>
          ← Back
        </button>
      )}
    </div>
  );
}

export default FolderNavigator;
