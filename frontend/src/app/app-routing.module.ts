import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ChannelpageComponent } from './pages/channelpage/channelpage.component';
import { VideoplayerComponent } from './pages/videoplayer/videoplayer.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ChannellistpageComponent } from './pages/channellistpage/channellistpage.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'channel', component: ChannellistpageComponent},
  {path:'channel/:id', component: ChannelpageComponent},
  {path: 'watch', component: VideoplayerComponent},
  {path: '404', component: NotfoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
