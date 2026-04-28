import {
    Component,
    OnDestroy,
    OnInit
}                              from '@angular/core';
import {Forms}                 from '../forms';
import {RxStompService}        from "../../commons/services/rx-stomp-service";
import {SocketDestination}     from "../../commons/enums/socket-destination";
import {ActivatedRoute}        from "@angular/router";
import {PokerStateStore}     from "../poker-state-store.service";
import {SubscriptionService} from "../../../services/subscription-service";
import {environment}         from '../../../../environments/environment';
import {CommonModule}          from "@angular/common";
import {TicketHeaderComponent} from "../submodules/ticket-header.component";
import {AddTicketComponent}    from "../submodules/add-ticket.component";
import {OnlineVotersComponent} from "../submodules/online-voters.component";
import {VoterListComponent}    from "../submodules/voter-list.component";
import {VoterTableComponent}   from "../submodules/voter-table.component";
import {FlashMessageService}   from "../../flash-message/services/flash-message-service";
import {IdsUserService}        from "../../../services/ids-user-service";
import {FlashMessageLevelEnum} from "../../flash-message/enums/flash-message-level-enum";

@Component({
    templateUrl: './../views/display.html',
    styleUrls:   ['./../views/display.scss'],
    standalone:  true,
    imports:     [
        CommonModule,
        TicketHeaderComponent,
        AddTicketComponent,
        OnlineVotersComponent,
        VoterListComponent,
        VoterTableComponent,
    ],
    providers:   [Forms],
})
export class DisplayActionComponent implements OnInit
{
    protected state$ = this.pokerStateStore.state$;
    protected appHost = environment.frontend.host;

    public constructor(
      private pokerStateStore: PokerStateStore,
      private rxStompService: RxStompService,
      private activatedRoute: ActivatedRoute,
      public idsUserService: IdsUserService,
      private subscriptionService: SubscriptionService,
      private flashMessageService: FlashMessageService,
    )
    {
        this.pokerStateStore.updateState({
            pokerPublicIdFromQueryParams: this.activatedRoute.snapshot.paramMap.get('pokerPublicId')
        });

        this.subscriptionService.subscribe();
    }

    protected copyShareLink(): void
    {
        const currentState = this.pokerStateStore.state;
        const shareUrl = `${this.appHost}poker/display/${currentState.pokerPublicIdFromQueryParams}`;
        navigator.clipboard.writeText(shareUrl).then(() =>
        {
            this.flashMessageService.push({
                messageLevel: FlashMessageLevelEnum.OK,
                message:      'Share link copied to clipboard'
            });
        }).catch(err =>
        {
            this.flashMessageService.push({
                messageLevel: FlashMessageLevelEnum.OK,
                message:      'Share link copy failed'
            });
        });
    }

    async ngOnInit(): Promise<void>
    {
        // @todo: redirect if not logged in

        const currentState = this.pokerStateStore.state;
        this.rxStompService.publish(
          SocketDestination.SEND_POKER_STATE
            .replace("{pokerPublicId}", currentState.pokerPublicIdFromQueryParams),
          ''
        );
    }
}
