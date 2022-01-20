export class Binary {
    constructor(
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
}