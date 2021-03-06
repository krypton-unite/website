import React from 'react'
import Route from '../pages/Route'
import BaseApp from 'next/app'
import client from '../client'
import '../styles/app.scss'
import '../styles/shared.module.scss'
import '../styles/layout.scss'

const siteConfigQuery = `
  *[_id == "global-config"] {
    ...,
    logo {asset->{extension, url}},
    mainNavigation[] -> {
      ...,
      "title": page->title
    },
    footerNavigation[] -> {
      ...,
      "title": page->title
    }
  }[0]
  `

class App extends BaseApp {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    // Add site config from sanity
    return client.fetch(siteConfigQuery).then(config => {
      if (!config) {
        return { pageProps }
      }
      if (config && pageProps) {
        pageProps.config = config
      }

      return { pageProps }
    })
  }

  render() {
    // const { /*Component,*/ pageProps} = this.props
    return (
        <Route {...this.props} />
    )
  }
}

export default App
