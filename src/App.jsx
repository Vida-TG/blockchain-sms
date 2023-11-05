import Homepage from './components/Homepage'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

function App() {
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);
        const signer = await web3Provider.getSigner();

        const chainId = '0x61';
        const isNetworkAdded = await window.ethereum.request({
          method: 'eth_chainId',
        });

        if (isNetworkAdded !== chainId) {
          const networkParams = {
            chainId: '0x61',
            chainName: 'Binance Smart Chain Testnet',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18,
            },
            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
            blockExplorerUrls: ['https://testnet.bscscan.com/'],
          };

          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkParams],
          });
        }

        const accounts = await web3Provider.listAccounts();
        setUserAddress(accounts[0].address);

        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install a compatible wallet extension or use MetaMask.');
    }
  };

  const disconnectWallet = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (window.ethereum) {
      if (window.ethereum.selectedAddress) {
        const initiate = async () => {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);
          setUserAddress(window.ethereum.selectedAddress);
          const signer = await web3Provider.getSigner();

          const chainId = '0x61';
          const isNetworkAdded = await window.ethereum.request({
            method: 'eth_chainId',
          });

          if (isNetworkAdded !== chainId) {
            const networkParams = {
              chainId: '0x61',
              chainName: 'Binance Smart Chain Testnet',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
              },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
              blockExplorerUrls: ['https://testnet.bscscan.com/'],
            };

            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [networkParams],
            });

          }

          setIsConnected(true);
        };

        initiate();
      }

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setProvider(null);
          setUserAddress('');
          setIsConnected(false);
        } else {
          setUserAddress(accounts[0]);

          connectWallet();
        }
      });

    }
  }, []);

  useEffect(() => {
    if (provider && userAddress) {
      const fetchBalance = async () => {
        const balance = await provider.getBalance(userAddress);
        setTokenBalance(ethers.formatEther(balance));
      };

      fetchBalance();
    }
  }, [provider, userAddress]);


  return (
    <WalletContext.Provider value={{ connectWallet, disconnectWallet, userAddress, isConnected, tokenBalance }}>
      <Homepage />
    </WalletContext.Provider>
  )
}

export default App

export const useWallet = () => useContext(WalletContext);