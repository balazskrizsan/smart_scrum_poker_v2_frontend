import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges
}                          from "@angular/core";
import {SocketDestination} from "../../commons/enums/socket-destination";
import {RxStompService}    from "../../commons/services/rx-stomp-service";
import {IPokerState}       from "../interfaces/i-poker-state";
import {ITicket}           from "../interfaces/i-ticket";
import {
    CommonModule,
    KeyValue
}                          from "@angular/common";
import {IdsUserService}    from "../../../services/ids-user-service";
import {IStoryPointConfig} from "../interfaces/i-story-point-config";

@Component({
    selector:    'app-voter-table',
    standalone:  true,
    imports:     [CommonModule],
    templateUrl: './views/voter-table.html',
    providers:   [],
})
export class VoterTableComponent implements OnInit, OnChanges
{
    @Input() state: IPokerState;
    @Input() ticket: ITicket;
    protected votes: Record<string, number> = {};

    constructor(
      private rxStompService: RxStompService,
      private idsUserService: IdsUserService,
    )
    {
    }

    ngOnInit(): void
    {
        this.initializeVotes();
    }

    ngOnChanges(changes: SimpleChanges): void
    {
        if (changes['state'] && changes['state'].currentValue)
        {
            this.initializeVotes();
        }
    }

    private initializeVotes(): void
    {
        if (this.state.storyPointConfig?.dimensionsConfig && Array.isArray(this.state.storyPointConfig.dimensionsConfig))
        {
            this.state.storyPointConfig.dimensionsConfig.forEach(dimension =>
            {
                const dimensionName = dimension.name.toLowerCase();
                this.votes[dimensionName] = 0;
            });
        }
    }

    protected get voteTypeIdMap(): Record<number, string>
    {
        if (!this.state.storyPointConfig?.dimensionsConfig || !Array.isArray(this.state.storyPointConfig.dimensionsConfig))
        {
            return {};
        }

        const map: Record<number, string> = {};
        this.state.storyPointConfig.dimensionsConfig.forEach((dimension, index) =>
        {
            map[index] = dimension.name.toLowerCase();
        });

        return map;
    }

    protected get voteConfig(): Array<Record<string, Record<string, number>>>
    {
        if (!this.state.storyPointConfig?.dimensionsConfig || !Array.isArray(this.state.storyPointConfig.dimensionsConfig))
        {
            return [];
        }

        return this.state.storyPointConfig.dimensionsConfig.map((dimension, index) =>
        {
            const sizeValues: Record<string, number> = {};
            if (Array.isArray(dimension.sizeValues))
            {
                dimension.sizeValues.forEach(sizeValue =>
                {
                    sizeValues[sizeValue.name] = sizeValue.value;
                });
            }

            return {[index.toString()]: sizeValues};
        });
    }

    protected asStringNumberRecord(obj: object): Record<string, number>
    {
        return obj as Record<string, number>;
    }

    protected compareKeys: (a: KeyValue<string, number>, b: KeyValue<string, number>) =>
      number = (a: KeyValue<string, number>, b: KeyValue<string, number>) => parseInt(a.key) - parseInt(b.key);

    protected getButtonClass(voteTypeId: number, vote: number): string
    {
        return vote == this.votes[this.voteTypeIdMap[voteTypeId]] ? 'btn-primary' : 'btn-smoke btn-light-bg';
    }

    protected setVote(voteTypeId: number, vote: number): void
    {
        this.votes[this.voteTypeIdMap[voteTypeId]] = vote;
    }

    protected isVoteSendable(): boolean
    {
        if (!this.state.storyPointConfig?.dimensionsConfig || !Array.isArray(this.state.storyPointConfig.dimensionsConfig))
        {
            return false;
        }

        const dimensionNames = this.state.storyPointConfig.dimensionsConfig.map(d => d.name.toLowerCase());
        return dimensionNames.every(name => this.votes[name] > 0);
    }

    protected send()
    {
        const dimensionValues: Record<string, string> = {};

        if (this.state.storyPointConfig?.dimensionsConfig && Array.isArray(this.state.storyPointConfig.dimensionsConfig))
        {
            this.state.storyPointConfig.dimensionsConfig.forEach(dimension =>
            {
                const dimensionName = dimension.name.toLowerCase();
                const selectedValue = this.votes[dimensionName];

                // Find the size name for the selected value
                if (Array.isArray(dimension.sizeValues))
                {
                    const sizeValue = dimension.sizeValues.find(sv => sv.value === selectedValue);
                    if (sizeValue)
                    {
                        dimensionValues[dimensionName] = sizeValue.name;
                    }
                }
            });
        }

        this.rxStompService.publish(
          SocketDestination.SEND_POKER_VOTE
            .replace("{pokerIdSecure}", this.state.pokerPublicIdFromQueryParams)
            .replace("{ticketId}", this.ticket.id.toString(10)),
          {
              pokerPublicId:    this.state.pokerPublicIdFromQueryParams,
              ticketId:         this.ticket.id,
              dimensionValues:  dimensionValues
          }
        );
    }
}
