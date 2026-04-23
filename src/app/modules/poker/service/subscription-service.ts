import {Injectable}                       from "@angular/core";
import {StateListenerFactory}             from "../factories/state-listener-factory.service";
import {VoteListenerFactory}              from "../factories/vote-listener-factory";
import {PokerStartListenerFactory}        from "../factories/poker-start-listener-factory";
import {SessionClosedListenerFactory}     from "../factories/session-closed-listener-factory";
import {RoundStartListenerFactory}        from "../factories/round-start-listener-factory";
import {VoteNewJoinerListenerFactory}     from "../factories/vote-new-joiner-listener-factory";
import {VoteStopListenerFactory}          from "../factories/vote-stop-listener-factory";
import {TicketCloseListenerFactory}       from "../factories/ticket-close-listener-factory";
import {TicketOpenListenerFactory}        from "../factories/ticket-open-listener-factory";
import {PokerTicketDeleteListenerFactory} from "../factories/poker-ticket-delete-listener-factory.service";
import {ISubscriptionListener}            from "../interfaces/i-subscription-listener";
import {RxStompService}                   from "../../commons/services/rx-stomp-service";
import {AddTicketListenerFactory}         from "../factories/add-ticket-listener-factory";
import {VoterLeavingFactory}              from "../factories/voter-leaving-factory";
import {SocketDestination}                from "../../commons/enums/socket-destination";
import {AccountEventService}              from "../../account/service/account-event.service";
import {PokerStateStore}                  from "../poker-state-store.service";
import {IPokerState}                      from "../interfaces/i-poker-state";
import {IdsUserService}                   from "../../../services/ids-user-service";

@Injectable()
export class SubscriptionService
{
    private readonly listeners: ISubscriptionListener<any>[] = [];

    public constructor(
      private accountService: AccountEventService,
      private idsUserService: IdsUserService,
      private pokerStateStore: PokerStateStore,
      private rxStompService: RxStompService,
      private gameStateListenerFactory: StateListenerFactory,
      private voteListenerFactory: VoteListenerFactory,
      private pokerStartListenerFactory: PokerStartListenerFactory,
      private sessionClosedListenerFactory: SessionClosedListenerFactory,
      private roundStartListenerFactory: RoundStartListenerFactory,
      private voteNewJoinerListenerFactory: VoteNewJoinerListenerFactory,
      private voteStopListenerFactory: VoteStopListenerFactory,
      private ticketCloseListenerFactory: TicketCloseListenerFactory,
      private ticketOpenListenerFactory: TicketOpenListenerFactory,
      private ticketDeleteListenerFactory: PokerTicketDeleteListenerFactory,
      private addTicketListenerFactory: AddTicketListenerFactory,
      private voterLeavingFactory: VoterLeavingFactory
    )
    {
    }

    public subscribe()
    {
        this.listeners.push(this.gameStateListenerFactory.create());
        this.listeners.push(this.pokerStartListenerFactory.create());
        this.listeners.push(this.voteListenerFactory.create());
        this.listeners.push(this.sessionClosedListenerFactory.create());
        this.listeners.push(this.roundStartListenerFactory.create());
        this.listeners.push(this.voteNewJoinerListenerFactory.create());
        this.listeners.push(this.voteStopListenerFactory.create());
        this.listeners.push(this.ticketCloseListenerFactory.create());
        this.listeners.push(this.ticketOpenListenerFactory.create());
        this.listeners.push(this.ticketDeleteListenerFactory.create());
        this.listeners.push(this.addTicketListenerFactory.create());
        this.listeners.push(this.voterLeavingFactory.create());
    }

    public unsubscribe()
    {
        let sub = this.idsUserService.subOrRedirectToLogin;
        let state: IPokerState = this.pokerStateStore.state;

        if (state?.pokerPublicIdFromQueryParams)
        {
            this.rxStompService.publish(
              SocketDestination.SEND__POKER__VOTER_LEAVING,
              {
                  userIdSecure:  sub,
                  pokerIdSecure: state.pokerPublicIdFromQueryParams
              }
            );
        }
        this.listeners.map(l => this.rxStompService.unsubscribe(l));
    }
}
