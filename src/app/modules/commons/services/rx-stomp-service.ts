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
import {LoggingService}        from "../../../services/logging.service";
import {LoggingGroup}          from "../../../services/enums/logging-group";

@Injectable({
    providedIn: 'root'
})
export class RxStompService
{
    private authLoggingService = new LoggingService().setGroups(LoggingGroup.OIDC);
    private socketLoggingService = new LoggingService().setGroups(LoggingGroup.SOCKET);
    private rxStomp: RxStomp = null;
    private headers: any = {};
    private currentToken: string = null;
    private isConnecting: boolean = false;

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

            this.checkAuthenticationAndConnect();
        });
    }

    private checkAuthenticationAndConnect(): void
    {
        this.idsUserService.isAuthenticated$().pipe(take(1)).subscribe(isAuth =>
        {
            this.authLoggingService.info("Authentication status:", isAuth);

            if (!isAuth)
            {
                this.refreshTokenAndConnect();
            } else
            {
                this.setupStompConnection();
            }
        });
    }

    private refreshTokenAndConnect(): void
    {
        this.authLoggingService.info("Token expired, attempting refresh...");
        this.authService.forceRefreshToken().pipe(take(1)).subscribe(refreshed =>
        {
            if (refreshed)
            {
                this.authLoggingService.info("Token refreshed successfully");
                this.setupStompConnection();
            } else
            {
                this.authLoggingService.info("Token refresh failed, user may need to re-login");
                // @todo: relogin
            }
        });
    }

    private setupStompConnection(): void
    {
        if (this.isConnecting) return;

        this.authService.getAccessToken$().pipe(take(1)).subscribe(token =>
        {
            if (!token) return;

            if (this.currentToken === token && this.rxStomp && this.rxStomp.connected())
            {
                this.socketLoggingService.info("Already connected with valid token, skipping reconnect");
                return;
            }

            this.isConnecting = true;
            this.currentToken = token;
            this.headers["Authorization"] = "Bearer " + token;

            if (!this.rxStomp)
            {
                this.rxStomp = new RxStomp();
            }

            this.rxStomp.configure({
                brokerURL:      environment.backend.wss_api.host,
                connectHeaders: this.headers,
            });

            this.rxStomp.deactivate().then(() =>
            {
                return this.rxStomp.activate();
            }).then(() =>
            {
                this.isConnecting = false;
                this.socketLoggingService.info("Reconnect done");
            }).catch(err =>
            {
                this.isConnecting = false;
                this.socketLoggingService.error("Connection error:", err);
            });
        });
    }

    public get(): RxStomp
    {
        if (null != this.rxStomp && this.rxStomp.connected())
        {
            return this.rxStomp;
        }

        if (!this.rxStomp)
        {
            this.rxStomp = new RxStomp();
        }

        this.setupStompConnection();

        return this.rxStomp;
    }

    public getSubscription<T>(destination: string, socketDestinationFilter: SocketDestination): ISubscriptionListener<T>
    {
        this.socketLoggingService.info(
          "New socket subscription: ",
          {'destination': destination, 'filter': socketDestinationFilter}
        );

        try
        {
            var observable = this.get()
              .watch({destination: destination})
              .pipe(
                map((message): IStdApiResponse<T> => JSON.parse(message.body).body),
                filter(body => body.socketResponseDestination == socketDestinationFilter),
                tap(body => this.socketLoggingService.info(
                  "Socket response:",
                  {destination, socketDestinationFilter, body}
                )),
              );

            return {observable, destination, socketDestinationFilter, $subscription: null}
        }
        catch (e)
        {
            this.authLoggingService.error(e);

            throw new Error("Can't start socket connection: " + destination);
        }
    }

    public unsubscribe<T>(handler: ISubscriptionListener<T>): void
    {
        this.socketLoggingService.info("Unsubscription: ", {
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

        this.socketLoggingService.info("Socket publication: ", publication);

        this.rxStomp.publish(publication);
    }
}
