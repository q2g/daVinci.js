export namespace Logging {
    class KV {
        key: string;
        value: LogLevel;
    }

    export class LogConfig {
        private static logLevelperClass: Array<KV> = new Array<KV>();

        static GetLogLevel(name: string): LogLevel {
            for (var t of this.logLevelperClass) {
                if (t.key === name || t.key === "*") {
                    return t.value;
                }
            }
            return LogLevel.off;
        }

        static SetLogLevel(name: string, level: LogLevel): void {
            this.logLevelperClass.push({ key: name, value: level });
        }
    }

    export function GetCurrentClassLogger(): Logger {
        return new Logger(this.constructor.name);
    }

    export enum LogLevel {
        trace = 0,
        debug = 1,
        info = 2,
        warn = 3,
        error = 4,
        fatal = 5,
        off = 6
    }

    export class Logger {
        logclass: string;

        constructor(name: string) {
            this.logclass = name;
        }

        /**
         * Log a Message with a certain loglevel to the browser console if the global filter allows that seetin
         * 
         * @param loglevel the minimum loglevelt (e.g. trace, debug, info, warn, error, fatal, off)
         * @param text the message text
         * @param obj a object to log to the console
         */
        log(loglevel: LogLevel, text: string, ...arrObj: any[]): void {
            if (typeof arrObj !== "undefined") {
                while (arrObj instanceof Array && arrObj.length < 2) {
                    if (arrObj.length === 1) {
                        arrObj = arrObj[0];
                    } else {
                        arrObj = undefined;
                    }
                }
            }

            if (LogConfig.GetLogLevel(this.logclass) <= loglevel) {
                var message: string = "Log (" + loglevel.toString() + "): " + this.logclass + " - " + text + " - ";
                switch (loglevel) {
                    case LogLevel.trace:
                        console.trace(message, arrObj);
                        break;
                    case LogLevel.debug:
                        console.debug(message, arrObj);
                        break;
                    case LogLevel.info:
                        console.info(message, arrObj);
                        break;
                    case LogLevel.warn:
                        console.warn(message, arrObj);
                        break;
                    case LogLevel.error:
                        console.error(message, arrObj);
                        break;
                    case LogLevel.fatal:
                        console.error(message, arrObj);
                        break;
                    default:
                        console.trace(message, arrObj);
                }
            };
        }

        trace(text: string, ...arrObj: any[]): void {
            this.log(LogLevel.trace, text, arrObj);
        }

        debug(text: string, ...arrObj: any[]): void {
            this.log(LogLevel.debug, text, arrObj);
        }

        info(text: string, ...arrObj: any[]): void {
            this.log(LogLevel.info, text, arrObj);
        }

        warn(text: string, ...arrObj: any[]): void {
            this.log(LogLevel.warn, text, arrObj);
        }

        error(text: string, ...arrObj: any[]): void {
            this.log(LogLevel.error, text, arrObj);
        }

        fatal(text: string, ...arrObj: any[]): void {
            this.log(LogLevel.fatal, text, arrObj);
        }
    }
}