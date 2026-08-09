import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";

@Component(
  {
      templateUrl: '../views/contact.html',
  }
)
export class ContactActionComponent implements OnInit
{
    public pageTitle = 'Contact - Smart Scrum Poker';

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
