import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { gql, Apollo } from "apollo-angular-boost";

const heroQuery = gql`
  query heros($id: Int!) {
    heros(id: $id) @client {
      id
      name
    }
  }
`;

@Component({
  selector: "app-hero-detail",
  templateUrl: "./hero-detail.component.html",
  styleUrls: ["./hero-detail.component.css"]
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = this.route.snapshot.paramMap.get("id").toString();
    this.apollo
    .query<Hero[]>({
      query: heroQuery,
      variables: { id : id }
    })
    .subscribe(hero => (this.hero = hero.data['heros'][0]));
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
  }
}
