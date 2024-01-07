# Harvard CS50 Web Project 5 (6 out of 6)
## Youtube Like Streaming Service 

## Summary
This project is a youtube like streaming platform designed with Angular in the frontend and
Django in the backend whereas Django manages the metadata using it's built-in Model classes ORM (Object Relational Mapper) and
sqlite in the local server (but it could've been any other local or SaaS database) and Angular to build the frontend using google tools
like the real youtube does.

## Distinctiveness and Complexity
Since this project is not meant to be similar to an e-commerce or a social media i decided to build a streamming service in the simplest
way possible. I think the distinctiveness of this project speaks for itself, although i didn't had to build from scratch a video player nor
build tools for video editing or some form of manipulaiton, i decided to handle the creation of the metadata for a video and link it to a specific
channel and actually store the video in the server and stream the video, so the complexity was this, link the channel and video metadata to
the actual video streaming route so that the video chunk is sent to the browser to be played.

## How to build and/or run the application
If the project you downloaded doesn't contain the dist folder that is the built frontend you should build it by goinf into the frontend folder ```cd frontend``` and then build it by running one of these commands ```ng build``` or ```ng b``` after the build is done go back to the root of the project ```cd ..``` and run ```python manage.py runserver```, you can use "py" or "python3" depending on your python version or set aliases for the python version.

## Components of the application
### Frontend
In the frontend there are a few angular components (they are separeted in two folders "types" pages or shared):
#### Pages
* homepage
* channellistpage (a list of channels)
* channelpage (the channel specific page)
* videoplayer

#### Shared
* videobox
* channelbox
* navbar
* profilephoto

###### videobox
It is a representaion of the video thumbnail and other info like views and title:
```code here```

### Backend
