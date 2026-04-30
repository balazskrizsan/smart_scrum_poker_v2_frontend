import {environment}  from '../../environments/environment';
import {LoggingGroup} from "./enums/logging-group";
import {LoggingLevel} from "./enums/logging-level";
import {EnumService}  from "./enum-service";

export class LoggingService
{
    private readonly isEnabled = !environment.production;
    private readonly defaultLoglevel = environment.loggingService.levels.default;
    private prefix = '';
    private loggingGroup: Array<LoggingGroup> = [];

    public setPrefix(prefix: string): this
    {
        this.prefix = prefix;

        return this;
    }

    public setGroups(...loggingGroup: Array<LoggingGroup>): this
    {
        this.loggingGroup = loggingGroup;

        return this;
    }

    private log(level: LoggingLevel, message: string, logFn: (msg: string, data?: any) => void, data?: any): void
    {
        if (!this.isLogWriteEnabled(level))
        {
            return;
        }

        let prefixWithSpace = this.prefix.length > 0 ? this.prefix + ' ' : '';

        logFn(`${prefixWithSpace}[${EnumService.getEnumKey(LoggingLevel, level)}] ${message}`, data);
    }

    private isLogWriteEnabled(level: LoggingLevel): boolean
    {
        if (level < this.defaultLoglevel)
        {
            return false;
        }

        if (!this.isEnabled)
        {
            return false;
        }

        return true;
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
