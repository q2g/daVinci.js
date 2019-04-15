export enum ItemIcon {

    LOCK = "lock",

    SELECTED = "tick",

    NONE = "none"
}

export enum ItemState {

    SELECTED = "selected",

    ALTERNATIVE = "alternative",

    EXCLUDED = "excluded",

    NONE = "none"
}

export interface IListItem<T> {
    label: string;

    raw: T;

    icon: ItemIcon;

    state: ItemState;
}
