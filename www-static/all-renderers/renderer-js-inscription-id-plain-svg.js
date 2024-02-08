/**
 * Produces self-contained SVG images, which will preserve the scaling ability of any child SVG
 * images, that can be opened in a new tab or downloaded.
 *
 * Note that this solution does not include the solution for transparent PNG resize artifacts
 * included in the svg-blob renderer. That solution is not included here because it is very
 * inconsistent with this solution.
 */

async function render(size, ...inscriptionIds) {
    try {
        return /* HTML */ `
            <style>
                body,
                html {
                    /*
                        Remove default browser padding/margin for when this is loaded in an iframe.
                    */
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                }
            </style>
            ${formSvgBlobUrl(size, inscriptionIds)}
        `;
    } catch (error) {
        return `<p style="color: red;">${error?.message || String(error)}</p>`;
    }
}

function formSvgBlobUrl(size, ids) {
    const imageBackgrounds = ids.reverse().map((id) => {
        return `url(/bitgen-example/content/${id}) no-repeat center/contain`;
    });

    const flattenedSvgCode = /* HTML */ `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 ${size.width} ${size.height}"
            width="${size.width}"
            height="${size.height}"
            style="image-rendering: pixelated; background: ${imageBackgrounds.join(', ')};"
        ></svg>
    `;

    return flattenedSvgCode;
}
