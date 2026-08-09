import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";

@Component(
  {
      templateUrl: '../views/roadmap.html',
  }
)
export class RoadmapActionComponent implements OnInit
{
    public pageTitle = 'Roadmap - Smart Scrum Poker';

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
