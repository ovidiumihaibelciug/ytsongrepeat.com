import React, { Component } from 'react';
import axios from 'axios';
import Slider from 'rc-slider';
import { FiEye, FiRepeat, FiThumbsUp } from 'react-icons/fi';
import {
  parse, toSeconds
} from 'iso8601-duration';
import moment from 'moment';
import YouTube from 'react-youtube';
import styles from './Home.module.scss';
import { getYoutubeId } from '../../utils';
import { YOUTUBE_KEY } from '../../utils/keys';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

class Home extends Component {
    state = {
      start: 0,
      end: 100,
      seconds: 100,
      videoId: '',
      videoInfo: ''
    };

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
          videoId
        });
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
          console.log(data);
          this.setState({
            start: 0,
            end: seconds,
            seconds,
            videoInfo: data,
          });
        })
        .catch((err) => console.log(err));
    };

    render() {
      const {
        videoId, start, end, seconds, videoInfo
      } = this.state;

      const opts = {
        height: '100%',
        width: '100%',
        playerVars: { // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
          loop: 1,
          start,
          end
        }
      };
      const { items } = videoInfo;

      const { statistics, snippet } = videoInfo && items[0];
      return (
          <div className={styles['home']}>
            <div></div>
            <div className={styles['home__main-content']}>
                <YouTube
                    containerClassName={styles['player']}
                    videoId={videoId}
                    opts={opts}
                    onEnd={ (event) => {
                      console.log(event.target);
                      event.target.seekTo(start);
                    }
                    }
                />
                <div className={styles['player__info']}>
                    <div className={styles['player__info__description']}>
                        <div className={styles['player__info__description__item']}>
                            <FiEye className={styles['player__info__description__item__icon']} />
                            <div className={styles['player__info__description__item__text']}>
                                {statistics && statistics.viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} views
                            </div>
                        </div>
                        <div className={styles['player__info__description__item']}>
                            <FiThumbsUp className={styles['player__info__description__item__icon']} />
                            <div className={styles['player__info__description__item__text']}>
                                {statistics && statistics.likeCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} likes
                            </div>
                        </div>
                        <div className={styles['player__info__description__item']}>
                            <FiRepeat className={styles['player__info__description__item__icon']} />
                            <div className={styles['player__info__description__item__text']}>
                                3,456 repeats
                            </div>
                        </div>
                    </div>
                    <div className={styles['player__info__slider']}>
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
                            tipFormatter={(value) => moment.utc(value * 1000).format('HH:mm:ss')} />
                        <div className={styles['player__info__slider__description']}>
                            Loop any section of the video using the slider!
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['home__right-side']}>
                <div className={styles['home__right-side__inner']}>
                    <div className={[styles['box'], styles['home__right-side__video-info']].join(' ')}>
                        <div className={styles['home__right-side__video-info__title']}>
                            {snippet && snippet.title}
                        </div>
                        <div className={styles['home__right-side__video-info__description']}>
                            {snippet && snippet.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
    }
}

export default Home;