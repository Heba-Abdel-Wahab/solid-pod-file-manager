import { useCallback, useEffect, useState } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import {
  handleIncomingRedirect,
  login,
  logout,
} from "@inrupt/solid-client-authn-browser";

import FileActions from "./components/FileActions";
import FileTable from "./components/FileTable";
import FileUploader from "./components/FileUploader";
import FolderNavigator from "./components/FolderNavigator";
import {
  createFolder,
  discoverPodRoot,
  downloadFile,
  listResources,
  uploadFile,
} from "./services/solidPodService";
import "./App.css";

const DEFAULT_IDP = "https://solidcommunity.net";

function App() {
  const { session } = useSession();
  const [idp, setIdp] = useState(DEFAULT_IDP);
  const [currentUrl, setCurrentUrl] = useState("");
  const [folderStack, setFolderStack] = useState([]);
  const [resources, setResources] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [status, setStatus] = useState("");

  const fetchResources = useCallback(
    async (url) => {
      if (!url || !session.info.isLoggedIn) return;

      setStatus("Loading resources…");
      try {
        const items = await listResources(url, session.fetch);
        setResources(items);
        setStatus("");
      } catch (error) {
        console.error("Failed to load Pod resources:", error);
        setResources([]);
        setStatus("Could not load resources from this location.");
      }
    },
    [session.fetch, session.info.isLoggedIn]
  );

  useEffect(() => {
    const restoreSession = async () => {
      await handleIncomingRedirect({ restorePreviousSession: true });

      if (!session.info.isLoggedIn || !session.info.webId) return;

      try {
        const podRoot = await discoverPodRoot(session.info.webId, session.fetch);

        if (!podRoot) {
          setStatus("No Pod storage URL could be discovered for this WebID.");
          return;
        }

        setCurrentUrl(podRoot);
        setFolderStack([]);
        await fetchResources(podRoot);
      } catch (error) {
        console.error("Failed to initialise Pod browser:", error);
        setStatus("Could not initialise the Pod browser.");
      }
    };

    restoreSession();
  }, [fetchResources, session.fetch, session.info.isLoggedIn, session.info.webId]);

  const handleLogin = async () => {
    const issuer = idp.trim();
    if (!issuer) return;

    await login({
      oidcIssuer: issuer,
      redirectUrl: window.location.origin,
      clientName: "Solid Pod Browser",
    });
  };

  const handleLogout = async () => {
    await logout();
    setResources([]);
    setCurrentUrl("");
    setFolderStack([]);
  };

  const navigateTo = async (folderUrl) => {
    const normalizedUrl = folderUrl.endsWith("/") ? folderUrl : `${folderUrl}/`;
    setFolderStack((previous) => [...previous, currentUrl]);
    setCurrentUrl(normalizedUrl);
    await fetchResources(normalizedUrl);
  };

  const goBack = async () => {
    if (folderStack.length === 0) return;

    const previousUrl = folderStack[folderStack.length - 1];
    setFolderStack((previous) => previous.slice(0, -1));
    setCurrentUrl(previousUrl);
    await fetchResources(previousUrl);
  };

  const handleUpload = async () => {
    if (!fileToUpload || !currentUrl) return;

    try {
      await uploadFile(currentUrl, fileToUpload, session.fetch);
      setFileToUpload(null);
      await fetchResources(currentUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus("The file could not be uploaded.");
    }
  };

  const handleCreateFolder = async () => {
    const folderName = newFolderName.trim();
    if (!folderName || !currentUrl) return;

    try {
      await createFolder(currentUrl, folderName, session.fetch);
      setNewFolderName("");
      await fetchResources(currentUrl);
    } catch (error) {
      console.error("Folder creation failed:", error);
      setStatus("The folder could not be created.");
    }
  };

  const handleDownload = async (url, name) => {
    try {
      const blob = await downloadFile(url, session.fetch);
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Download failed:", error);
      setStatus("The file could not be downloaded.");
    }
  };

  return (
    <main className="app-container">
      <header className="app-header">
        <div>
          <p className="eyebrow">Solid prototype</p>
          <h1>Solid Pod Browser</h1>
          <p className="subtitle">
            Browse folders, upload files, and manage resources in a Solid Pod.
          </p>
        </div>
        {session.info.isLoggedIn && (
          <button className="button button-danger" onClick={handleLogout}>
            Log out
          </button>
        )}
      </header>

      {session.info.isLoggedIn ? (
        <section>
          <FolderNavigator
            currentUrl={currentUrl}
            canGoBack={folderStack.length > 0}
            onBack={goBack}
          />

          <div className="toolbar">
            <FileActions
              folderName={newFolderName}
              onFolderNameChange={setNewFolderName}
              onCreateFolder={handleCreateFolder}
            />
            <FileUploader
              selectedFile={fileToUpload}
              onFileChange={setFileToUpload}
              onUpload={handleUpload}
            />
          </div>

          {status && <p className="status">{status}</p>}

          <FileTable
            resources={resources}
            status={status}
            onOpenFolder={navigateTo}
            onDownload={handleDownload}
          />
        </section>
      ) : (
        <section className="login-panel">
          <h2>Sign in with Solid</h2>
          <p>
            Enter the URL of your Solid identity provider to authenticate via
            OIDC.
          </p>
          <input
            type="url"
            value={idp}
            onChange={(event) => setIdp(event.target.value)}
            placeholder="https://solidcommunity.net"
          />
          <button className="button" onClick={handleLogin}>
            Sign in
          </button>
        </section>
      )}
    </main>
  );
}

export default App;
