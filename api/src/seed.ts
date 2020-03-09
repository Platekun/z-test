import cuid from 'cuid';

const topic =
  'Vestibulum diam ante, portitor a odio eget, rhoncus neque. Aenen eu velit libero';

const createdAt = '02/06/2020';
const endDate = '04/06/2020';

export const popeFrancisTrial = {
  id: cuid(),
  person: {
    id: cuid(),
    name: 'Pope Francis',
    photo: 'https://i.imgur.com/mxv3jSf.png',
  },
  upvotes: 50,
  downvotes: 50,
  topic:
    "He's talking enough on clergy sexual abuse, but is he just another papal perver protector? (thumbs down) or a true pedophile punishing pontiff (thumbs up)",
  topicURL: 'https://en.wikipedia.org/wiki/Catholic_Church_sexual_abuse_cases',
  createdAt: '03/06/2020',
  endDate: '04/06/2020',
  category: 'Religion',
};

export const kanyeWestTrial = {
  id: cuid(),
  person: {
    id: cuid(),
    name: 'Kanye West',
    photo: 'https://i.imgur.com/rQVlG4s.png',
  },
  topic,
  upvotes: 64,
  downvotes: 36,
  topicURL: 'https://en.wikipedia.org/wiki/Kanye_West',
  createdAt,
  endDate,
  category: 'Entertainment',
};

export const markZuckerbergTrial = {
  id: cuid(),
  person: {
    id: cuid(),
    name: 'Mark Zuckerberg',
    photo: 'https://i.imgur.com/gnMM4S0.png',
  },
  topic,
  upvotes: 36,
  downvotes: 64,
  topicURL: 'https://www.facebook.com/zuck',
  createdAt,
  endDate,
  category: 'Business',
};

export const cristinaFernandezTrial = {
  id: cuid(),
  person: {
    id: cuid(),
    name: 'Cristina Fernandez de Kirchner',
    photo: 'https://i.imgur.com/vzdiSds.png',
  },
  topic,
  upvotes: 36,
  downvotes: 64,
  topicURL: 'https://en.wikipedia.org/wiki/Cristina_Fern%C3%A1ndez_de_Kirchner',
  createdAt,
  endDate,
  category: 'Policits',
};

export const malalaYousafzaiTrial = {
  id: cuid(),
  person: {
    id: cuid(),
    name: 'Malala Yousafzai',
    photo: 'https://i.imgur.com/2nNrZOY.png',
  },
  topic,
  upvotes: 64,
  downvotes: 36,
  topicURL: 'https://en.wikipedia.org/wiki/Malala_Yousafzai',
  createdAt,
  endDate,
  category: 'Entertainment',
};
