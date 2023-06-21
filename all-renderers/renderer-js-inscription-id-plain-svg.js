/**
 * Fastest renderer. However, this one does not produce self-contained images that the user can
 * right click on to open in a new tab or download.
 */

async function render(size, ...inscriptionIds) {
    const innerImages = inscriptionIds.map(
        (id) =>
            `<image width="${size.width}px" height="${size.height}px" href="/bitgen-example/content/${id}" />`,
    );

    const flattenedSvgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="${
        size.width
    }" height="${size.height}">${innerImages.join('')}</svg>`;

    return `<style>body, html {margin: 0;padding: 0;overflow: hidden;}</style>${flattenedSvgCode}`;
}
