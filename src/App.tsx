import React from 'react';
import logo from './logo.svg';
import './App.css';
import MyLayout from './pages/MainPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


function App() {
      const queryClient = new QueryClient();

  return (   
  <QueryClientProvider client={queryClient}>
    <div className='container'>
      <MyLayout/>
    </div>
  </QueryClientProvider>
  );
}

export default App;
