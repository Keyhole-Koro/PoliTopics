const AGREE = "agree";
const DISAGREE = "disagree";
const NEUTRAL = "neutral";

const articles = [
  { 
    title: 'Local Sports Team Wins Championship', 
    id: 1, 
    date: '2023-10-03', 
    summary: 'The local sports team clinched the championship title in a thrilling final match.', 
    description: 'The local sports team clinched the championship title in a thrilling final match.', 
    category: 'Sports', 
    keywords: ['sports', 'championship', 'local team'],
    participants: [
      { name: 'Coach', summary: 'We played our best game.' },
      { name: 'Player', summary: 'It was a tough match, but we gave it our all.' },
      { name: 'Fan', summary: 'The atmosphere was electric!' }
    ],
    terms: [
      { term: 'championship', definition: 'A competition to find the best team or player in a particular sport.' }
    ],
    dialogs: [
      {
        id: 0,
        speaker: 'Coach',
        summary: 'We played our best game.',
        response_to: [{
          dialog_id: -1,
          reaction: AGREE
        }]
      },
      {
        id: 1,
        speaker: 'Player',
        summary: 'It was a tough match, but we gave it our all.',
        response_to: [{
          dialog_id: 0,
          reaction: AGREE
        }]
      },
      {
        id: 2,
        speaker: 'Fan',
        summary: 'The atmosphere was electric!',
        response_to: [{
          dialog_id: 1,
          reaction: AGREE
        }]
      }
    ]
  },
  { 
    title: 'Government Proposes New Policy', 
    id: 2, 
    date: '2023-10-04', 
    summary: 'The government has proposed a new policy aimed at boosting economic growth and job creation.', 
    description: 'The government has proposed a new policy aimed at boosting economic growth and job creation.', 
    category: 'Politics', 
    keywords: ['government', 'policy', 'economy'],
    participants: [
      { name: 'Minister', summary: 'This policy will create jobs.' },
      { name: 'Economist', summary: 'The policy has potential, but we need to see the details.' },
      { name: 'Opposition Leader', summary: 'We have concerns about the implementation.' },
      { name: 'Journalist', summary: 'Can you provide more specifics on the job creation aspect?' }
    ],
    terms: [
      { term: 'policy', definition: 'A course or principle of action adopted or proposed by an organization or individual.' },
      { term: 'economy', definition: 'The wealth and resources of a country or region, especially in terms of the production and consumption of goods and services.' }
    ],
    dialogs: [
      {
        id: 0,
        speaker: 'Minister',
        summary: 'This policy will create jobs.',
        response_to: [{
          dialog_id: -1,
          reaction: AGREE
        }]
      },
      {
        id: 1,
        speaker: 'Economist',
        summary: 'The policy has potential, but we need to see the details.',
        response_to: [{
          dialog_id: 0,
          reaction: NEUTRAL
        }]
      },
      {
        id: 2,
        speaker: 'Opposition Leader',
        summary: 'We have concerns about the implementation.',
        response_to: [{
          dialog_id: 1,
          reaction: DISAGREE
        }]
      },
      {
        id: 3,
        speaker: 'Journalist',
        summary: 'Can you provide more specifics on the job creation aspect?',
        response_to: [{
          dialog_id: 0,
          reaction: 'QUESTION'
        }]
      },
      {
        id: 4,
        speaker: 'Minister',
        summary: 'We plan to create 100,000 new jobs in the next year.',
        response_to: [{
          dialog_id: 3,
          reaction: 'ANSWER'
        }]
      },
      {
        id: 5,
        speaker: 'Economist',
        summary: 'What sectors will these jobs be in?',
        response_to: [{
          dialog_id: 4,
          reaction: 'QUESTION'
        }]
      },
      {
        id: 6,
        speaker: 'Minister',
        summary: 'Primarily in technology and green energy sectors.',
        response_to: [{
          dialog_id: 5,
          reaction: 'ANSWER'
        }]
      },
      {
        id: 7,
        speaker: 'Opposition Leader',
        summary: 'How will you ensure these jobs are sustainable?',
        response_to: [{
          dialog_id: 6,
          reaction: 'QUESTION'
        }]
      },
      {
        id: 8,
        speaker: 'Minister',
        summary: 'We have a long-term plan to support these sectors.',
        response_to: [{
          dialog_id: 7,
          reaction: 'ANSWER'
        }]
      },
      {
        id: 9,
        speaker: 'Economist',
        summary: 'What measures are in place to track the progress?',
        response_to: [{
          dialog_id: 8,
          reaction: 'QUESTION'
        }]
      },
      {
        id: 10,
        speaker: 'Minister',
        summary: 'We will have quarterly reports and independent audits.',
        response_to: [{
          dialog_id: 9,
          reaction: 'ANSWER'
        }]
      },
      {
        id: 11,
        speaker: 'Opposition Leader',
        summary: 'We will be closely monitoring the implementation.',
        response_to: [{
          dialog_id: 10,
          reaction: NEUTRAL
        }]
      }
    ]
  },
  { 
    title: 'Finance Headline 1', 
    id: 3, 
    date: '2023-10-05', 
    summary: 'Description for headline 1.', 
    description: 'Description for headline 1.', 
    category: 'Finance', 
    keywords: ['finance', 'headline 1'],
    participants: [
      { name: 'Analyst', summary: 'The market is volatile.' },
      { name: 'Investor', summary: 'I am cautious about investing right now.' },
      { name: 'Financial Advisor', summary: 'Diversification is key in these times.' }
    ],
    terms: [
      { term: 'finance', definition: 'The management of large amounts of money, especially by governments or large companies.' }
    ],
    dialogs: [
      {
        id: 0,
        speaker: 'Analyst',
        summary: 'The market is volatile.',
        response_to: [{
          dialog_id: -1,
          reaction: NEUTRAL
        }]
      },
      {
        id: 1,
        speaker: 'Investor',
        summary: 'I am cautious about investing right now.',
        response_to: [{
          dialog_id: 0,
          reaction: AGREE
        }]
      },
      {
        id: 2,
        speaker: 'Financial Advisor',
        summary: 'Diversification is key in these times.',
        response_to: [{
          dialog_id: 1,
          reaction: AGREE
        }]
      }
    ]
  },
  { 
    title: 'Miscellaneous Headline 2', 
    id: 4, 
    date: '2023-10-06', 
    summary: 'Description for headline 2.', 
    description: 'Description for headline 2.', 
    category: 'Miscellaneous', 
    keywords: ['miscellaneous', 'headline 1'],
    participants: [
      { name: 'Reporter', summary: 'This is an interesting event.' },
      { name: 'Attendee', summary: 'I enjoyed the event thoroughly.' },
      { name: 'Organizer', summary: 'We are glad to see such a positive response.' }
    ],
    terms: [
      { term: 'miscellaneous', definition: 'Various types or from different sources.' }
    ],
    dialogs: [
      {
        id: 0,
        speaker: 'Reporter',
        summary: 'This is an interesting event.',
        response_to: [{
          dialog_id: -1,
          reaction: AGREE
        }]
      },
      {
        id: 1,
        speaker: 'Attendee',
        summary: 'I enjoyed the event thoroughly.',
        response_to: [{
          dialog_id: 0,
          reaction: AGREE
        }]
      },
      {
        id: 2,
        speaker: 'Organizer',
        summary: 'We are glad to see such a positive response.',
        response_to: [{
          dialog_id: 1,
          reaction: AGREE
        }]
      }
    ]
  },
  { 
    title: 'Miscellaneous Headline 3', 
    id: 5, 
    date: '2023-10-07', 
    summary: 'Description for headline 3.', 
    description: 'Description for headline 3.', 
    category: 'Miscellaneous', 
    keywords: ['miscellaneous', 'headline 3'],
    participants: [
      { name: 'Witness', summary: 'I saw it happen.' },
      { name: 'Reporter', summary: 'Can you describe what you saw?' }
    ],
    terms: [
      { term: 'miscellaneous', definition: 'Various types or from different sources.' }
    ],
    dialogs: [
      {
        id: 0,
        speaker: 'Witness',
        summary: 'I saw it happen.',
        response_to: [{
          dialog_id: -1,
          reaction: NEUTRAL
        }]
      },
      {
        id: 1,
        speaker: 'Reporter',
        summary: 'Can you describe what you saw?',
        response_to: [{
          dialog_id: 0,
          reaction: NEUTRAL
        }]
      },
      {
        id: 2,
        speaker: 'Witness',
        summary: 'It was a chaotic scene.',
        response_to: [{
          dialog_id: 1,
          reaction: NEUTRAL
        }]
      }
    ]
  },
  { 
    title: 'Technology Breakthrough', 
    id: 6, 
    date: '2023-10-08', 
    summary: 'A new technology breakthrough has been announced.', 
    description: 'A new technology breakthrough has been announced.', 
    category: 'Technology', 
    keywords: ['technology', 'breakthrough'],
    participants: [
      { name: 'Scientist', summary: 'This will change the world.' },
      { name: 'Engineer', summary: 'The applications are endless.' },
      { name: 'Investor', summary: 'We are excited to see the potential.' }
    ],
    terms: [
      { term: 'technology', definition: 'The application of scientific knowledge for practical purposes, especially in industry.' },
      { term: 'breakthrough', definition: 'A sudden, dramatic, and important discovery or development.' }
    ],
    dialogs: [
      {
        id: 0,
        speaker: 'Scientist',
        summary: 'This will change the world.',
        response_to: [{
          dialog_id: -1,
          reaction: AGREE
        }]
      },
      {
        id: 1,
        speaker: 'Engineer',
        summary: 'The applications are endless.',
        response_to: [{
          dialog_id: 0,
          reaction: AGREE
        }]
      },
      {
        id: 2,
        speaker: 'Investor',
        summary: 'We are excited to see the potential.',
        response_to: [{
          dialog_id: 1,
          reaction: AGREE
        }]
      }
    ]
  },
  { 
    title: 'Health Update', 
    id: 7, 
    date: '2023-10-09', 
    summary: 'New health guidelines have been released.', 
    description: 'New health guidelines have been released.', 
    category: 'Health', 
    keywords: ['health', 'guidelines'],
    participants: [
      { name: 'Doctor', summary: 'Follow these guidelines for better health.' },
      { name: 'Patient', summary: 'How will these guidelines help?' }
    ],
    terms: [
      { term: 'health', definition: 'The state of being free from illness or injury.' },
      { term: 'guidelines', definition: 'A general rule, principle, or piece of advice.' }
    ],
    dialogs: [
      {
        id: 0,
        speaker: 'Doctor',
        summary: 'Follow these guidelines for better health.',
        response_to: [{
          dialog_id: -1,
          reaction: AGREE
        }]
      },
      {
        id: 1,
        speaker: 'Patient',
        summary: 'How will these guidelines help?',
        response_to: [{
          dialog_id: 0,
          reaction: NEUTRAL
        }]
      },
      {
        id: 2,
        speaker: 'Doctor',
        summary: 'They are based on the latest research.',
        response_to: [{
          dialog_id: 1,
          reaction: AGREE
        }]
      }
    ]
  },
  { 
    title: 'Entertainment News', 
    id: 8, 
    date: '2023-10-10', 
    summary: 'A new movie has broken box office records.', 
    description: 'A new movie has broken box office records.', 
    category: 'Entertainment', 
    keywords: ['entertainment', 'movie', 'box office'],
    participants: [
      { name: 'Director', summary: 'We are thrilled with the success.' },
      { name: 'Actor', summary: 'The audience response has been amazing.' },
      { name: 'Critic', summary: 'The movie is a masterpiece.' }
    ],
    terms: [
      { term: 'box office', definition: 'The place where tickets are sold in a theater or cinema.' }
    ],
    dialogs: [
      {
        id: 0,
        speaker: 'Director',
        summary: 'We are thrilled with the success.',
        response_to: [{
          dialog_id: -1,
          reaction: AGREE
        }]
      },
      {
        id: 1,
        speaker: 'Actor',
        summary: 'The audience response has been amazing.',
        response_to: [{
          dialog_id: 0,
          reaction: AGREE
        }]
      },
      {
        id: 2,
        speaker: 'Critic',
        summary: 'The movie is a masterpiece.',
        response_to: [{
          dialog_id: 1,
          reaction: AGREE
        }]
      }
    ]
  },
  { 
    title: 'Weather Alert', 
    id: 9, 
    date: '2023-10-11', 
    summary: 'A severe weather alert has been issued.', 
    description: 'A severe weather alert has been issued.', 
    category: 'Weather', 
    keywords: ['weather', 'alert'],
    participants: [
      { name: 'Meteorologist', summary: 'Take precautions.' },
      { name: 'Resident', summary: 'What areas will be affected?' }
    ],
    terms: [
      { term: 'alert', definition: 'A warning of danger or a problem.' }
    ],
    dialogs: [
      {
        id: 0,
        speaker: 'Meteorologist',
        summary: 'Take precautions.',
        response_to: [{
          dialog_id: -1,
          reaction: AGREE
        }]
      },
      {
        id: 1,
        speaker: 'Resident',
        summary: 'What areas will be affected?',
        response_to: [{
          dialog_id: 0,
          reaction: NEUTRAL
        }]
      },
      {
        id: 2,
        speaker: 'Meteorologist',
        summary: 'The entire region is at risk.',
        response_to: [{
          dialog_id: 1,
          reaction: AGREE
        }]
      }
    ]
  },
  { 
    title: 'Travel Advisory', 
    id: 10, 
    date: '2023-10-12', 
    summary: 'A new travel advisory has been issued.', 
    description: 'A new travel advisory has been issued.', 
    category: 'Travel', 
    keywords: ['travel', 'advisory'],
    participants: [
      { name: 'Travel Agent', summary: 'Check the advisory before traveling.' },
      { name: 'Traveler', summary: 'What are the main concerns?' }
    ],
    terms: [
      { term: 'advisory', definition: 'An official announcement or warning.' }
    ],
    dialogs: [
      {
        id: 0,
        speaker: 'Travel Agent',
        summary: 'Check the advisory before traveling.',
        response_to: [{
          dialog_id: -1,
          reaction: NEUTRAL
        }]
      },
      {
        id: 1,
        speaker: 'Traveler',
        summary: 'What are the main concerns?',
        response_to: [{
          dialog_id: 0,
          reaction: NEUTRAL
        }]
      },
      {
        id: 2,
        speaker: 'Travel Agent',
        summary: 'There are safety and health concerns.',
        response_to: [{
          dialog_id: 1,
          reaction: NEUTRAL
        }]
      }
    ]
  },
  { 
    title: 'Local Event', 
    id: 11, 
    date: '2023-10-13', 
    summary: 'A local event is happening this weekend.', 
    description: 'A local event is happening this weekend.', 
    category: 'Local', 
    keywords: ['local', 'event'],
    participants: [
      { name: 'Organizer', summary: 'Join us for a fun weekend.' },
      { name: 'Attendee', summary: 'What activities are planned?' }
    ],
    terms: [
      { term: 'event', definition: 'A planned public or social occasion.' }
    ],
    dialogs: [
      {
        id: 0,
        speaker: 'Organizer',
        summary: 'Join us for a fun weekend.',
        response_to: [{
          dialog_id: -1,
          reaction: AGREE
        }]
      },
      {
        id: 1,
        speaker: 'Attendee',
        summary: 'What activities are planned?',
        response_to: [{
          dialog_id: 0,
          reaction: NEUTRAL
        }]
      },
      {
        id: 2,
        speaker: 'Organizer',
        summary: 'There will be games, food, and music.',
        response_to: [{
          dialog_id: 1,
          reaction: AGREE
        }]
      }
    ]
  },
];

module.exports = articles;