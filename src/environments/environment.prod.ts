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
    production:     true,
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
        host: 'https://smartscrumpoker.com/'
    },
    backend:        {
        api:     {
            host: 'https://api.smartscrumpoker.com/'
        },
        wss_api: {
            host: 'wss://api.smartscrumpoker.com/ws'
        }
    },
    ids:            {
        host: 'https://identity-service.smartscrumpoker.com/'
    }
};
