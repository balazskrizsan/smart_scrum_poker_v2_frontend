import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";

@Component(
  {
      templateUrl: '../views/faq.html',
  }
)
export class FaqActionComponent implements OnInit
{
    public pageTitle = 'FAQ - Smart Scrum Poker';

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
