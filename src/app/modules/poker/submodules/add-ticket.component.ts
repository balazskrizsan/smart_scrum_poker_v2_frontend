import {
    Component,
    Input
}                          from "@angular/core";
import {IPokerState}   from "../interfaces/i-poker-state";
import {
    FormGroup,
    FormsModule,
    ReactiveFormsModule
} from "@angular/forms";
import {NewTicketForm} from "./forms";
import {SocketDestination} from "../../commons/enums/socket-destination";
import {RxStompService}      from "../../commons/services/rx-stomp-service";
import {AccountEventService} from "../../account/service/account-event.service";

@Component({
    selector:    'add-ticket',
    standalone:   true,
    templateUrl: './views/add-ticket.html',
    imports: [ReactiveFormsModule],
    providers:   [NewTicketForm],
})
export class AddTicketComponent
{
    @Input() state: IPokerState;
    protected isOpen = false
    protected form: FormGroup;

    public constructor(
      protected forms: NewTicketForm,
      protected rxStompService: RxStompService,
      protected accountService: AccountEventService,
    )
    {
        this.form = this.forms.createCruForm();
    }

    protected toggleOpenState()
    {
        this.isOpen = !this.isOpen;
    }

    protected onSubmit()
    {
        this.isOpen = false;
        this.rxStompService.publish(
          SocketDestination.SEND__POKER__NEW_TICKET_CREATE,
          {
              userIdSecure:  this.accountService.getCurrentUser().userId,
              pokerIdSecure: this.state.poker.idSecure,
              ticketName:    this.forms.getField("ticketName").getRawValue(),
          }
        );
    }
}
