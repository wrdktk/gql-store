import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import Supreme from './styles/Supreme';
import SickButton from './styles/SickButton';

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client 
  }
`;
  
const Cart = () => {
  <Query query={LOCAL_STATE_QUERY}>{
    ({ data }) => (
    
    <CartStyles open>
      <header>
        <CloseButton title="close">&times;</CloseButton>
        <Supreme>Your Cart</Supreme>
        <p>You have __ items in your cart!</p>
      </header>
      <footer>
        <p>$10.00</p>
        <SickButton>Checkout</SickButton>
      </footer>
    </CartStyles>
  )}</Query>
}

export default Cart;