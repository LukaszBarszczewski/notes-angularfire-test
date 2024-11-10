import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"da-notes-43717","appId":"1:866309677542:web:dd6e3a68102108f0157627","storageBucket":"da-notes-43717.firebasestorage.app","apiKey":"AIzaSyCqbC2wAe3R5BHGWgwqZHiflzHmRYaTozE","authDomain":"da-notes-43717.firebaseapp.com","messagingSenderId":"866309677542"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
