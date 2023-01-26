import { Component, OnInit } from '@angular/core';
import { LessonsService } from "../services/lessons.service";
import { Observable, of } from 'rxjs';
import { Lesson } from "../model/lesson";
import { SwPush } from "@angular/service-worker";
import { catchError } from 'rxjs/operators';
import { NewsletterService } from '../services/newsletter.service';

@Component({
  selector: 'lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {
  lessons$: Observable<Lesson[]>;
  isLoggedIn$: Observable<boolean>;

  pushSubscription: PushSubscription;

  readonly VAPID_PUBLIC_KEY = "BG2VOHBmAkAa6GtOUbIo50t5yefhqn01E6A5YJG4HrL5ET_Sp1InJtEwRXB31tkqFxkT7y0Fn2CMIjhfV29d76I";

  constructor(private lessonsService: LessonsService, private newsletterService: NewsletterService, private swPush: SwPush) {

  }

  ngOnInit() {
    this.loadLessons();
  }

  subsribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => {
        this.pushSubscription = sub;
        console.log("Notification Subscription: ", sub);
        this.newsletterService.addPushSubscriber(sub).subscribe(
          () => console.log("Sent push subscription object to server."),
          err => console.error("Could not send subscription object to server.", err)
        );
      })
      .catch(err => console.error("Could not subscribe to notifications", err));
  }

  sendNewsletter() {
    console.log("Sending Newsletter to all Subscribers ...");
    this.newsletterService.send().subscribe();
  }

  loadLessons() {
    this.lessons$ = this.lessonsService.loadAllLessons().pipe(catchError(err => of([])));
  }

}
