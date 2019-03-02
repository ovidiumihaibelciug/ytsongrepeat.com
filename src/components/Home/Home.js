import React, { Component } from 'react';
import styles from './Home.module.scss';
import { Range } from 'rc-slider';
import { FiEye, FiRepeat } from 'react-icons/fi';

class Home extends Component {
    render() {
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
                            src="https://www.youtube.com/embed/y-iwztKUc-E?autoplay=1&loop=1&rel=0&iv_load_policy=3&playlist=y-iwztKUc-E"
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