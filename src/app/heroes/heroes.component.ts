import { Component, OnInit } from "@angular/core";

import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { Apollo } from "apollo-angular-boost";
import gql from "graphql-tag";

const addHeroQuery = gql`
  mutation addHero($item: String) {
    addHero(item: $item) @client
  }
`;

const heroQuery = gql`
  query GetHeros {
    currentHeros @client
  }
`;

@Component({
  selector: "app-heroes",
  templateUrl: "./heroes.component.html",
  styleUrls: ["./heroes.component.css"]
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];

  constructor(private heroService: HeroService, private apollo: Apollo) {}

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.apollo
      .watchQuery<Hero[]>({
        query: heroQuery
      })
      .valueChanges.subscribe(result => {
        this.heroes = result.data["currentHeros"];
      });
  }

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }

    this.apollo
      .mutate({
        mutation: addHeroQuery,
        variables: { item: { id: Math.floor(Math.random() * 10), name: name } }
      })
      .subscribe();

    // this.heroService.addHero({ name } as Hero)
    //   .subscribe(hero => {
    //     this.heroes.push(hero);
    //   });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }
}
