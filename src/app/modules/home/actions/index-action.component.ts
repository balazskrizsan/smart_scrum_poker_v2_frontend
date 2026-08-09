import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";

@Component(
  {
      templateUrl: '../views/home.html',
      standalone: true,
      styleUrls:   ['./../styles/home.scss'],
      providers:   [],
  }
)
export class IndexActionComponent implements OnInit
{
    public pageTitle = 'Home - Smart Scrum Poker';

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
