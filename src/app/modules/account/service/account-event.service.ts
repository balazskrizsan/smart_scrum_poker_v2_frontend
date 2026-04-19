import {
    EventEmitter,
    Injectable
}                            from "@angular/core";
import {IUserProfile}        from "../interfaces/i-user-profile";
import {LocalStorageService} from "../../../services/local-storage-service";
import {Router}              from "@angular/router";
import {IStateResponse}      from "../../poker/interfaces/i-state-response";
import {EventEnum}           from "../enums/event-enum";
import {IdsUserService}      from "../../../services/ids-user-service";

@Injectable()
export class AccountEventService
{
    protected accountEvents: EventEmitter<EventEnum> = new EventEmitter<EventEnum>();
    private currentUserFromOidc: any = null;

    constructor(
      protected router: Router,
      private localStorageService: LocalStorageService,
      private idsUserService: IdsUserService
    )
    {
    }

    public getAccountEvents(): EventEmitter<EventEnum>
    {
        return this.accountEvents;
    }

    public getCurrentUserOrNull(): IUserProfile
    {
        try
        {
            return this.getCurrentUser();
        }
        catch (e)
        {
            return null;
        }
    }

    public getCurrentUser(): IUserProfile
    {
        const rawInsecureUser = this.idsUserService.userNickName;
        if (null == rawInsecureUser)
        {
            throw new Error("Not logged in");
        }

        return JSON.parse(rawInsecureUser);
    }
}
