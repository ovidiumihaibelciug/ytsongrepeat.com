import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import styles from './Sidebar.module.scss';
import Logo from '../svg/imgs/Logo';

export const PureSidebar = ({ data, isIndex }) => {
  const {
    author,
    copyright,
    menu
  } = data.site.siteMetadata;

  return (
    <div className={styles['sidebar']}>
      <div className={styles['sidebar__inner']}>
        <div className={styles['sidebar__logo__container']}>
          <Logo className={styles['sidebar__logo']}/>
        </div>
      </div>
    </div>
  );
};

export const Sidebar = (props) => (
  <StaticQuery
    query={graphql`
      query SidebarQuery {
        site {
          siteMetadata {
            title
            subtitle
            copyright
            menu {
              label
              path
            }
            author {
              name
              photo
              bio
              contacts {       
                twitter
                telegram
                github
                email
                rss
                vkontakte
              }
            }
          }
        }
      }
    `}
    render={(data) => <PureSidebar {...props} data={data}/>}
  />
);

export default Sidebar;
