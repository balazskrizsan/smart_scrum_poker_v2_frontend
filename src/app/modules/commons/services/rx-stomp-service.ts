import {Injectable}            from "@angular/core";
import {RxStomp}               from "@stomp/rx-stomp";
import {SocketDestination}     from "../enums/socket-destination";
import {
    map,
    take,
    tap
}                              from "rxjs/operators";
import {IStdApiResponse}       from "../../../interfaces/i-std-api-response";
import {filter}                from "rxjs";
import {ISubscriptionListener} from "../../poker/interfaces/i-subscription-listener";
import {environment}           from '../../../../environments/environment';
import {AuthService}           from "../../../services/auth.service";
import {IdsUserService}        from "../../../services/ids-user-service";

@Injectable()
export class RxStompService
{
    private rxStomp: RxStomp = null;
    private headers: any = {};

    constructor(
      private authService: AuthService,
      private idsUserService: IdsUserService,
      )
    {
        this.initializeConnection();
    }

    private initializeConnection(): void
    {
        this.authService.getAccessToken$().pipe(take(1)).subscribe(token =>
        {
            if (!token) return;

            console.log("=============== Token received:", token);
            this.checkAuthenticationAndConnect();
        });
    }

    private checkAuthenticationAndConnect(): void
    {
        this.idsUserService.isAuthenticated$().pipe(take(1)).subscribe(isAuth =>
        {
            console.log("=============== Authentication status:", isAuth);

            if (!isAuth)
            {
                this.refreshTokenAndConnect();
            } else
            {
                console.log("Token is valid");
                this.setupStompConnection();
            }
        });
    }

    private refreshTokenAndConnect(): void
    {
        console.log("=============== Token expired, attempting refresh...");
        this.authService.forceRefreshToken().pipe(take(1)).subscribe(refreshed =>
        {
            if (refreshed)
            {
                console.log("=============== Token refreshed successfully");
                this.setupStompConnection();
            } else
            {
                console.log("=============== Token refresh failed, user may need to re-login");
                // @todo: relogin
            }
        });
    }

    private setupStompConnection(): void
    {
        this.authService.getAccessToken$().pipe(take(1)).subscribe(token =>
        {
            if (token)
            {
                this.headers["Authorization"] = "Bearer " + token;
                this.rxStomp.configure({
                    brokerURL:      environment.backend.wss_api.host,
                    connectHeaders: this.headers,
                });
                this.rxStomp.deactivate().then(() =>
                {
                    this.rxStomp.activate();
                });
                console.log("Reconnect done");
            }
        });
    }

    public get(): RxStomp
    {
        if (null != this.rxStomp && this.rxStomp.connected())
        {
            return this.rxStomp;
        }

        this.rxStomp = new RxStomp();
        
        // Ensure we have the current token before connecting
        this.authService.getAccessToken$().pipe(take(1)).subscribe(token =>
        {
            if (token)
            {
                this.headers["Authorization"] = "Bearer " + token;
                this.rxStomp.configure({
                    brokerURL:      environment.backend.wss_api.host,
                    connectHeaders: this.headers,
                });
                this.rxStomp.activate();
                console.log("Socket connected with token");
            }
        });

        return this.rxStomp;
    }

    public getSubscription<T>(destination: string, socketDestinationFilter: SocketDestination): ISubscriptionListener<T>
    {
        console.log(">>>> New socket subscription: ", {'destination': destination, 'filter': socketDestinationFilter});

        try
        {
            var observable = this.get()
              .watch({destination: destination})
              .pipe(
                map((message): IStdApiResponse<T> => JSON.parse(message.body).body),
                filter(body => body.socketResponseDestination == socketDestinationFilter),
                tap(body => console.log(">>>> Socket response:", {destination, socketDestinationFilter, body})),
              );

            return {observable, destination, socketDestinationFilter, $subscription: null}
        }
        catch (e)
        {
            console.log(e);

            throw new Error("Can't start socket connection: " + destination);
        }
    }

    public unsubscribe<T>(handler: ISubscriptionListener<T>): void
    {
        console.log(">>>> Unsubscription: ", {
            destination:             handler.destination,
            socketDestinationFilter: handler.socketDestinationFilter
        });
        handler.$subscription.unsubscribe();
    }

    public publish(destination: string, rawBody)
    {
        if (null == this.rxStomp)
        {
            this.get();
        }

        var publication = {
            destination: destination,
            body:        JSON.stringify(rawBody)
        };

        console.log(">>>> Socket publication: ", publication);

        this.rxStomp.publish(publication);
    }
}
