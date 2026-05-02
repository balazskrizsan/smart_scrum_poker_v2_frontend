import {Injectable} from "@angular/core";
import {
    BehaviorSubject,
    Observable
}                   from "rxjs";
import {IPoker}     from "./interfaces/i-poker";

@Injectable()
export class MyPokersStateStore
{
    private stateBS = new BehaviorSubject<Array<IPoker>>([]);
    private _state$ = this.stateBS.asObservable();

    public setMyPokers(pokers: Array<IPoker>): void
    {
        this.stateBS.next(pokers);
    }

    public get state$(): Observable<Array<IPoker>>
    {
        return this._state$;
    }
}
