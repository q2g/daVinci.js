//#region
import * as chai from "chai";
import { regEscaper } from "../dist/umd/utils/utils";
//#endregion

let expect = chai.expect;

describe("tests the utis.ts", () => {
    describe("tests the function calcNumberOfRows", () => {
        it("correct input should return sucess", () => {
            expect(regEscaper("a")).to.be.equal("a");
        });
    });
});