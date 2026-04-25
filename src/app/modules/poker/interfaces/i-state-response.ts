import {IPoker} from "./i-poker";
import {ITicket}            from "./i-ticket";
import {IUserProfile}       from "../../account/interfaces/i-user-profile";
import {IVotesWithVoteStat} from "./i-votes-with-vote-stat";
import {IIdsUser} from "../../account/interfaces/i-ids-user";

export interface IStateResponse
{
    poker: IPoker;
    tickets: Array<ITicket>;
    userProfiles: Array<IUserProfile>;
    votes: Record<number, Record<string, IUserProfile>>;
    owner: IIdsUser;
    idsUsersWithSession: Array<IIdsUser>;
    votesWithVoteStatList: Record<number, IVotesWithVoteStat>;
    currentIdsUser: IIdsUser;
    currentUserProfile: IUserProfile;
}
