import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ChannelpageComponent } from './pages/channelpage/channelpage.component';
import { VideoboxComponent } from './shared/videobox/videobox.component';
import { VideoplayerComponent } from './pages/videoplayer/videoplayer.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ChannellistpageComponent } from './pages/channellistpage/channellistpage.component';
import { ChannelboxComponent } from './shared/channelbox/channelbox.component';
import { ProfilephotoComponent } from './shared/profilephoto/profilephoto.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NavbarComponent,
    ChannelpageComponent,
    VideoboxComponent,
    VideoplayerComponent,
    NotfoundComponent,
    ChannellistpageComponent,
    ChannelboxComponent,
    ProfilephotoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
