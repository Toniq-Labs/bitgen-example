const collectionJsonInscriptionId = 'collection-json-inscription-id.json';

async function createInscriptionHtml() {
    const collectionMetadataPromise = fetch(`/bitgen-example/content/${collectionJsonInscriptionId}`).then(
        (response) => response.json(),
    );

    const inscriptionTraitsList = document
        .querySelector('script[traits]')
        .getAttribute('traits')
        .split(',');

    const rendererScript = document.createElement('script');
    rendererScript.setAttribute('async', '');
    rendererScript.src = `/bitgen-example/content/renderer-js-inscription-id.js`;

    const renderPromise = new Promise((resolve, reject) => {
        rendererScript.addEventListener('load', async () => {
            try {
                const collectionMetadata = await collectionMetadataPromise;

                const traitInscriptionIds = inscriptionTraitsList.map(
                    (traitIndex, layerIndex) =>
                        collectionMetadata.layers[layerIndex].traits[traitIndex].inscriptionId,
                );

                resolve(
                    await render(
                        {
                            width: 150,
                            height: 150,
                        },
                        ...traitInscriptionIds,
                    ),
                );
            } catch (error) {
                reject(error);
            }
        });
    });
    document.head.appendChild(rendererScript);

    return await renderPromise;
}

createInscriptionHtml().then((result) => (document.body.innerHTML = result));
