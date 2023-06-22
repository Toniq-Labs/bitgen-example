/**
 * Produces self-contained base64-encoded png images, eliminating all scaling abilities of child SVG
 * images, that can be downloaded or opened in a new tab.
 */

async function render(size, ...inscriptionIds) {
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;

    const images = await Promise.all(
        inscriptionIds.map(async (id) => {
            return new Promise((resolve, reject) => {
                const image = new Image();

                image.addEventListener('load', () => {
                    resolve(image);
                });
                image.addEventListener('error', (event) => {
                    reject(event);
                });
                image.src = `/bitgen-example/content/${id}`;
            });
        }),
    );

    images.forEach((image) => {
        context.drawImage(image, 0, 0, size.width, size.height);
    });

    const dataUrl = canvas.toDataURL('image/png');

    return /* HTML */ `
        <style>
            body,
            html {
                margin: 0;
                padding: 0;
                overflow: hidden;
            }
        </style>
        <img src="${dataUrl}" />
    `;
}
