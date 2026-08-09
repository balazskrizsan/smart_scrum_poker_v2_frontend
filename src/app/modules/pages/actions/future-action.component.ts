import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";

@Component(
  {
      templateUrl: '../views/future.html',
  }
)
export class FutureActionComponent implements OnInit
{
    public pageTitle = 'Future - Smart Scrum Poker';

    public constructor(
      private titleService: Title
    )
    {
    }

    public ngOnInit(): void
    {
        this.titleService.setTitle(this.pageTitle);
    }
}
