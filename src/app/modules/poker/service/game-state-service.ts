import {Injectable}      from "@angular/core";
import {IStdApiResponse} from "../../../interfaces/i-std-api-response";
import {IStateResponse}  from "../interfaces/i-state-response";
import {PokerStateStore} from "../poker-state-store.service";
import {LoggingService}  from "../../../services/logging.service";
import {LoggingGroup}    from "../../../services/enums/logging-group";

@Injectable()
export class GameStateService
{
    private log = new LoggingService().setGroups(LoggingGroup.POKER);

    public constructor(private pokerStateStore: PokerStateStore)
    {
    }

    public setGameState(body: IStdApiResponse<IStateResponse>)
    {
        const votes: { [key: string]: any } = {};
        const userVoteStats: { [key: string]: any } = {};
        const idsUsersWithSession: { [key: string]: boolean } = {};

        Object.entries(body.data.votesWithVoteStatList).forEach(([key, value]) =>
        {
            votes[key] = value.votes;
            userVoteStats[key] = value.voteStat;
        });

        body.data.idsUsersWithSession.forEach(iu =>
        {
            idsUsersWithSession[iu.id] = true;
        });

        let possibleStartedTickets = body.data.tickets.filter(t => t.isActive);
        let activeTicketId = 0;
        let openedTicketId = 0;

        if (possibleStartedTickets.length > 1)
        {
            throw new Error('More than 1 voting started');
        }

        if (possibleStartedTickets.length == 1)
        {
            activeTicketId = possibleStartedTickets.pop().id;
            openedTicketId = activeTicketId;
        }

        this.pokerStateStore.updateState({
            poker:               body.data.poker,
            tickets:             body.data.tickets,
            userProfiles:        body.data.userProfiles,
            votes:               votes,
            userVoteStats:       userVoteStats,
            finishedTicketIds:   Object.keys(body.data.votes).map(k => Number(k)),
            ownerIdsUserId:      body.data.owner.id,
            idsUsersWithSession: idsUsersWithSession,
            activeTicketId:      activeTicketId,
            openedTicketId:      openedTicketId,
            initDone:            true
        });

        this.log.info("Poker state set", this.pokerStateStore.state);
    }
}
