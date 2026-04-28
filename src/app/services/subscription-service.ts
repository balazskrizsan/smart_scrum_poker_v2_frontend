import {Injectable}                       from "@angular/core";
import {StateListenerFactory}             from "../modules/poker/factories/state-listener-factory.service";
import {VoteListenerFactory}              from "../modules/poker/factories/vote-listener-factory";
import {PokerStartListenerFactory}        from "../modules/poker/factories/poker-start-listener-factory";
import {SessionClosedListenerFactory}     from "../modules/poker/factories/session-closed-listener-factory";
import {RoundStartListenerFactory}        from "../modules/poker/factories/round-start-listener-factory";
import {VoteNewJoinerListenerFactory}     from "../modules/poker/factories/vote-new-joiner-listener-factory";
import {VoteStopListenerFactory}          from "../modules/poker/factories/vote-stop-listener-factory";
import {TicketCloseListenerFactory}       from "../modules/poker/factories/ticket-close-listener-factory";
import {TicketOpenListenerFactory}        from "../modules/poker/factories/ticket-open-listener-factory";
import {PokerTicketDeleteListenerFactory} from "../modules/poker/factories/poker-ticket-delete-listener-factory.service";
import {ISubscriptionListener}            from "../modules/poker/interfaces/i-subscription-listener";
import {RxStompService}                   from "../modules/commons/services/rx-stomp-service";
import {AddTicketListenerFactory}         from "../modules/poker/factories/add-ticket-listener-factory";
import {VoterLeavingFactory}              from "../modules/poker/factories/voter-leaving-factory";
import {SocketDestination}                from "../modules/commons/enums/socket-destination";
import {PokerStateStore}                  from "../modules/poker/poker-state-store.service";
import {IdsUserService}                   from "./ids-user-service";

@Injectable()
export class SubscriptionService
{
    private readonly listeners: ISubscriptionListener<any>[] = [];

    public constructor(
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
        let state = this.pokerStateStore.state;

        if (state?.pokerPublicIdFromQueryParams != null)
        {
            this.rxStompService.publish(
              SocketDestination.SEND__POKER__VOTER_LEAVING,
              {
                  userIdSecure:  sub,
                  pokerIdSecure: state.pokerPublicIdFromQueryParams
              }
            );
            this.pokerStateStore.reset();
        }

        this.listeners.map(l => this.rxStompService.unsubscribe(l));
        this.listeners.length = 0;
    }
}
