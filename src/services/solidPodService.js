import {
  createContainerAt,
  getContainedResourceUrlAll,
  getPodUrlAll,
  getResourceInfo,
  getSolidDataset,
  overwriteFile,
} from "@inrupt/solid-client";

export async function discoverPodRoot(webId, authenticatedFetch) {
  const podUrls = await getPodUrlAll(webId, { fetch: authenticatedFetch });
  return podUrls[0] || "";
}

export async function listResources(containerUrl, authenticatedFetch) {
  const dataset = await getSolidDataset(containerUrl, {
    fetch: authenticatedFetch,
  });
  const containedUrls = getContainedResourceUrlAll(dataset);

  return Promise.all(
    containedUrls.map(async (resourceUrl) => {
      const info = await getResourceInfo(resourceUrl, {
        fetch: authenticatedFetch,
      });

      return {
        url: resourceUrl,
        name: decodeURIComponent(
          resourceUrl.split("/").filter(Boolean).pop() || resourceUrl
        ),
        isFolder: info.isContainer,
      };
    })
  );
}

export async function createFolder(containerUrl, folderName, authenticatedFetch) {
  const folderUrl = new URL(
    `${encodeURIComponent(folderName)}/`,
    containerUrl
  ).href;

  await createContainerAt(folderUrl, { fetch: authenticatedFetch });
}

export async function uploadFile(containerUrl, file, authenticatedFetch) {
  const uploadUrl = new URL(encodeURIComponent(file.name), containerUrl).href;

  await overwriteFile(uploadUrl, file, {
    contentType: file.type || "application/octet-stream",
    fetch: authenticatedFetch,
  });
}

export async function downloadFile(resourceUrl, authenticatedFetch) {
  const response = await authenticatedFetch(resourceUrl);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.blob();
}
