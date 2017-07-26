
/**
 * Filter to check which selection state is active 
 */
export function qStatusFilter() {
    "use strict";
    return function (elementStatus: string) {
        switch (elementStatus) {
            case "S":
                return "selected";
            case "A":
                return "alternative";
            case "O":
                return "optional";
            case "X":
                return "excluded";
        }
        return "option";
    };
}

