import React, { Component } from 'react';
import styles from './Home.module.scss';

class Home extends Component {
    render() {
        return (
            <div className={styles['home']}>
                <div></div>
                <div className={styles['home__main-content']}>
                    <div className="player">
                        <iframe
                            id="player_1"
                            frameBorder="0"
                            allowFullScreen="1"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            title="YouTube video player" width="640" height="360"
                            src="https://www.youtube.com/embed/?wmode=Opaque&amp;enablejsapi=1&amp;origin=https%3A%2F%2Flistenonrepeat.com&amp;widgetid=1"
                        />
                    </div>
                </div>
                <div></div>
            </div>
        );
    }
}

export default Home;