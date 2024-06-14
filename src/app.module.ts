import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MusicModule } from './music/music.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PlaylistModule } from './playlist/playlist.module';
import { MulterModule } from '@nestjs/platform-express';
import { ArtistsModule } from './artists/artists.module';

@Module({
  imports: [
    MusicModule,
    UsersModule,
    AuthModule,
    MulterModule.register({ dest: './uploads' }),
    MongooseModule.forRoot(
      `mongodb+srv://admin:wwwwww@spotify.tcdxe7a.mongodb.net/spotify?retryWrites=true&w=majority`,
    ),
    PlaylistModule,
    ArtistsModule,
    ArtistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
