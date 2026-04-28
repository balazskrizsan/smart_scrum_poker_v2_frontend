import {Injectable} from "@angular/core";
import {Router}     from "@angular/router";

@Injectable()
export class RouterNavigateService
{
    public constructor(private router: Router)
    {
    }

    public navigateToPoker(pokerIdSecure: string): Promise<boolean>
    {
        return this.router.navigate(['/poker/display/' + pokerIdSecure]);
    }
}
