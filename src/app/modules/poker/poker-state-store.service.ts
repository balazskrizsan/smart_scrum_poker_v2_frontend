import {IPokerState}     from "./interfaces/i-poker-state";
import {Injectable}      from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {IUserProfile}    from "../account/interfaces/i-user-profile";
import _                 from 'lodash';

@Injectable()
export class PokerStateStore
{
    private _state: IPokerState = {
        tickets:                      [],
        inPokerUserProfiles:          [],
        idsUsersWithSession:          {},
        ownerIdsUserId:               null,
        userVoteStats:                {},
        pokerPublicIdFromQueryParams: null,
        poker:                        null,
        activeTicketId:               0,
        openedTicketId:               0,
        votes:                        {},
        userVotes:                    {},
        initDone:                     false,
        finishedTicketIds:            [],
    };

    private stateSubject = new BehaviorSubject<IPokerState>(this._state);
    public state$ = this.stateSubject.asObservable();

    public get state(): IPokerState
    {
        return this._state;
    }

    public setActiveTicketId(ticketId: number): void
    {
        this.updateState({activeTicketId: ticketId});
    }

    public setOpenedTicketId(ticketId: number): void
    {
        this.updateState({openedTicketId: ticketId});
    }

    public getActiveTicketId(): number
    {
        return this._state.activeTicketId;
    }

    public getOpenedTicketId(): number
    {
        return this._state.openedTicketId;
    }

    public addVote(ticketId: number, userProfile: IUserProfile): void
    {
        const updatedVotes = {...this._state.votes};
        if (!updatedVotes[ticketId])
        {
            updatedVotes[ticketId] = {};
        }
        updatedVotes[ticketId][userProfile.userId] = userProfile;
        this.updateState({votes: updatedVotes});
    }

    public setVotes(votes: any): void
    {
        this.updateState({votes: {...votes}});
    }

    public addFinishedTicketId(ticketId: number): void
    {
        const updatedFinishedTicketIds = [...this._state.finishedTicketIds];
        updatedFinishedTicketIds.push(ticketId);
        this.updateState({finishedTicketIds: updatedFinishedTicketIds});
    }

    public setUserVotes(ticketId: string, votes: any): void
    {
        const updatedUserVotes = {...this._state.userVotes};
        updatedUserVotes[ticketId] = votes;
        this.updateState({userVotes: updatedUserVotes});
    }

    public setUserVoteStats(ticketId: string, voteStats: any): void
    {
        const updatedUserVoteStats = {...this._state.userVoteStats};
        updatedUserVoteStats[ticketId] = voteStats;
        this.updateState({userVoteStats: updatedUserVoteStats});
    }

    public removeInGameUser(userIdSecure: string): void
    {
        const updatedInGameUsersWithSessions = {...this._state.idsUsersWithSession};
        updatedInGameUsersWithSessions[userIdSecure] = undefined;
        this.updateState({idsUsersWithSession: updatedInGameUsersWithSessions});
    }

    public addInPokerUserProfile(user: IUserProfile): void
    {
        const updatedInGameUsers = [...this._state.inPokerUserProfiles];
        if (!_.find(updatedInGameUsers, user))
        {
            updatedInGameUsers.push(user);
        }
        this.updateState({inPokerUserProfiles: updatedInGameUsers});
    }

    public setIdsUserSession(userId: string, hasSession: boolean): void
    {
        const updatedInGameUsersWithSessions = {...this._state.idsUsersWithSession};
        updatedInGameUsersWithSessions[userId] = hasSession;
        this.updateState({idsUsersWithSession: updatedInGameUsersWithSessions});
    }

    public addTicket(ticket: any): void
    {
        const updatedTickets = [...this._state.tickets];
        updatedTickets.push(ticket);
        this.updateState({tickets: updatedTickets});
    }

    public removeTicket(ticketId: number): void
    {
        const updatedTickets = this._state.tickets.filter(t => t.id !== ticketId);
        this.updateState({tickets: updatedTickets});
    }

    public removeTicketState(ticketId: number): void
    {
        const updatedVotes = {...this._state.votes};
        delete updatedVotes[ticketId];

        const updatedUserVotes = {...this._state.userVotes};
        delete updatedUserVotes[ticketId];

        const updatedUserVoteStats = {...this._state.userVoteStats};
        delete updatedUserVoteStats[ticketId];

        this.updateState({
            votes:         updatedVotes,
            userVotes:     updatedUserVotes,
            userVoteStats: updatedUserVoteStats
        });
    }

    public updateState(updates: Partial<IPokerState>): void
    {
        const currentValues = Object.keys(updates).reduce((acc, key) =>
        {
            acc[key] = this._state[key];
            return acc;
        }, {} as Partial<IPokerState>);

        console.log('Current state values before update:', currentValues);
        console.log('Updated state values after update:', updates);

        this._state = {...this._state, ...updates};
        this.stateSubject.next(this._state);
    }
}
