import {environment}   from '../../environments/environment';
import {LoggingGroup}  from "./enums/logging-group";
import {LoggingLevel}  from "./enums/logging-level";
import {EnumService}   from "./enum-service";
import {ILoggingGroup} from "./enums/i-logging-group";

// devtools usage: updateLoggingGroupLevel('POKER', 1);
(window as any).updateLoggingGroupLevel = (groupName: string, level: number) =>
{
    const group = LoggingGroup[groupName as keyof typeof LoggingGroup];
    if (group)
    {
        LoggingService.setManualLoggingGroup({id: group, level});
        console.log(`Logging enabled for ${groupName} with level ${EnumService.getEnumKey(LoggingLevel, level)}`);

        return;
    }

    console.error(`Unknown logging group: ${groupName}`);
};

export class LoggingService
{
    private static manualLoggingGroup: Array<ILoggingGroup> = [];
    private readonly defaultLoglevel = environment.loggingService.levels.default;
    private prefix = '';
    private loggingGroup: Array<LoggingGroup> = [];

    public setPrefix(prefix: string): this
    {
        this.prefix = prefix + ' ';

        return this;
    }

    public setGroups(...loggingGroup: Array<LoggingGroup>): this
    {
        this.loggingGroup = loggingGroup;

        return this;
    }

    public static setManualLoggingGroup(...loggingGroup: Array<ILoggingGroup>): void
    {
        LoggingService.manualLoggingGroup = loggingGroup;
    }

    private log(level: LoggingLevel, message: string, logFn: (msg: string, data?: any) => void, data?: any): void
    {
        if (!this.isLogWriteEnabled(level))
        {
            return;
        }

        logFn(`${this.prefix}[${EnumService.getEnumKey(LoggingLevel, level)}] ${message}`, data);
    }

    private isLogWriteEnabled(level: LoggingLevel): boolean
    {
        if (this.loggingGroup.length > 0)
        {
            for (const group of this.loggingGroup)
            {
                const manualGroupConfig = LoggingService.manualLoggingGroup.find(g => g.id === group);
                if (manualGroupConfig)
                {
                    return level >= manualGroupConfig.level;
                }

                const groupConfig = environment.loggingService.levels.groups.find(g => g.id === group);
                if (groupConfig)
                {
                    return level >= groupConfig.level;
                }
            }
        }

        return level >= this.defaultLoglevel;
    }

    public debug(message: string, data?: any): void
    {
        this.log(LoggingLevel.DEBUG, message, console.log, data);
    }

    public info(message: string, data?: any): void
    {
        this.log(LoggingLevel.INFO, message, console.info, data);
    }

    public warn(message: string, data?: any): void
    {
        this.log(LoggingLevel.WARN, message, console.warn, data);
    }

    public error(message: string, data?: any): void
    {
        this.log(LoggingLevel.ERROR, message, console.error, data);
    }
}
