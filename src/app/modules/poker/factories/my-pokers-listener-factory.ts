import {Injectable}            from "@angular/core";
import {IMyPokersResponse}     from "../interfaces/i-my-pokers-response";
import {SocketDestination}     from "../../commons/enums/socket-destination";
import {RxStompService}        from "../../commons/services/rx-stomp-service";
import {ISubscriptionListener} from "../interfaces/i-subscription-listener";
import {MyPokersStateStore}    from "../my-pokers-state-store.service";

@Injectable()
export class MyPokersListenerFactory
{
    public constructor(
      private rxStompService: RxStompService,
      private myPokersService: MyPokersStateStore,
    )
    {
    }

    public create(): ISubscriptionListener<IMyPokersResponse>
    {
        const listener = this.rxStompService.getSubscription<IMyPokersResponse>(
          '/user/queue/reply',
          SocketDestination.POKER__MY_POKERS
        );

        listener.$subscription = listener.observable.subscribe(
          (body) => this.myPokersService.setMyPokers(body.data.pokers)
        );

        return listener;
    }
}
