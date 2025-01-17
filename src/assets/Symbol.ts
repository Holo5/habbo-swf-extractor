export class Symbol {
    public constructor(
        private _id: number,
        private _name: string,
    ) {
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }
}