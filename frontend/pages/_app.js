import App, { Container } from 'next/app';
import Page from '../components/Page';

class MyApp extends App {

  render() {
    const { Component, apollo, pageProps } = this.props;

    return (
      <Container>
        <Page />
      </Container >
    );
  }
}

export default MyApp;