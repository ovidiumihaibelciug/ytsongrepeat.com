import React, { Component } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Home from '../components/Home';

class IndexTemplate extends Component {

  state = {
    search: '',
  };

  onChange = e => {
    this.setState({
      search: e.target.value
    });
  };

  render() {
    const { data, pageContext } = this.props;
    const {search} = this.state;

    const {
      title: siteTitle,
      subtitle: siteSubtitle
    } = data.site.siteMetadata;

    const {
      currentPage,
      hasNextPage,
      hasPrevPage,
      prevPagePath,
      nextPagePath
    } = pageContext;

    const {edges} = data.allMarkdownRemark;
    const pageTitle = currentPage > 0 ? `Posts - Page ${currentPage} - ${siteTitle}` : siteTitle;

    return (
        <Layout title={pageTitle} description={siteSubtitle}>
          <Navbar search={search} onChange={this.onChange} />
          <Sidebar isIndex/>
          <Home search={search} />
        </Layout>
    );
  }
}

export const query = graphql`
  query IndexTemplate($postsLimit: Int!, $postsOffset: Int!) {
    site {
      siteMetadata {
        title
        subtitle
      }
    }
    allMarkdownRemark(
        limit: $postsLimit,
        skip: $postsOffset,
        filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } },
        sort: { order: DESC, fields: [frontmatter___date] }
      ){
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          frontmatter {
            title
            date
            category
            description
          }
        }
      }
    }
  }
`;

export default IndexTemplate;
