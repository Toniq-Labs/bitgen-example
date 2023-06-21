import {randomInteger} from '@augment-vir/browser';
import {
    HTMLTemplateResult,
    assign,
    asyncProp,
    css,
    defineElementNoInputs,
    html,
    isRenderReady,
} from 'element-vir';
import {ReadonlyDeep} from 'type-fest';
import {CollectionJson, loadCollectionJson} from '../../data/collection-json';
import {BitgenInscription} from './bitgen-inscription.element';

const numberOfRandomInscriptions = 100;

export const BitgenExampleApp = defineElementNoInputs({
    tagName: 'bitgen-example-app',
    styles: css`
        :host {
            font-family: sans-serif;
            width: 100%;
            height: 100%;
            padding: 32px;
            box-sizing: border-box;
            align-content: flex-start;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 8px;
        }

        .github {
            width: 48px;
            position: fixed;
            bottom: 10px;
            right: 10px;
            display: block;
            background-color: white;
            border-radius: 50%;
        }

        .github img {
            display: block;
            width: 100%;
            height: 100%;
        }
    `,
    stateInitStatic: {
        inscriptions: asyncProp({
            defaultValue: loadCollectionJson().then(createInscriptionTemplate),
        }),
    },
    renderCallback({state}) {
        if (!isRenderReady(state.inscriptions)) {
            return 'Loading...';
        }

        return html`
            ${state.inscriptions}
            <a class="github" href="https://github.com/Toniq-Labs/bitgen-example">
                <img src="/bitgen-example/github-mark.svg" />
            </a>
        `;
    },
});

function createInscriptionTemplate(
    collectionJson: ReadonlyDeep<CollectionJson>,
): HTMLTemplateResult[] {
    return Array(numberOfRandomInscriptions)
        .fill(0)
        .map(() => {
            const traits = collectionJson.layers.map((layer) => {
                const chosenTrait = randomInteger({min: 0, max: layer.traits.length - 1});
                return chosenTrait;
            });
            return html`
                <${BitgenInscription}
                    ${assign(BitgenInscription, {
                        traits,
                    })}
                ></${BitgenInscription}>
            `;
        });
}
