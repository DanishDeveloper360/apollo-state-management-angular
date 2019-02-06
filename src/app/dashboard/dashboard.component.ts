import { Component, OnInit } from "@angular/core";
import { Hero } from "../hero";
import { Apollo } from "apollo-angular-boost";
import gql from "graphql-tag";

const heroQuery = gql`
  query GetHeros {
    currentHeros @client {
      id
      name
    }
  }
`;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.apollo
      .watchQuery<Hero[]>({
        query: heroQuery
      })
      .valueChanges.subscribe(result => {
         this.heroes = result.data['currentHeros'];
      });
  }
}
