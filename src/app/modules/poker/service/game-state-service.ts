import {Injectable}      from "@angular/core";
import {IStdApiResponse} from "../../../interfaces/i-std-api-response";
import {IStateResponse}  from "../interfaces/i-state-response";
import {PokerStateStore} from "../poker-state-store.service";
import {LoggingService}  from "../../../services/logging.service";
import {LoggingGroup}    from "../../../services/enums/logging-group";
import {IStoryPointConfig} from "../interfaces/i-story-point-config";

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
            initDone:            true,
            storyPointConfig:    this.parseStoryPointConfig(body.data.storyPointConfig)
        });

        this.log.info("Poker state set", this.pokerStateStore.state);
    }

    private parseStoryPointConfig(config: any): IStoryPointConfig
    {
        try
        {
            if (typeof config.dimensionsConfig === 'string')
            {
                config.dimensionsConfig = JSON.parse(config.dimensionsConfig);
            }

            if (typeof config.sizesConfig === 'string')
            {
                config.sizesConfig = JSON.parse(config.sizesConfig);
            }

            if (typeof config.pointsMapping === 'string')
            {
                config.pointsMapping = JSON.parse(config.pointsMapping);
            }

            if (Array.isArray(config.dimensionsConfig))
            {
                config.dimensionsConfig = config.dimensionsConfig.map((dimension: any) =>
                {
                    if (typeof dimension.sizeValues === 'string')
                    {
                        dimension.sizeValues = JSON.parse(dimension.sizeValues);
                    }
                    return dimension;
                });
            }

            return config;
        }
        catch (e)
        {
            console.error('Error parsing storyPointConfig:', e);

            return config;
        }
    }
}
