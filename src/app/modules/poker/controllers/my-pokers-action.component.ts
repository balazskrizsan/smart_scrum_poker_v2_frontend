import {Component, OnInit}   from '@angular/core';
import {Title}                 from "@angular/platform-browser";
import {Forms}               from '../forms';
import {FormGroup}           from "@angular/forms";
import {UrlService}          from "../../commons/services/url-service";
import {RouterModule}        from "@angular/router";
import {CommonModule}        from "@angular/common";
import {SubscriptionService} from "../../../services/subscription-service";
import {MyPokersStateStore}  from "../my-pokers-state-store.service";
import {SocketDestination}   from "../../commons/enums/socket-destination";
import {IdsUserService}      from "../../../services/ids-user-service";
import {RxStompService}      from "../../commons/services/rx-stomp-service";

@Component(
  {
      templateUrl: '../views/my-pokers.html',
      standalone:  true,
      imports:     [RouterModule, CommonModule],
      styleUrls:   [],
      providers:   [Forms],
  }
)
export class MyPokersActionComponent implements OnInit
{
    public pageTitle = 'My Pokers - Smart Scrum Poker';
    protected urlService = UrlService;
    protected form: FormGroup;
    protected myPokers$ = this.myPokersState.state$;

    public constructor(
      protected forms: Forms,
      private subscriptionService: SubscriptionService,
      private myPokersState: MyPokersStateStore,
      private idsUserService: IdsUserService,
      private rxStompService: RxStompService,
      private titleService: Title
    )
    {
        this.subscriptionService.subscribeMyPokers();

        let sub = this.idsUserService.subOrRedirectToLogin;
        this.rxStompService.publish(SocketDestination.POKER__MY_POKERS, {idsUserId: sub});
    }

    public ngOnInit(): void
    {
        this.titleService.setTitle(this.pageTitle);
    }
}
