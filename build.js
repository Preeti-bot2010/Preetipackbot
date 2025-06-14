import fs from 'fs';
import path from 'path';
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (e.g., index.html, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Optional: fallback for single-page apps
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


// Create a simple build script for static deployment
const clientSrc = './client/src';
const clientDist = './dist';

// Ensure dist directory exists
if (!fs.existsSync(clientDist)) {
  fs.mkdirSync(clientDist, { recursive: true });
}

// Copy essential files
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SweetBox Chatbot</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    // Mock data for static deployment
    window.mockData = {
      products: [
        {
          id: 1,
          name: "Premium Chocolate Box",
          description: "Handcrafted premium chocolates made with finest Belgian cocoa.",
          category: "chocolate",
          basePrice: "599.00",
          imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop",
          sizes: { small: { pieces: 12, price: 399 }, medium: { pieces: 24, price: 599 }, large: { pieces: 36, price: 899 } },
          laminations: { matte: { price: 30 }, glossy: { price: 50 } },
          inStock: true,
          popularity: 95
        },
        {
          id: 2,
          name: "Traditional Mithai Box",
          description: "Authentic Indian sweets including laddu, barfi, and gulab jamun.",
          category: "traditional",
          basePrice: "399.00",
          imageUrl: "https://images.unsplash.com/photo-1606471191009-d5d2593f9bb1?w=300&h=200&fit=crop",
          sizes: { small: { pieces: 8, price: 299 }, medium: { pieces: 16, price: 399 }, large: { pieces: 24, price: 599 } },
          laminations: { matte: { price: 25 }, glossy: { price: 40 } },
          inStock: true,
          popularity: 88
        }
      ],
      business: {
        name: "SweetBox Premium",
        phone: "+91 98765 12345",
        address: "MG Road, Bangalore - 560001",
        email: "orders@sweetboxpremium.com",
        deliveryCharges: "50.00"
      }
    };
  </script>
  <script>
    // Simple chat application
    const { useState, useEffect } = React;
    
    function ChatApp() {
      const [messages, setMessages] = useState([
        { id: 1, type: 'bot', content: 'Welcome to SweetBox! I can help you order delicious sweet boxes. Please share your mobile number to get started.', timestamp: new Date().toISOString() }
      ]);
      const [input, setInput] = useState('');
      
      const sendMessage = () => {
        if (!input.trim()) return;
        
        const userMessage = {
          id: messages.length + 1,
          type: 'user',
          content: input,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        // Simple bot response
        setTimeout(() => {
          const botMessage = {
            id: messages.length + 2,
            type: 'bot',
            content: 'Thank you for your message! Here are our popular sweet boxes. You can customize size, lamination, and quantity for each box.',
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, botMessage]);
        }, 1000);
        
        setInput('');
      };
      
      return React.createElement('div', { className: 'min-h-screen bg-white' },
        React.createElement('header', { className: 'bg-gradient-to-r from-pink-500 to-orange-500 p-4 text-white' },
          React.createElement('h1', { className: 'text-xl font-bold' }, 'SweetBox Premium'),
          React.createElement('p', { className: 'text-sm opacity-90' }, 'Online now')
        ),
        React.createElement('div', { className: 'p-4 space-y-4 mb-20' },
          messages.map(msg => 
            React.createElement('div', { 
              key: msg.id, 
              className: \`flex \${msg.type === 'user' ? 'justify-end' : 'justify-start'}\`
            },
              React.createElement('div', {
                className: \`max-w-xs px-4 py-2 rounded-lg \${msg.type === 'user' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-800'}\`
              }, msg.content)
            )
          )
        ),
        React.createElement('div', { className: 'fixed bottom-0 left-0 right-0 bg-white border-t p-4' },
          React.createElement('div', { className: 'flex space-x-2' },
            React.createElement('input', {
              type: 'text',
              value: input,
              onChange: (e) => setInput(e.target.value),
              onKeyPress: (e) => e.key === 'Enter' && sendMessage(),
              placeholder: 'Type your message...',
              className: 'flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500'
            }),
            React.createElement('button', {
              onClick: sendMessage,
              className: 'bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600'
            }, 'Send')
          )
        )
      );
    }
    
    ReactDOM.render(React.createElement(ChatApp), document.getElementById('root'));
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(clientDist, 'index.html'), indexHtml);

console.log('Static build completed! Upload the dist folder to any static hosting service.');
