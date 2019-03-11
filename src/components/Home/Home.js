import React, { Component } from 'react';
import axios from 'axios';
import Slider from 'rc-slider';
import {
  FiEye, FiHeart, FiPause, FiPlay, FiVolume2, FiSkipForward, FiSkipBack, FiThumbsUp
} from 'react-icons/fi';
import {
  parse, toSeconds
} from 'iso8601-duration';
import moment from 'moment';
import YouTube from 'react-youtube';
import _ from 'lodash';
import styles from './Home.module.scss';
import { getYoutubeId } from '../../utils';
import { YOUTUBE_KEY } from '../../utils/keys';
import Portal from '../Portal';
import IconLeft from '../svg/icons/IconLeft';
import IconRight from '../svg/icons/IconRight';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      end: 100,
      seconds: 100,
      videoId: '',
      videoInfo: '',
      hasSecondsData: true,
      recommendations: [],
      minimizePlayer: false,
      showPlay: false,
    };
    this.handleSearch = _.debounce(this.handleSearch, 300);
    this.recommendationsRef = React.createRef();
    this.youtube = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (this.props.search !== prevProps.search) {
      this.handleSearch();
      this.setState({
        search: this.props.search
      });
    }
  }

    handleSearch = () => {
      const { search } = this.props;
      const regex = new RegExp('http(?:s?):\\/\\/(?:www\\.)?youtu(?:be\\.com\\/watch\\?v=|\\.be\\/)([\\w\\-\\_]*)(&(amp;)?‌​[\\w\\?‌​=]*)?', 'g');

      if (regex.test(search)) {
        const videoId = getYoutubeId(search);
        this.getVideoInfo(videoId);
        this.setState({
          videoId,
          minimizePlayer: false,
        });
      } else {
        axios.get(`https://content.googleapis.com/youtube/v3/search?maxResults=5&part=snippet&q=${search}&type=video&key=AIzaSyADm2ekf-_KONB3cSGm1fnuPSXx3br4fvI`)
          .then(({ data }) => {
            this.setState((state) => {
              const { videoId, videoInfo } = state;
              this.scrollToMyRef();
              return {
                recommendations: data.items,
                videoId: videoId || data.items[0].id.videoId,
                hasSecondsData: false,
                videoInfo: videoInfo || data,
                minimizePlayer: true

              };
            });
          })
          .catch((err) => console.log(err));
      }
    };

    getVideoInfo = (videoId) => {
      axios.get(`https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet,statistics,contentDetails&id=${videoId}&key=${YOUTUBE_KEY}`)
        .then(({ data }) => {
          let seconds = 100;
          if (data) {
            const { items } = data;
            const { contentDetails } = items[0];
            const { duration } = contentDetails;
            seconds = toSeconds(parse(duration));
          }
          axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&key=${YOUTUBE_KEY}`)
            .then(({ data }) => {
              this.setState({
                recommendations: data.items
              });
            })
            .catch((err) => console.log(err));
          this.setState({
            start: 0,
            end: seconds,
            seconds,
            videoInfo: data,
            hasSecondsData: true
          });
        })
        .catch((err) => console.log(err));
    };

    changeVideo = (item) => {
      this.setState({
        videoId: item.id.videoId
      });
      this.getVideoInfo(item.id.videoId);
    };

    scrollToMyRef = () => this.recommendationsRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    });

    pause = (type) => {
      const player = this.youtube.current.internalPlayer;
      console.log(type);

      this.setState((state) => {
        console.log('adasdasd', state);
        const { showPlay } = state;
        return {
          showPlay: !showPlay
        };
      });

      if (type === 'play') {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    };

    render() {
      const {
        videoId, start, end, seconds, videoInfo, hasSecondsData, recommendations, showPlay
      } = this.state;

      const opts = {
        height: '100%',
        width: '100%',
        playerVars: { // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
          loop: 1,
          start,
          end: hasSecondsData ? end : undefined
        }
      };

      const { items = [] } = videoInfo;

      const { snippet } = items.length && items[0];
      const { statistics } = hasSecondsData && videoInfo && items[0];

      return (
            <div className={styles['home']}>
                <div></div>
                <div className={styles['home__main-content']}>
                    <YouTube
                        ref={this.youtube}
                        containerClassName={styles['player']}
                        videoId={videoId}
                        opts={opts}
                        onEnd={(event) => {
                          console.log(event.target);
                          event.target.seekTo(start);
                        }}
                    />
                    {hasSecondsData
                    && <div className={styles['player__info']}>
                        <div className={styles['player__info__description']}>
                            <div className={styles['player__info__description__item']}>
                                <FiEye className={styles['player__info__description__item__icon']}/>
                                <div className={styles['player__info__description__item__text']}>
                                    {statistics && statistics.viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} views
                                </div>
                            </div>
                            <div className={styles['player__info__description__item']}>
                                <FiThumbsUp className={styles['player__info__description__item__icon']}/>
                                <div className={styles['player__info__description__item__text']}>
                                    {statistics && statistics.likeCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} likes
                                </div>
                            </div>
                        </div>
                        <div className={styles['player__info__slider']}>
                            {
                                hasSecondsData
                                && <>
                                    <Range
                                        min={0}
                                        max={seconds}
                                        defaultValue={[start, end]}
                                        value={[start, end]}
                                        onChange={([start, end]) => {
                                          this.setState({
                                            start,
                                            end
                                          });
                                        }}
                                        tipFormatter={(value) => moment.utc(value * 1000).format('HH:mm:ss')}
                                    />

                                    < div className={styles['player__info__slider__description']}>
                                        Loop any section of the video using the slider!
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    }
                    <div className={styles['home__main-content__recommendations']} ref={this.recommendationsRef}>
                        {
                            recommendations.length > 0 && recommendations.map((item) => (
                                <div className={[styles['box'], styles['recommendation']].join(' ')}
                                     onClick={() => this.changeVideo(item)}>
                                    <img className={styles['recommendation__img']}
                                         src={item.snippet.thumbnails.default.url} alt=""/>
                                    <div className={styles['recommendation__info']}>
                                        <div
                                            className={styles['recommendation__info__title']}>{item.snippet.title}</div>
                                        <div className={styles['recommendation__info__description']}>
                                            {item.snippet.description.length > 300 ? `${item.snippet.description.slice(0, 300)}...` : item.snippet.description}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className={styles['home__right-side']}>
                    <div className={styles['home__right-side__inner']}>
                        <div className={[styles['box'], styles['home__right-side__video-info']].join(' ')}>
                            <div className={styles['home__right-side__video-info__title']}>
                                {snippet && snippet.title}
                            </div>
                            <div className={styles['home__right-side__video-info__description']}>
                                {snippet && (snippet.description.length > 800 ? `${snippet.description.slice(0, 800)}...` : snippet.description)}
                            </div>
                            {snippet && snippet.tags && snippet.tags.length
                            && <div className={styles['home__right-side__video-info__tags']}>
                                {
                                    snippet.tags.slice(0, 5).map((tag) => (
                                        <div className={styles['tag']}>
                                            {tag}
                                        </div>))
                                }
                            </div>}
                        </div>
                    </div>
                </div>
                {videoInfo
                && <Portal>
                    <div className={styles['minimized-player']}>
                        <div className={styles['minimized-player__inner']}>
                            <IconLeft className={styles['minimized-player--design-left']}/>
                            <IconRight className={styles['minimized-player--design-right']}/>
                            <div className={styles['minimized-player__content']}>
                                <div className={styles['minimized-player__content__song']}>
                                    <img src={videoInfo.items[0].snippet.thumbnails.default.url}
                                         className={styles['minimized-player__content__song__img']}/>
                                    <div className={styles['minimized-player__content__song__details']}>
                                        <div
                                            className={styles['minimized-player__content__song__details__title']}>{videoInfo.items[0].snippet.title.length > 30 ? `${videoInfo.items[0].snippet.title.slice(0, 30)}...` : videoInfo.items[0].snippet.title}</div>
                                        <div
                                            className={styles['minimized-player__content__song__details__description']}>{videoInfo.items[0].snippet.channelTitle}</div>
                                    </div>
                                </div>
                                <div className={styles['minimized-player__content__controls']}>
                                    <FiSkipBack />
                                    {
                                        showPlay ? <FiPlay onClick={() => this.pause('play')} /> : <FiPause onClick={() => this.pause('pause')} />
                                    }
                                    <FiSkipForward />
                                </div>
                                <div className={styles['minimized-player__content__bar']}>
                                    <div className={styles['minimized-player__content__bar--progress']} style={{ width: '60%' }}>
                                        <div className={styles['minimized-player__content__bar__pointer']}></div>
                                    </div>
                                </div>
                                <div className={styles['minimized-player__content__sound']}>
                                    <FiVolume2 />
                                </div>
                            </div>
                        </div>
                    </div>
                </Portal>
                }
            </div>
      );
    }
}

export default Home;