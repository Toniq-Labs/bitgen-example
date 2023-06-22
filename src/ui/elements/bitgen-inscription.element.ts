import {convertTemplateToString} from '@augment-vir/element-vir';
import {css, defineElement, html} from 'element-vir';

export const BitgenInscription = defineElement<{traits: number[]}>()({
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
    `,
    renderCallback({inputs}) {
        const frameSource = html`
            <script
                t="${inputs.traits.join(',')}"
                src="/bitgen-example/content/collection-js-inscription-id.js"
            ></script>
        `;
        return html`
            <iframe
                loading="eager"
                referrerpolicy="no-referrer"
                srcdoc=${convertTemplateToString(frameSource)}
            ></iframe>
        `;
    },
});
