import React from 'react';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import Supreme from './styles/Supreme';
import SickButton from './styles/SickButton';

const Cart = () => {
  return <CartStyles>
    <header>
      <CloseButton title="close">&times;</CloseButton>
      <Supreme>Your Cart</Supreme>
      <p>You have __ items in your cart!</p>
    </header>
  </CartStyles>
}