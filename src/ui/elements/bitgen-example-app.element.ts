import {extractErrorMessage, randomInteger} from '@augment-vir/common';
import {
    HTMLTemplateResult,
    asyncProp,
    css,
    defineElementNoInputs,
    html,
    isError,
    isResolved,
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
            min-height: 100%;
            padding: 16px 32px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 8px;
            background-color: #eee;
        }

        .inscriptions {
            align-content: flex-start;
            display: flex;
            flex-direction: row;
            gap: 8px;
            flex-wrap: wrap;
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

        h1 {
            margin: 0;
        }

        ul {
            font-size: 1.1em;
        }

        li {
            margin-bottom: 4px;
        }
    `,
    stateInitStatic: {
        inscriptions: asyncProp({
            defaultValue: loadCollectionJson().then(createInscriptionTemplate),
        }),
    },
    renderCallback({state}) {
        if (!isResolved(state.inscriptions.value)) {
            return 'Loading...';
        } else if (isError(state.inscriptions.value)) {
            return extractErrorMessage(state.inscriptions);
        }

        return html`
            <header>
                <h1>Randomized BitGen Ordinal Examples</h1>
                <ul>
                    <li>
                        <a href="/bitgen-example/content/collection-json-inscription-id.json">
                            collection trait definitions
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/Toniq-Labs/bitgen-example">source code</a>
                    </li>
                    <li>
                        <a
                            href="https://bioniq-1.gitbook.io/bitgen-bitcoin-generative-ordinals-standard-alpha/"
                        >
                            BitGen Standard
                        </a>
                    </li>
                    <li>
                        <a href="/bitgen-example/content/example.html">
                            Example stand-alone ordinal
                        </a>
                    </li>
                    <li>
                        <a href="/bitgen-example/content/image-includes.svg">
                            Example non-BitGen ordinal
                        </a>
                    </li>
                </ul>
            </header>
            <section class="inscriptions">${state.inscriptions.value}</section>
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
                const chosenTrait = randomInteger({min: -1, max: layer.traits.length - 1});

                if (chosenTrait < 0) {
                    return '';
                }

                return chosenTrait;
            });
            return html`
                <${BitgenInscription.assign({
                    traits,
                })}></${BitgenInscription}>
            `;
        });
}
