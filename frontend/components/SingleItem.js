import React, { Component } from 'react';
import gql from 'graphql-tag';
import Head from 'next/head';
import { Query } from 'react-apollo';
import ErrorMessage from './ErrorMessage';
import styled from 'styled-components';

const SingleItemStyles = styled.div` 
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height:800px;
  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id:ID!){
      item(where: {id: $id}) {
        id
        title
        description
        price
        largeImage 
      }
    }
  `;

class SingleItem extends Component {

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ error, loading, data }) => {
          if (error) return <ErrorMessage error={error} />
          if (loading) return <p>loading...</p>
          if (!data.item) return <p>No Item Found for {this.props.id}</p>

          const item = data.item;

          return (
            <SingleItemStyles>
              <Head><title>Sick Fits | {item.title}</title></Head>
              <img src={item.largeImage} alt={item.title} />
              <div className="details">
                <h2>Viewing {item.title}</h2>
                <p>{item.description}</p>
              </div>
            </SingleItemStyles>
          )
        }}

      </Query>
    );
  }
}

export default SingleItem;