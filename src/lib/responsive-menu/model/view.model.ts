export class ViewModel {

    private _viewportBounds: DOMRect;

    public set viewportBounds(bounds: DOMRect) {
        this._viewportBounds = bounds;
    }

    public get viewportBounds(): DOMRect {
        return this._viewportBounds;
    }

    public set elements(el) {}
}
