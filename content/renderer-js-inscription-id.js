/**
 * Produces self-contained SVG images, which will preserve the scaling ability of any child SVG
 * images, that can be opened in a new tab or downloaded.
 */

async function render(size, ...inscriptionIds) {
    try {
        /**
         * All images must be converted to base64 so that they can be self contained within the
         * final combined image. This is needed because SVGs loaded via the "src" attribute in an
         * <img> element (which is how the final combined image is loaded) do not load nested images
         * from over the network.
         */
        const base64Images = await Promise.all(
            inscriptionIds.map(async (id) => {
                const image = await fetch(`/bitgen-example/content/${id}`);
                return await getBase64(await image.blob());
            }),
        );
        /**
         * Inner SVGs must be generated so that animated GIFs will render correctly as a standalone
         * tab in all browsers. Using background urls on an SVG allows "image-rendering: pixelated"
         * to work in all browsers.
         */
        const innerImages = base64Images.map((base64Image) => {
            return /* HTML */ `
                <foreignObject x="0" y="0" width="100%" height="100%">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 ${size.width} ${size.height}"
                        width="${size.width}"
                        height="${size.height}"
                        style="image-rendering: pixelated; background: url(${base64Image}) no-repeat center/contain;"
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
        const flattenedSvgBlobUrl = URL.createObjectURL(
            new Blob([flattenedSvgCode], {type: 'image/svg+xml'}),
        );
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
    } catch (error) {
        return `<p style="color: red;">${error?.message || String(error)}</p>`;
    }
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}
