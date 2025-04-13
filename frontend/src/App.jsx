import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import InsurancePlans from './components/InsurancePlans';
import MedicationVerification from './components/MedicationVerification';
import TransactionHistory from './components/TransactionHistory';
import ContractDetails from './components/ContractDetails';
import { getContractAddress, setContractAddress, VERIFIED_ADDRESS } from './utils/web3';

function App() {
  const [account, setAccount] = useState('');
  const [activeTab, setActiveTab] = useState('insurance');
  const [contractAddress, setContractAddressState] = useState('');
  
  useEffect(() => {
    // Check if contract address is already stored
    const storedAddress = getContractAddress();
    if (storedAddress) {
      setContractAddressState(storedAddress);
    }
    
    // Listen for MetaMask account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('');
        }
      });
    }
  }, []);
  
  // Set contract address
  const handleSetContractAddress = (e) => {
    e.preventDefault();
    if (contractAddress) {
      setContractAddress(contractAddress);
      alert('Contract address set successfully!');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar account={account} setAccount={setAccount} />
      
      <div className="container mx-auto px-4 py-8">
        {!getContractAddress() ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Contract Address Not Set</p>
            <p className="mb-2">Please set the contract address after deployment to interact with the dApp.</p>
            
            <form onSubmit={handleSetContractAddress} className="flex gap-2">
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddressState(e.target.value)}
                placeholder="Enter contract address"
                className="flex-grow px-3 py-2 border border-yellow-400 rounded"
              />
              <button
                type="submit"
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Set Address
              </button>
            </form>
            <p className="text-sm mt-2">
              <strong>Note:</strong> Payments will be sent to the verified address: {VERIFIED_ADDRESS}
            </p>
          </div>
        ) : (
          <ContractDetails />
        )}
        
        {!account ? (
          <div className="text-center py-12">
            <div className="text-2xl font-bold mb-2">Welcome to Health Insurance DApp</div>
            <p className="text-gray-600 mb-8">Please connect your wallet to interact with the application.</p>
          </div>
        ) : (
          <>
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab('insurance')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'insurance'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Insurance Plans
              </button>
              <button
                onClick={() => setActiveTab('medication')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'medication'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Medication Verification
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'history'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Transaction History
              </button>
            </div>
            
            <div className="pb-12">
              {activeTab === 'insurance' && (
                <InsurancePlans 
                  account={account} 
                  onPurchase={() => setActiveTab('medication')}
                />
              )}
              
              {activeTab === 'medication' && (
                <MedicationVerification account={account} />
              )}
              
              {activeTab === 'history' && (
                <TransactionHistory account={account} />
              )}
            </div>
          </>
        )}
      </div>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>Decentralized Health Insurance Application © 2025</p>
          <p className="text-gray-400 text-sm mt-2">
            Running on Sepolia Testnet | Payments go to: {VERIFIED_ADDRESS}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;