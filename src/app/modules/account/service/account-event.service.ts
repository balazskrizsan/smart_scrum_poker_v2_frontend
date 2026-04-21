import {
    EventEmitter,
    Injectable
}                       from "@angular/core";
import {Router}         from "@angular/router";
import {EventEnum}      from "../enums/event-enum";
import {IdsUserService} from "../../../services/ids-user-service";

@Injectable()
export class AccountEventService
{
    protected accountEvents: EventEmitter<EventEnum> = new EventEmitter<EventEnum>();
    private currentUserFromOidc: any = null;

    constructor(
      protected router: Router,
      private idsUserService: IdsUserService
    )
    {
    }

    public getAccountEvents(): EventEmitter<EventEnum>
    {
        return this.accountEvents;
    }
}
