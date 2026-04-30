import {IStdApiResponse}        from "../../../interfaces/i-std-api-response";
import {IVoteNewJoinerResponse} from "../interfaces/i-vote-new-joiner-response";
import {PokerStateStore}        from "../poker-state-store.service";
import {Injectable}             from "@angular/core";
import {LoggingService}         from "../../../services/logging.service";

@Injectable()
export class VoteNewJoinerService
{
    private loggingService = new LoggingService();

    constructor(private pokerStateStore: PokerStateStore)
    {
    }

    public setVoteNewJoiner(body: IStdApiResponse<IVoteNewJoinerResponse>)
    {
        const userProfile = body.data.userProfile;
        this.pokerStateStore.addInPokerUserProfile(userProfile);
        this.pokerStateStore.setIdsUserSession(userProfile.userId, true);
        this.loggingService.info("New joiner", userProfile)
    }
}
