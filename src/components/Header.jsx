import React from 'react'
import { useWallet } from '../App';

const Header = () => {
    const { connectWallet, disconnectWallet, userAddress, isConnected, tokenBalance } = useWallet();
    return (
        <>
            <div class="header">
                <div class="container">
                    <b> NEWS : </b>
                    <marquee> My college: How To Lorem Ipsum is simply dummy text of the printing and typesetting industry. </marquee>
                </div>
            </div>
            <div class="container">
            {isConnected ? 
            <h3>Address: {userAddress} - Balance: {tokenBalance}Test BNB</h3>
            : <h3>Connect wallet to view balance</h3>}
            
            {isConnected ? 
            <button onClick={disconnectWallet}><h3>DISCONNECT WALLET</h3></button>
            : 
            <button onClick={connectWallet}><h3>CONNECT WALLET</h3></button>}

            <img src="images/logo.png" class="logo"/>
                <nav>
                    <a href="#">Home</a>
                    <a href="#">About us</a>
                    <a href="#">Events</a>
                    <a href="#">Gallery</a>
                    <a href="#">Notice Board</a>
                    <a href="#">Contact us</a>
                </nav>
            </div>
        </>
    )
}

export default Header