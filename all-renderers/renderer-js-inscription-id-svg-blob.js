/**
 * Produces self-contained SVG images, which will preserve the scaling ability of any child SVG
 * images, that can be opened in a new tab or downloaded.
 */

async function render(size, ...inscriptionIds) {
    const images = await Promise.all(
        inscriptionIds.map(async (id) => {
            const image = await fetch(`/content/${id}`);
            return await getBase64(await image.blob());
        }),
    );

    const innerImages = images.map(
        (image) => `<image width="${size.width}px" height="${size.height}px" href="${image}" />`,
    );

    const flattenedSvgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="${
        size.width
    }" height="${size.height}">${innerImages.join('')}</svg>`;

    const flattenedSvgBlob = new Blob([flattenedSvgCode], {type: 'image/svg+xml'});
    const flattenedSvgBlobUrl = URL.createObjectURL(flattenedSvgBlob);
    return `<style>body, html {margin: 0;padding: 0;overflow: hidden;}</style><img src="${flattenedSvgBlobUrl}" />`;
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}
