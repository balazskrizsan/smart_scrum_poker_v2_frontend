import {
    Component,
    Input
}                    from "@angular/core";
import {CommonModule} from "@angular/common";
import {IPokerState} from "../interfaces/i-poker-state";

@Component({
    selector:    'app-online-voters',
    standalone:   true,
    templateUrl: './views/online-voters.html',
    imports:     [CommonModule],
    providers:   [],
})
export class OnlineVotersComponent
{
    @Input() state: IPokerState;
}
