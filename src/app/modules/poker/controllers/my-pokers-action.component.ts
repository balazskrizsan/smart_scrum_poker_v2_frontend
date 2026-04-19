import {
    Component,
    OnDestroy
}                              from '@angular/core';
import {Forms}                 from '../forms';
import {FormGroup}             from "@angular/forms";
import {RxStompService}        from "../../commons/services/rx-stomp-service";
import {SocketDestination}     from "../../commons/enums/socket-destination";
import {BehaviorSubject}       from "rxjs";
import {ISubscriptionListener} from "../interfaces/i-subscription-listener";
import {IMyPokersResponse}     from "../interfaces/i-my-pokers-response";
import {IPoker}                from "../interfaces/i-poker";
import {UrlService}            from "../../commons/services/url-service";
import {RouterModule}          from "@angular/router";
import {CommonModule}          from "@angular/common";
import {IdsUserService}        from "../../../services/ids-user-service";

@Component(
  {
      templateUrl: '../views/my-pokers.html',
      standalone:  true,
      imports:     [RouterModule, CommonModule],
      styleUrls:   [],
      providers:   [Forms],
  }
)
export class MyPokersActionComponent implements OnDestroy
{
    protected urlService = UrlService;
    protected form: FormGroup;
    protected myPokersListener: ISubscriptionListener<IMyPokersResponse>;
    private myPokersSubjectBS = new BehaviorSubject<Array<IPoker>>([]);
    protected myPokers$ = this.myPokersSubjectBS.asObservable();

    public constructor(
      protected forms: Forms,
      private rxStompService: RxStompService,
      private idsUserService: IdsUserService,
    )
    {
        let sub = this.idsUserService.subOrRedirectToLogin;

        this.myPokersListener = this.rxStompService.getSubscription<IMyPokersResponse>(
          '/user/queue/reply',
          SocketDestination.POKER__MY_POKERS
        );

        this.myPokersListener.$subscription = this.myPokersListener.observable.subscribe(
          (body) => this.myPokersSubjectBS.next(body.data.pokers)
        );

        this.rxStompService.publish(SocketDestination.POKER__MY_POKERS, {idsUserId: sub});
    }

    ngOnDestroy(): void
    {
        this.rxStompService.unsubscribe(this.myPokersListener);
    }
}
