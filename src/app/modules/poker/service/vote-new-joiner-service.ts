import {IStdApiResponse}        from "../../../interfaces/i-std-api-response";
import {IVoteNewJoinerResponse} from "../interfaces/i-vote-new-joiner-response";
import {PokerStateStore}        from "../poker-state-store.service";
import {Injectable}             from "@angular/core";
import {LoggingService}         from "../../../services/logging.service";
import {LoggingGroup}           from "../../../services/enums/logging-group";

@Injectable()
export class VoteNewJoinerService
{
    private log = new LoggingService().setGroups(LoggingGroup.POKER);

    constructor(private pokerStateStore: PokerStateStore)
    {
    }

    public setVoteNewJoiner(body: IStdApiResponse<IVoteNewJoinerResponse>)
    {
        const userProfile = body.data.userProfile;
        this.pokerStateStore.addInPokerUserProfile(userProfile);
        this.pokerStateStore.setIdsUserSession(userProfile.userId, true);
        this.log.info("New joiner", userProfile)
    }
}
