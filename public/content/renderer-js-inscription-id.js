/**
 * Produces self-contained SVG images, which will preserve the scaling ability of any child SVG
 * images, that can be opened in a new tab or downloaded.
 */

async function render(size, ...inscriptionIds) {
    const base64Images = await Promise.all(
        inscriptionIds.map(async (id) => {
            const image = await fetch(`/bitgen-example/content/${id}`);
            const base64 = await getBase64(await image.blob());

            return base64;
        }),
    );

    const innerImages = base64Images.map((base64Image) => {
        return /* HTML */ `
            <foreignObject x="0" y="0" width="100%" height="100%">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 ${size.width} ${size.height}"
                    width="${size.width}"
                    height="${size.height}"
                    style="image-rendering: pixelated; background: url(${base64Image}) no-repeat center/100%;"
                ></svg>
            </foreignObject>
        `;
    });

    const flattenedSvgCode = /* HTML */ `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 ${size.width} ${size.height}"
            width="${size.width}"
            height="${size.height}"
        >
            ${innerImages.join('')}
        </svg>
    `;
    const flattenedSvgBlob = new Blob([flattenedSvgCode], {type: 'image/svg+xml'});
    const flattenedSvgBlobUrl = URL.createObjectURL(flattenedSvgBlob);
    return /* HTML */ `
        <style>
            body,
            html {
                margin: 0;
                padding: 0;
                overflow: hidden;
            }
        </style>
        <img src="${flattenedSvgBlobUrl}" />
    `;
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
