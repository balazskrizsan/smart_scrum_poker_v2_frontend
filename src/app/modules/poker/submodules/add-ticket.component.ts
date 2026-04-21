import {
    Component,
    Input
}                          from "@angular/core";
import {IPokerState}       from "../interfaces/i-poker-state";
import {
    FormGroup,
    ReactiveFormsModule
}                          from "@angular/forms";
import {NewTicketForm}     from "./forms";
import {SocketDestination} from "../../commons/enums/socket-destination";
import {RxStompService}    from "../../commons/services/rx-stomp-service";
import {IdsUserService}    from "../../../services/ids-user-service";

@Component({
    selector:    'add-ticket',
    standalone:  true,
    templateUrl: './views/add-ticket.html',
    imports:     [ReactiveFormsModule],
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
      protected idsUserService: IdsUserService,
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
              userIdSecure:  this.idsUserService.sub,
              pokerIdSecure: this.state.poker.publicId,
              ticketName:    this.forms.getField("ticketName").getRawValue(),
          }
        );
    }
}
