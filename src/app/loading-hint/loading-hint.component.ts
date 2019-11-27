import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cyia-loading-hint',
  templateUrl: './loading-hint.component.html',
  styleUrls: ['./loading-hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingHintComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
