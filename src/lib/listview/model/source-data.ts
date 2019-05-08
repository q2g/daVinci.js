export class SourceData {

    private itemTotal: number;

    public set total(total: number) {
        this.itemTotal = total;
    }

    public get total(): number {
        return this.itemTotal;
    }
}
