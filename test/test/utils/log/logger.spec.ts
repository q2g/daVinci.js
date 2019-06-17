import { logging } from "@utils/logger";
import { expect } from "chai";
import { spy } from "../../../node_modules/sinon";
import { SinonSpy } from "../../../node_modules/@types/sinon";

describe("davinci.js/utils/logger", () => {

    const logger: logging.Logger = new logging.Logger("UnitLogger");
    let logConfig: logging.LogConfig;

    describe("LogConfig", () => {

        before( () => {
            logConfig = logging.LogConfig;
        });

        it("should set loglevel to info", () => {
            logging.LogConfig.SetLogLevel("LogConfig", logging.LogLevel.info);
            expect(
                logging.LogConfig.GetLogLevel("LogConfig")
            ).to.be.equal(logging.LogLevel.info);
        });

        it("should set loglevel to warn", () => {
            logging.LogConfig.SetLogLevel("LogConfig", logging.LogLevel.warn);
            expect(
                logging.LogConfig.GetLogLevel("LogConfig")
            ).to.be.equal(logging.LogLevel.warn);
        });
    })

    describe("Log messages", () => {
        
        let consoleSpy: SinonSpy;

        describe("set log level to warn", () => {

            before( () => {
                logging.LogConfig.SetLogLevel("UnitLogger", logging.LogLevel.warn);
            });

            afterEach( () => {
                consoleSpy.restore();
            });

            it("should log warning", () => {
                consoleSpy = spy(console, "warn");
                logging.LogConfig.SetLogLevel("UnitLogger", logging.LogLevel.warn);
                logger.log(logging.LogLevel.warn, "this is a warning", "nothing");

                expect( consoleSpy.calledOnce ).to.be.true;
            });

            it("should log no debug message", () => {
                consoleSpy = spy(console, "log");
                logger.log(logging.LogLevel.debug, "this is a debug message", "nothing");
                expect( consoleSpy.calledOnce ).to.be.false;
            });

            it("should log error message", () => {
                consoleSpy = spy(console, "error");
                logger.log(logging.LogLevel.error, "this is a error message", "nothing");
                expect( consoleSpy.calledOnce ).to.be.true;
            });
        });

        describe("set log level to debug", () => {

            before( () => {
                logging.LogConfig.SetLogLevel("UnitLogger", logging.LogLevel.debug);
            });

            afterEach( () => {
                consoleSpy.restore();
            });

            it("should log debug message", () => {
                consoleSpy = spy(console, "log");
                logging.LogConfig.SetLogLevel("UnitLogger", logging.LogLevel.debug);
                logger.log(logging.LogLevel.debug, "this is a debug message", "nothing");

                expect( consoleSpy.calledOnce ).to.be.true;
            });
        });
    })
});
