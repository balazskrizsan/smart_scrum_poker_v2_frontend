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
            default: LoggingLevel.INFO,
            groups:  loggingGroups,
        }
    },
    oidc:           {
        tokenRefreshInSeconds: 60, // 25min
        logLevel:              LogLevel.Error
    },
    frontend:       {
        host: 'https://localhost.balazskrizsan.com:3010/'
    },
    backend:        {
        api:     {
            host: 'https://localhost.balazskrizsan.com:4000/'
        },
        wss_api: {
            host: 'wss://localhost.balazskrizsan.com:4000/ws'
        }
    },
    ids:            {
        host: 'https://localhost.balazskrizsan.com:4040'
    }
};
