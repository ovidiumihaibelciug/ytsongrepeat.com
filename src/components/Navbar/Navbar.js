import React, { Component } from 'react';
import { FiSearch, FiSettings } from 'react-icons/fi';
import styles from './Navbar.module.scss';

class Navbar extends Component {
  render() {
    return (
        <div className={styles['navbar']}>
            <div className={styles['navbar__inner']}>
                <div className={styles['navbar__search']}>
                    <FiSearch className={styles['navbar__search__icon']} />
                    <input type="text" className={styles['navbar__search__input']} placeholder="Search for a video" />
                </div>
                <div className={styles['navbar__profile']}>
                    <div className={styles['navbar__profile__settings__container']}>
                        <FiSettings className={styles['navbar__profile__settings']} />
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default Navbar;