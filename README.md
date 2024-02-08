# bitgen-example

An example on how to run [the BitGen standard](https://bioniq-1.gitbook.io/bitgen-bitcoin-generative-ordinals-standard-alpha/).

Tested in Safari (macOS and iOS), Chrome, and Firefox.

## How it works

-   All example inscriptions (which would be on the blockchain) are inside [`public/content`](./public/content).
    -   In practice, each of these would have a name that's an inscription id. However, for this example, they are named such that you can actually tell what they are doing.
-   Each inscription in a collection only needs the following code:
    ```html
    <script t="0,1" src="/content/collection-js-inscription-id.js"></script>
    ```
-   The [`collection-js-inscription-id.js`](./public/content/collection-js-inscription-id.js) inscription handles determining which traits to load and then calls [`renderer-js-inscription-id.js`](./public/content/renderer-js-inscription-id.js).
-   The [`renderer-js-inscription-id.js`](./public/content/renderer-js-inscription-id.js) inscription flattens all the trait images into a single image for the user to see.
-   For the purposes of the GitHub Pages example, all `/content/` URLs in this code are actually `/bitgen-example/content/` URLs.
-   Also for the purposes of this example, lots of comments are included in the files. When you're actually inscribing these, you should remove the comments as they'll just take up useless space.
