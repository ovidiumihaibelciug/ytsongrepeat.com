import React, { Component } from 'react';
import { Range } from 'rc-slider';
import { FiEye, FiRepeat } from 'react-icons/fi';
import styles from './Home.module.scss';
import { YouTubeGetID } from '../../utils/get-youtube-id';

class Home extends Component {
    state = {
      start: 0,
      end: 100,
      videoId: '',
    };

    componentDidUpdate(prevProps) {
      if (this.props.search !== prevProps.search) {
        console.log(this.props.search);
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
        const videoId = YouTubeGetID(search);
        this.setState({
          videoId
        });
      }
    };


    render() {
      const { videoId } = this.state;
      return (
            <div className={styles['home']}>
                <div></div>
                <div className={styles['home__main-content']}>
                    <div className={styles['player']}>
                        <div className={styles['player__design']} />
                        <iframe
                            loop
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&rel=0&iv_load_policy=3&playlist=${videoId}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className={styles['player__info']}>
                        <div className={styles['player__info__description']}>
                            <div className={styles['player__info__description__item']}>
                                <FiEye className={styles['player__info__description__item__icon']} />
                                <div className={styles['player__info__description__item__text']}>
                                    7,234,002 views
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
                            <Range defaultValue={[0, 100]} />
                            <div className={styles['player__info__slider__description']}>
                                Loop any section of the video using the slider!
                            </div>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
      );
    }
}

export default Home;