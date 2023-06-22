const collectionJsonInscriptionId = 'collection-json-inscription-id.json';
const rendererJsInscriptionId = 'renderer-js-inscription-id.js';
const renderSize = {width: 150, height: 150};

async function createInscriptionHtml() {
    const collectionMetadataPromise = fetch(
        `/bitgen-example/content/${collectionJsonInscriptionId}`,
    ).then((response) => response.json());

    const inscriptionTraitsList = document.querySelector('script[t]').getAttribute('t').split(',');

    const rendererScript = document.createElement('script');
    rendererScript.setAttribute('async', '');
    rendererScript.src = `/bitgen-example/content/${rendererJsInscriptionId}`;

    const renderPromise = new Promise((resolve, reject) => {
        rendererScript.addEventListener('load', async () => {
            try {
                const collectionMetadata = await collectionMetadataPromise;

                const traitInscriptionIds = inscriptionTraitsList.map(
                    (traitIndex, layerIndex) =>
                        collectionMetadata.layers[layerIndex].traits[traitIndex]?.inscriptionId,
                );

                resolve(await render(renderSize, ...traitInscriptionIds.filter((id) => !!id)));
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    });
    document.head.appendChild(rendererScript);

    return await renderPromise;
}

createInscriptionHtml().then((result) => (document.body.innerHTML = result));
