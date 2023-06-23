import {randomInteger} from '@augment-vir/browser';
import {extractErrorMessage} from '@augment-vir/common';
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
        if (!isRenderReady(state.inscriptions)) {
            if (state.inscriptions instanceof Error) {
                return extractErrorMessage(state.inscriptions);
            }
            return 'Loading...';
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
                            href="https://app.gitbook.com/o/Q3Oxn6JoOM586ZB6JiuM/s/2dG6qI7sUdTOOl3tt0IF/"
                        >
                            BitGen Standard
                        </a>
                    </li>
                    <li>
                        <a href="/bitgen-example/content/example.html">
                            Example stand-alone ordinal
                        </a>
                    </li>
                </ul>
            </header>
            <section class="inscriptions">${state.inscriptions}</section>
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
                <${BitgenInscription}
                    ${assign(BitgenInscription, {
                        traits,
                    })}
                ></${BitgenInscription}>
            `;
        });
}
