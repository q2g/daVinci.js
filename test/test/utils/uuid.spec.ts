import { generateUid } from "@utils/utils";
import { expect } from "chai";


describe("davinci.js/utils/generateUid", () => {


    describe("default uuid pattern", () => {

        it("should have following pattern 8-4-4-4-11", () => {
            const isValidPattern = generateUid()
                .match(/^[^-]{8}-[^-]{4}-[^-]{4}-[^-]{4}-[^-]{11}$/);
            expect(isValidPattern).to.not.null;
        });

        it("should have following pattern 8-4-4-4-11, and contain strings and number values", () => {
            const isValidPattern = generateUid()
                .match(/^(?!.*[^a-z0-9\-])[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{11}$/);
            expect(isValidPattern).to.not.null;
        });
    });

    describe("custom uuid pattern xx-xxxxx-x-xxx-xxxxxxxxx", () => {

        let uid: string;

        before(() => {
            uid = generateUid("xx-xxxxx-x-xxx-xxxxxxxxx");
        });

        it("should have following pattern 2-5-1-4-9", () => {
            const isValidPattern = uid.match(/^[^-]{2}-[^-]{5}-[^-]{1}-[^-]{3}-[^-]{9}$/);
            expect(isValidPattern).to.not.null;
        });

        it("should have following pattern 8-4-4-4-11, and contain strings and number values", () => {
            const isValidPattern = uid
                .match(/^(?!.*[^a-z0-9\-])[a-z0-9]{2}-[a-z0-9]{5}-[a-z0-9]{1}-[a-z0-9]{3}-[a-z0-9]{9}$/);
            expect(isValidPattern).to.not.null;
        });
    });

    describe("custom uuid pattern xx-XXxxx-X-xxx-xxxxxxxXX", () => {

        let uid: string;

        before(() => {
            uid = generateUid("xx-XXxxx-X-xxx-xxxxxxxXX");
        });

        it("should have following pattern xx-XXxxx-X-xxx-xxxxxxxXX, contain capital letters ", () => {
            const pattern  = /^.{3}[A-Z]{2}.{4}[A-Z].{12}[A-Z]{2}$/
            const match    = uid.match(pattern);
            expect(match).to.not.null;
        });
    });
});
