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

        const finalImageUrl = generateCombinedImageUrl(size, base64Images, false);
        /**
         * This fixes a bug in some browsers where resized images with transparent backgrounds have
         * transparency edge render artifacts, like grey borders. As long as this image gets 1 pixel
         * rendered on screen for 1 frame, the artifacts will go away.
         */
        const resizeArtifactFix = `
        <img
            class="full-size"
            onload="this.remove()"
            src="${generateCombinedImageUrl(size, base64Images, true)}"
        />
    `;

        return /* HTML */ `
            <style>
                /*
                    Remove default browser padding/margin for when this is loaded in an iframe.
                */
                body,
                html {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                }
                .full-size {
                    position: absolute;
                    opacity: 1;
                    top: calc(100% - 1px);
                    left: calc(100% - 1px);
                }
            </style>
            ${resizeArtifactFix}
            <img src="${finalImageUrl}" />
        `;
    } catch (error) {
        return `<p style="color: red;">${error?.message || String(error)}</p>`;
    }
}

function generateCombinedImageUrl(size, base64Images, fullSize) {
    /**
     * Inner SVGs must be generated so that animated GIFs will render correctly as a standalone tab
     * in all browsers. Using background urls on an SVG allows "image-rendering: pixelated" to work
     * in all browsers.
     */
    const innerImages = base64Images.map((base64Image) => {
        return /* HTML */ `
            <foreignObject x="0" y="0" width="100%" height="100%">
                <svg
                    ${fullSize ? 'class="full-size"' : ''}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 ${size.width} ${size.height}"
                    width="${size.width}"
                    height="${size.height}"
                    style="image-rendering: pixelated; background: url(${base64Image}) no-repeat ${fullSize
                        ? ''
                        : 'center/contain'};"
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
    return URL.createObjectURL(new Blob([flattenedSvgCode], {type: 'image/svg+xml'}));
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}
