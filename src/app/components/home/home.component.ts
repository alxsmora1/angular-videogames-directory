import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Game } from 'src/app/models';
import { HttpService } from '../../services/http.service';
import { APIResponse } from '../../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public sort: string;
  public games: Array<Game>;
  public routeSub: Subscription;
  public gameSub: Subscription;

  constructor(
    private HttpService: HttpService,
    private router: Router,
    private activateedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSub = this.activateedRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGames('metacritic', params['game-search']);
      } else {
        this.searchGames('metacritic');
      }
    });
  }

  searchGames(sort: string, search?: string): void {
    this.gameSub = this.HttpService.getGameList(sort, search).subscribe(
      (gameList: APIResponse<Game>) => {
        this.games = gameList.results;
        console.log(gameList);
      }
    );
  }

  openGameDetails(id: string) {
    this.router.navigate(['details', id]);
  }

  ngOnDestroy(): void {
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
