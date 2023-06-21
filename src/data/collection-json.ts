import {ReadonlyDeep} from 'type-fest';

export type CollectionTrait = {name: string; inscriptionId: string};

export type CollectionLayer = {
    name: string;
    traits: CollectionTrait[];
};

export type CollectionJson = {
    collection: {name: string};
    layers: CollectionLayer[];
};

export async function loadCollectionJson(): Promise<ReadonlyDeep<CollectionJson>> {
    const data = await (
        await fetch('/bitgen-example/content/collection-json-inscription-id.json')
    ).json();

    return data;
}
