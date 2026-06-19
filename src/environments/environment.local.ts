import {LogLevel}      from "angular-auth-oidc-client";
import {ILoggingGroup} from "../app/services/enums/i-logging-group";
import {LoggingLevel}  from "../app/services/enums/logging-level";

let loggingGroups: Array<ILoggingGroup> = [
    // {
    //     id:    LoggingGroup.SOCKET,
    //     level: LoggingLevel.INFO,
    // }
];

export const environment = {
    production:     false,
    loggingService: {
        levels: {
            default: LoggingLevel.ERROR,
            groups:  loggingGroups,
        }
    },
    oidc:           {
        tokenRefreshInSeconds: 1500, // 25min
        logLevel:              LogLevel.Debug
    },
    frontend:       {
        host: 'https://smartscrumpoker.localhost.balazskrizsan.com/'
    },
    backend:        {
        api:     {
            host: 'https://api--smartscrumpoker.localhost.balazskrizsan.com/'
        },
        wss_api: {
            host: 'wss://api--smartscrumpoker.localhost.balazskrizsan.com/ws'
        }
    },
    ids:            {
        host: 'https://ids--smart-scrum-poker.localhost.balazskrizsan.com'
    }
};
