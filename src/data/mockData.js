export const currentUser = {
  id: 'u1',
  username: 'johndoe',
  fullName: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
};

export const stories = [
  { id: 's1', username: 'alex_photography', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', isViewed: false },
  { id: 's2', username: 'travel_diaries', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', isViewed: false },
  { id: 's3', username: 'foodie_gram', avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', isViewed: true },
  { id: 's4', username: 'tech_guru', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', isViewed: false },
  { id: 's5', username: 'fitness_junkie', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', isViewed: true },
  { id: 's6', username: 'art_daily', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', isViewed: false },
  { id: 's7', username: 'music_lover', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', isViewed: false },
];

export const posts = [
  {
    id: 'p1',
    user: {
      username: 'travel_diaries',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    location: 'Swiss Alps',
    image: 'https://images.unsplash.com/photo-1531366936337-77b12fca10a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    likes: 1245,
    caption: 'Lost in the beauty of the Swiss Alps 🏔️✨ #travel #nature #mountains',
    timestamp: '2 HOURS AGO',
    comments: [
      { id: 'c1', username: 'johndoe', text: 'Absolutely breathtaking!' },
      { id: 'c2', username: 'alex_photography', text: 'The lighting is perfect.' }
    ],
    isLiked: false,
    isSaved: false
  },
  {
    id: 'p2',
    user: {
      username: 'foodie_gram',
      avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    likes: 892,
    caption: 'Authentic ramen experience in Tokyo! 🍜🥢 #foodie #tokyo #ramen',
    timestamp: '5 HOURS AGO',
    comments: [
      { id: 'c3', username: 'fitness_junkie', text: 'Looks delicious, but my diet says no 😅' }
    ],
    isLiked: true,
    isSaved: true
  },
  {
    id: 'p3',
    user: {
      username: 'art_daily',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    location: 'Louvre Museum',
    image: 'https://images.unsplash.com/photo-1563821013401-d00cecc19777?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    likes: 3421,
    caption: 'Masterpieces that stand the test of time. 🎨🖼️ #art #louvre #paris',
    timestamp: '1 DAY AGO',
    comments: [],
    isLiked: false,
    isSaved: false
  }
];

export const suggestions = [
  { id: 'sg1', username: 'nature_wonders', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', relation: 'Followed by alex_photography' },
  { id: 'sg2', username: 'cars_lifestyle', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', relation: 'New to Instagram' },
  { id: 'sg3', username: 'daily_quotes', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', relation: 'Followed by foodie_gram + 2 more' },
  { id: 'sg4', username: 'interiordesign', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', relation: 'Suggested for you' },
];
