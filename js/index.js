let CurrentPage = 0;
let VideosData = [];
let NextPageToken = '';
let PagingSize = 10;

function init() {
  let form = document.getElementById('videoNameForm');

  let prevButton = document.getElementById('prevButton');
  let nextButton = document.getElementById('nextButton');

  form.addEventListener('submit', event => {
    event.preventDefault();

    getData().then(() => {
      CurrentPage = 0;
      displayNext();
    });
  });

  prevButton.addEventListener('click', event => {
    event.preventDefault();

    if (CurrentPage <= 0) {
      // disable
    } else {
      CurrentPage--;
      displayNext();
    }
  });

  nextButton.addEventListener('click', event => {
    event.preventDefault();

    if (CurrentPage + PagingSize >= VideosData.length) {
      // disable
      getData().then(() => {
        CurrentPage++;
        displayNext();
      });
    } else {
      CurrentPage++;
      displayNext();
    }
  });
}

const videoPost = ({ title, url, videoId }) => `
  <div>
    <h3>${title}</h3>
    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">ir a video</a>
    <img src="${url}" alt="${title}" />
  </div>
`;

async function getData() {
  let key = 'AIzaSyD1aaESjRiQly6Tys-0XSFaW6IUx058OQ4';

  let input = document.getElementById('videoNameInput');
  let videoName = input.value;

  let token = NextPageToken ? 'pageToken=' + NextPageToken + '&' : '';

  let url =
    'https://www.googleapis.com/youtube/v3/search?' +
    'part=snippet&maxResults=' +
    PagingSize +
    '&q=' +
    videoName +
    '&' +
    //'pageToken=' + pageToken[CurrentPage] + '&' +
    token +
    'key=' +
    key;

  let data = await fetch(url);
  let dataJSON = await data.json();

  NextPageToken = dataJSON.nextPageToken;

  dataJSON.items &&
    dataJSON.items.map(item => {
      VideosData.push({
        title: item.snippet.title,
        url: item.snippet.thumbnails.high.url,
        videoId: item.id.videoId,
      });
    });
}

function displayNext() {
  let resultsContainer = document.getElementsByClassName('results')[0];
  resultsContainer.innerHTML = '';
  console.log(CurrentPage, VideosData.length, VideosData);

  for (let i = CurrentPage; i < CurrentPage + PagingSize && i < VideosData.length; i++) {
    resultsContainer.innerHTML += videoPost({
      title: VideosData[i].title,
      url: VideosData[i].url,
      videoId: VideosData[i].videoId,
    });
  }
}

function displayPrev() {
  let resultsContainer = document.getElementsByClassName('results')[0];
  resultsContainer.innerHTML = '';

  for (let i; i >= CurrentPage - PagingSize && i > 0; i--) {
    resultsContainer.innerHTML += videoPost({
      title: VideosData[i].title,
      url: VideosData[i].url,
      videoId: VideosData[i].videoId,
    });
  }
}

init();
