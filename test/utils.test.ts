//#region
import * as chai from "chai";
import { calcNumbreOfVisRows } from "../src/utils/utils";
//#endregion

let expect = chai.expect;

describe("tests the utis.ts", () => {
    describe("tests the function calcNumberOfRows", () => {
        it("correct input should return sucess", () => {
            expect(calcNumbreOfVisRows(200)).to.be.equal(4);
        });
    });
});