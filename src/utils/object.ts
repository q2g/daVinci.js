
//#region import
import { Logging } from "./logger";
import { Event } from "../node_modules/typescript.events/lib/typescript.events";
import { checkEqualityOfArrays, AssistHypercube } from "./utils";
//#endregion

//#region Logger
let logger = new Logging.Logger("q2gListAdapter");
//#endregion

//#region interfaces
interface q2gIListObject extends Event {
    getDataPage: (top: number, height: number) => Promise<any>;
    searchFor: (searchString: string) => Promise<any>;
}
//#endregion

export class q2gListAdapter {

    //#region Variables
    obj: q2gIListObject;
    itemsCounter: number;
    //#endregion

    //#region collection
    private _collection: Array<any> = [];
    get collection(): Array<any> {
        return this._collection;
    }
    //#endregion

    //#region itemsPagingHeight
    private _itemsPagingHeight: number = 0;
    get itemsPagingHeight(): number {
        return this._itemsPagingHeight;
    }
    set itemsPagingHeight(value: number) {
        if (this.itemsPagingHeight !== value) {
            try {
                this._itemsPagingHeight = value;
                this.callData();
            } catch (err) {
                logger.error("error in setter of listDimensionscrollPosition", err);
            }
        }
    }
    //#endregion

    //#region itemsPagingTop
    private _itemsPagingTop: number = 0;
    get itemsPagingTop(): number {
        return this._itemsPagingTop;
    }
    set itemsPagingTop(value: number) {
        this.itemsPagingTopSetPromise(value);
    }

    itemsPagingTopSetPromise(value: number): Promise<boolean> {
        if (this.itemsPagingTop !== value) {
            try {
                this._itemsPagingTop = value;
                this.callData();
            } catch (err) {
                logger.error("error in setter of listDimensionscrollPosition", err);
            }
        }
        return new Promise((resolve, reject) => {
            resolve(true);
        })
    }
    //#endregion

    /**
     * init constructor q2gListAdapter 
     * @param obj object with the specific implementation for Values, Dimension, Bookmarks, ...
     * @param itemsPagingHeight number of items visible on Page
     * @param itemsCounter number of items in the whole list
     */
    constructor(obj: q2gIListObject, itemsPagingHeight: number, itemsCounter: number) {
        this.obj = obj;
        this.itemsPagingHeight = itemsPagingHeight;
        this.itemsCounter = itemsCounter; 
        this.itemsPagingTop = 0;

        this.registrateChangeEvent();
    }

    /**
     * writes the new data page in the collection
     */
    private callData(): void {   
        logger.debug("callData", "");

        this.obj.getDataPage(this.itemsPagingTop, this.itemsPagingHeight)
            .then((collection: Array<any>) => {
                
                if (!this._collection || !checkEqualityOfArrays(this._collection, collection)) {
                    let counter: number = 0;
                    for (let x of collection) {
                        if (counter >= this.collection.length || JSON.stringify(x) !== JSON.stringify(this._collection[counter])) {
                            this._collection[counter] = x;
                        }
                        counter++;
                    }
                    this._collection.splice(counter, this._collection.length);
                }
            })
            .catch((e) => {
                logger.error("ERROR in getDataPages", e);
            });
    }

    /**
     * updates teh required parameter for the list
     * @param obj
     * @param itemsPagingHeight
     * @param itemsCounter
     */
    updateList(obj: q2gIListObject, itemsPagingHeight: number, itemsCounter: number) {
        this.obj = obj;
        this.itemsPagingHeight = itemsPagingHeight;
        this.itemsCounter = itemsCounter;
        this.registrateChangeEvent();
    }

    /**
     * registrates the on change event
     */
    registrateChangeEvent() {
        this.obj.on("changed", (args) => {
            this.itemsPagingHeight = args as any;
            this.callData()
        });
        this.obj.emit("changed", this.itemsPagingHeight);
    }
}

export class q2gDimensionObject extends Event implements q2gIListObject {

    model: any;

    /**
     * init of class q2gDimensionObject
     * @param model root Connection to the Hypercube
     */
    constructor(model: AssistHypercube) {
        super();
        this.model = model;
    }

    /**
     * calculates and returns the new datapage
     * @param itemsPagingTop start element for Page
     * @param itemsPagingHeight number of items visible on Page
     */
    getDataPage(itemsPagingTop: number, itemsPagingHeight: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.model.getListObjectData("", [{
                "qTop": itemsPagingTop,
                "qLeft": 0,
                "qHeight": itemsPagingHeight,
                "qWidth": 1
            }])
                .then((res: any) => {
                    let collection = [];
                    for (var j: number = 0; j < res.length; j++) {
                        let matrix = res[j]
                        collection.push({
                            status: matrix.qStateCounts.qSelected,
                            id: matrix.cId,
                            defs: matrix.qGroupFieldDefs,
                            title: matrix.qFallbackTitle,
                        });
                    }
                    resolve(collection);
                })
                .catch((e: Error) => {
                    logger.error("ERROR", e);
                    reject(e);
                });
        })
    }
    
    /**
     * search for the enterd string in the root Object
     * @param searchString string to search for
     */
    searchFor(searchString: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.model.searchListObjectFor(searchString)
                .then(() => {
                    resolve(true)
                }).catch((e) => {
                    logger.error("error", e);
                    reject()
                });
        });
    }
}

export class q2gListObject extends Event implements q2gIListObject {

    model: EngineAPI.IGenericObject;

    /**
     * init of class q2gDimensionObject
     * @param model root Connection to the Hypercube
     */
    constructor(model: EngineAPI.IGenericObject) {
        super();
        this.model = model;
    }

    /**
     * calculates and returns the new datapage
     * @param itemsPagingTop start element for Page
     * @param itemsPagingHeight number of items visible on Page
     */
    getDataPage(itemsPagingTop: number, itemsPagingSize: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.model.getListObjectData("/qListObjectDef", [{
                "qTop": itemsPagingTop,
                "qLeft": 0,
                "qHeight": itemsPagingSize,
                "qWidth": 1
            }])
                .then((res: EngineAPI.INxDataPage[]) => {
                    let collection = [];
                    
                    for (let item of res[0].qMatrix) {
                        let matrix = item[0];
                        collection.push({
                            status: matrix.qState,
                            id: matrix.qElemNumber,
                            title: matrix.qText,
                        });
                    }
                    resolve(collection);
                })
                .catch((e: Error) => {
                    logger.error("ERROR", e);
                    reject(e);
                });
        })
    }

    /**
     * search for the enterd string in the root Object
     * @param searchString string to search for
     */
    searchFor(searchString: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.model.searchListObjectFor("/qListObjectDef", searchString)
                .then(() => {
                    resolve(true)
                }).catch((e) => {
                    logger.error("error", e);
                    reject()
                });
        });
    }
}

