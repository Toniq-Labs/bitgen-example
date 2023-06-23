async function render(size, ...inscriptionIds) {
    try {
    const base64Images = await Promise.all(inscriptionIds.map(async (id) => await getBase64(await (await fetch(`/bitgen-example/content/${id}`)).blob())));
    const innerImages = base64Images.map((base64Image) => `<foreignObject x="0" y="0" width="100%" height="100%"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size.width} ${size.height}" width="${size.width}" height="${size.height}" style="image-rendering: pixelated; background: url(${base64Image}) no-repeat center/100%;"></svg></foreignObject>`);

    const flattenedSvgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size.width} ${size.height}" width="${size.width}" height="${size.height}">${innerImages.join('')}</svg>`;
    const flattenedSvgBlobUrl = URL.createObjectURL(new Blob([flattenedSvgCode], {type: 'image/svg+xml'}));
    return `<style>body,html {margin: 0; padding: 0; overflow: hidden;}</style><img src="${flattenedSvgBlobUrl}" />`;
    } catch (error) {return `<p style="color: red;">${error?.message || String(error)}</p>`;}
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}
