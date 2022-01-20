import ArrayBufferView = NodeJS.ArrayBufferView;

export class Binary {
    public constructor(
        private _id: number,
        private _data: ArrayBufferView,
    ) {
    }

    get id(): number {
        return this._id;
    }

    get data(): ArrayBufferView {
        return this._data;
    }

    static fromTag(tag: any) {
        return new Binary(tag.data.readUInt16LE(), tag.data.slice(6));
    }
}