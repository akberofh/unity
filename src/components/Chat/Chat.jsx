import React, { useEffect } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import 'tailwindcss/tailwind.css';

const lightTheme = {
  background: '#f5f8fb',
  fontFamily: 'Arial, Helvetica, sans-serif',
  headerBgColor: '#5C6BC0',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#5C6BC0',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

const darkTheme = {
  background: '#1a202c',
  fontFamily: 'Arial, Helvetica, sans-serif',
  headerBgColor: '#2d3748',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#2d3748',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

function Chat({ theme }) {
  useEffect(() => {
    const element = document.documentElement;
    if (theme === 'dark') {
      element.classList.add('dark');
    } else {
      element.classList.remove('dark');
    }
  }, [theme]);

  const selectedTheme = theme === 'dark' ? darkTheme : lightTheme;

  const WhatsAppLink = () => (
    <a href="https://wa.me/+994515983550" target="_blank" rel="noopener noreferrer">
      WhatsApp üzerinden iletişime geçin
    </a>
  );
  
  const InstagramLink = () => (
    <a href="https://www.instagram.com/akberofh/profilecard/?igsh=MTN2cGdtMDl0Mnd1dA==" target="_blank" rel="noopener noreferrer">
      Instagram profilim
    </a>
  );
  
  const TikTokLink = () => (
    <a href="https://www.tiktok.com/@akberofh?_t=8rB8x17BjEu&_r=1" target="_blank" rel="noopener noreferrer">
      TikTok profilim
    </a>
  );

  return (
    <ThemeProvider theme={selectedTheme}>
      <div className="bg-gray-100 dark:bg-black dark:text-black flex items-center justify-center">
        <ChatBot
          steps={[
            {
              id: '1',
              message: 'Adınız nədir?',
              trigger: '2',
            },
            {
              id: '2',
              user: true,
              trigger: '3',
            },
            {
              id: '3',
              message: 'Salam {previousValue}, Tanışdığımıza sevindim!',
              trigger: '4',
            },
            {
              id: '4',
              message: 'Sosial media hesablarımdan biriylə əlaqəyə keçmək istəyirsiz?',
              trigger: '5',
            },
            {
              id: '5',
              options: [
                { value: 'whatsapp', label: 'WhatsApp', trigger: 'whatsapp-link' },
                { value: 'instagram', label: 'Instagram', trigger: 'instagram-link' },
                { value: 'tiktok', label: 'TikTok', trigger: 'tiktok-link' },
              ],
            },
            {
              id: 'whatsapp-link',
              component: <WhatsAppLink />,
              trigger: 'back-to-options',
            },
            {
              id: 'instagram-link',
              component: <InstagramLink />,
              trigger: 'back-to-options',
            },
            {
              id: 'tiktok-link',
              component: <TikTokLink />,
              trigger: 'back-to-options',
            },
            {
              id: 'back-to-options',
              message: 'Başqa bir platform seçmək istəyirsiz??',
              trigger: 'back-options',
            },
            {
              id: 'back-options',
              options: [
                { value: 'yes', label: 'Bəli', trigger: '5' },
                { value: 'no', label: 'Xeyir', trigger: 'end-message' },
              ],
            },
            {
              id: 'end-message',
              message: 'Kömək edə bildiysəm nə xoş!',
              end: true,
            },
          ]}
          floating={true}
        />
      </div>
    </ThemeProvider>
  );
}

export default Chat;
