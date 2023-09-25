import NodeFileCache from "node-file-cache";

const cache = NodeFileCache.create({
    file: ".cache",
    life: 60 * 60 * 24,
});

const tempCache: Record<string, any> = {};

export const setKey = (key: string, value: any) => {
    tempCache[key] = value;
};

export const getKey = (key: string) => tempCache[key];

export default cache;
