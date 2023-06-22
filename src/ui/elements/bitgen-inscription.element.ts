import {css, defineElement, html, templateToString} from 'element-vir';

export const BitgenInscription = defineElement<{traits: (number | '')[]}>()({
    tagName: 'bitgen-inscription',
    styles: css`
        :host {
            display: block;
        }

        iframe {
            display: block;
            width: 150px;
            height: 150px;
            overflow: hidden;
            box-sizing: border-box;
            border: none;
        }

        pre {
            margin: 0;
            margin-bottom: 1px;
            padding: 0;
        }
    `,
    renderCallback({inputs}) {
        const traitsString = `t="${inputs.traits.join(',')}"`;

        const frameSource = html`
            <script
                ${traitsString}
                src="/bitgen-example/content/collection-js-inscription-id.js"
            ></script>
        `;

        return html`
            <pre>${traitsString}</pre>
            <iframe
                loading="eager"
                referrerpolicy="no-referrer"
                srcdoc=${templateToString(frameSource)}
            ></iframe>
        `;
    },
});
