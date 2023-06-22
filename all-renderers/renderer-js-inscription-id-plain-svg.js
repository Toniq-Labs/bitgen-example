/**
 * Fastest renderer. However, this one does not produce self-contained images that the user can
 * right click on to open in a new tab or download.
 */

async function render(size, ...inscriptionIds) {
    const innerImages = inscriptionIds.map((id) => {
        return /* HTML */ `
            <foreignObject x="0" y="0" width="100%" height="100%">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 ${size.width} ${size.height}"
                    width="${size.width}"
                    height="${size.height}"
                    style="image-rendering: pixelated; background: url(/bitgen-example/content/${id}) no-repeat center/100%;"
                ></svg>
            </foreignObject>
        `;
    });

    const flattenedSvgCode = /* HTML */ `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}">
            ${innerImages.join('')}
        </svg>
    `;

    return /* HTML */ `
        <style>
            body,
            html {
                margin: 0;
                padding: 0;
                overflow: hidden;
            }
        </style>
        ${flattenedSvgCode}
    `;
}
