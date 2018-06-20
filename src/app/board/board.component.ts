import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tile } from '../tile';
declare var $ : any;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  public tiles:Tile[][] = [
    [
      {id: 1, text: ''},
      {id: 2, text: ''},
      {id: 3, text: ''},
    ],[
      {id: 4, text: ''},
      {id: 5, text: ''},
      {id: 6, text: ''},
    ],
    [
      {id: 7, text: ''},
      {id: 8, text: ''},
      {id: 9, text: ''},
    ]
  ]

  message = '';
  availableAttacks = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  readonly playerSign = 'X';
  readonly cpuSign = 'O';

  constructor(private router:Router) { }

  ngOnInit() {

  }

  // Attack
  attack (tile) {
    if(tile.text != "") return;
    tile.text = this.playerSign;
    this.removeAvailableAttack(tile.id);
    this.cpuAttack();
    this.checkWinner();
  }

  // let CPU attack on Game
  cpuAttack() {
    let index = this.availableAttacks[Math.floor(Math.random()*this.availableAttacks.length)];
    let isCpuWinning = this.checkCpuWinning();

    if(isCpuWinning.isWinning) {
      this.removeAvailableAttack(isCpuWinning.move.id);
      isCpuWinning.move.text = this.cpuSign;
    }else {
      for(let t of this.tiles) {
        for(let item of t) {
          if(item.id == index){
            item.text = this.cpuSign;
            this.removeAvailableAttack(index);
            return;
          }
        }
      }
    }
    
  }

  // Helper : Remove Available Attacks
  removeAvailableAttack (index) {
    for(var i =0; i < this.availableAttacks.length; i++){
      if(this.availableAttacks[i] == index) {
        this.availableAttacks.splice(i, 1);
      }
    }
  }

  // Check winner
  checkWinner () {
    let t = this.tiles;

    // Check if Player is winning
    if((t[0][0].text == this.playerSign && t[0][1].text == this.playerSign && t[0][2].text == this.playerSign) ||
      (t[1][0].text == this.playerSign && t[1][1].text == this.playerSign && t[1][2].text == this.playerSign) ||
      (t[2][0].text == this.playerSign && t[2][1].text == this.playerSign && t[2][2].text == this.playerSign) ||
      (t[0][0].text == this.playerSign && t[1][0].text == this.playerSign && t[2][0].text == this.playerSign) ||
      (t[0][1].text == this.playerSign && t[1][1].text == this.playerSign && t[2][1].text == this.playerSign) ||
      (t[0][2].text == this.playerSign && t[1][2].text == this.playerSign && t[2][2].text == this.playerSign) ||
      (t[0][0].text == this.playerSign && t[1][1].text == this.playerSign && t[2][2].text == this.playerSign) ||
      (t[0][2].text == this.playerSign && t[1][1].text == this.playerSign && t[2][0].text == this.playerSign)){
        this.showModal("You Win");
        return;
      }

      // Check if CPU is winning
      if((t[0][0].text == this.cpuSign && t[0][1].text == this.cpuSign && t[0][2].text == this.cpuSign) ||
      (t[1][0].text == this.cpuSign && t[1][1].text == this.cpuSign && t[1][2].text == this.cpuSign) ||
      (t[2][0].text == this.cpuSign && t[2][1].text == this.cpuSign && t[2][2].text == this.cpuSign) ||
      (t[0][0].text == this.cpuSign && t[1][0].text == this.cpuSign && t[2][0].text == this.cpuSign) ||
      (t[0][1].text == this.cpuSign && t[1][1].text == this.cpuSign && t[2][1].text == this.cpuSign) ||
      (t[0][2].text == this.cpuSign && t[1][2].text == this.cpuSign && t[2][2].text == this.cpuSign) ||
      (t[0][0].text == this.cpuSign && t[1][1].text == this.cpuSign && t[2][2].text == this.cpuSign) ||
      (t[0][2].text == this.cpuSign && t[1][1].text == this.cpuSign && t[2][0].text == this.cpuSign)){
        this.showModal("CPU Win");
        return;       
      }

      // Draw
      if(this.availableAttacks.length == 0){
        this.showModal("Draw");
      }
  }

  // helpers : show modal
  showModal (message) {
    this.message = message;
    $('#myModal').modal({
      backdrop : 'static',
      show : true
    })
  }

  // reset board
  playAgain () {
    this.availableAttacks = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.tiles = [
      [
        {id: 1, text: ''},
        {id: 2, text: ''},
        {id: 3, text: ''},
      ],[
        {id: 4, text: ''},
        {id: 5, text: ''},
        {id: 6, text: ''},
      ],
      [
        {id: 7, text: ''},
        {id: 8, text: ''},
        {id: 9, text: ''},
      ]
    ];
    $('#myModal').modal('toggle')
  }

  checkCpuWinning () {
    let t = this.tiles;

    if(t[0][0].text == this.cpuSign && t[0][1].text == this.cpuSign && t[0][2].text == "" ||
      t[0][0].text == this.cpuSign && t[0][2].text == this.cpuSign && t[0][1].text == "" ||
      t[0][1].text == this.cpuSign && t[0][2].text == this.cpuSign && t[0][0].text == ""){

        return this.predictAttack([
          t[0][0],
          t[0][1],
          t[0][2]
        ]);
    }

    if(t[1][0].text == this.cpuSign && t[1][1].text == this.cpuSign && t[1][2].text == "" ||
      t[1][0].text == this.cpuSign && t[1][2].text == this.cpuSign && t[1][1].text == "" ||
      t[1][1].text == this.cpuSign && t[1][2].text == this.cpuSign && t[1][0].text == ""){

        return this.predictAttack([
          t[1][0],
          t[1][1],
          t[1][2]
        ])
    }

    if(t[2][0].text == this.cpuSign && t[2][1].text == this.cpuSign && t[2][2].text == "" ||
      t[2][0].text == this.cpuSign && t[2][2].text == this.cpuSign && t[2][1].text == "" ||
      t[2][1].text == this.cpuSign && t[2][2].text == this.cpuSign && t[2][0].text == "" ){

        return this.predictAttack([
          t[2][0],
          t[2][1],
          t[2][2]
        ])
    }

    if(t[0][0].text == this.cpuSign && t[1][0].text == this.cpuSign && t[2][0].text == "" ||
      t[0][0].text == this.cpuSign && t[2][0].text == this.cpuSign && t[1][0].text == "" ||
      t[1][0].text == this.cpuSign && t[2][0].text == this.cpuSign && t[0][0].text == ""){

        return this.predictAttack([
          t[0][0],
          t[1][0],
          t[2][0]
        ])
    }

    if(t[0][1].text == this.cpuSign && t[1][1].text == this.cpuSign && t[2][1].text == "" ||
      t[0][1].text == this.cpuSign && t[2][1].text == this.cpuSign && t[1][1].text == "" ||
      t[1][1].text == this.cpuSign && t[2][1].text == this.cpuSign && t[0][1].text == ""){

        return this.predictAttack([
          t[0][1],
          t[1][1],
          t[2][1]
        ])
    }

    if(t[0][2].text == this.cpuSign && t[1][2].text == this.cpuSign && t[2][2].text == ""||
      t[0][2].text == this.cpuSign && t[2][2].text == this.cpuSign && t[1][2].text == "" ||
      t[1][2].text == this.cpuSign && t[2][2].text == this.cpuSign && t[0][2].text == ""){

        return this.predictAttack([
          t[0][2],
          t[1][2],
          t[2][2]
        ])
    }

    if(t[0][0].text == this.cpuSign && t[1][1].text == this.cpuSign && t[2][2].text == "" ||
      t[0][0].text == this.cpuSign && t[2][2].text == this.cpuSign && t[1][1].text == "" ||
      t[1][1].text == this.cpuSign && t[2][2].text == this.cpuSign && t[0][0].text == ""){

        return this.predictAttack([
          t[0][0],
          t[1][1],
          t[2][2]
        ])
    }

    if(t[0][2].text == this.cpuSign && t[1][1].text == this.cpuSign && t[2][0].text == "" ||
      t[1][1].text == this.cpuSign && t[2][0].text == this.cpuSign && t[0][2].text == "" ||
      t[0][2].text == this.cpuSign && t[2][0].text == this.cpuSign && t[1][1].text == ""){

        return this.predictAttack([
          t[0][2],
          t[1][1],
          t[2][0]
        ])
    }

    return {
      isWinning : false,
      move : []
    }
  }

  predictAttack (moves) {
    for(let i = 0; i < moves.length ; i++) {
      if(moves[i].text != "O" && moves[i].text != "X"){
        return {
          isWinning : true,
          move : moves[i]
        };
      }
    }

    return {
      isWinning : false,
      move : []
    }
  }

  // quit
  quit () {
    $('#myModal').modal('toggle')
    this.router.navigateByUrl('/home');
  }

}
