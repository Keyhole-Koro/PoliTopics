import { Article, Reaction } from '@interfaces/Article';


export const articles2: Article[] = [
  { 
    title: '地元スポーツチームが優勝', 
    id: "1", 
    date: '2023-10-03', 
    summary: '地元のスポーツチームが劇的な試合で優勝を果たしました。', 
    description: '地元のスポーツチームが劇的な試合で優勝を果たしました。', 
    category: 'スポーツ', 
    keywords: ['スポーツ', '優勝', '地元チーム'],
    participants: [
      { name: 'コーチ', summary: '最高の試合をしました。' },
      { name: '選手', summary: '厳しい試合でしたが全力を尽くしました。' },
      { name: 'ファン', summary: '会場の雰囲気が最高でした！' }
    ],
    terms: [
      { term: '優勝', definition: '特定のスポーツで最高のチームまたは選手を決める競技。' }
    ],
    dialogs: [
      {
        order: 0,
        speaker: 'コーチ',
        summary: '最高の試合をしました。',
        response_to: [{
          dialog_id: -1,
          reaction: Reaction.AGREE
        }]
      },
      {
        order: 1,
        speaker: '選手',
        summary: '厳しい試合でしたが全力を尽くしました。',
        response_to: [{
          dialog_id: 0,
          reaction: Reaction.AGREE
        }]
      },
      {
        order: 2,
        speaker: 'ファン',
        summary: '会場の雰囲気が最高でした！',
        response_to: [{
          dialog_id: 1,
          reaction: Reaction.AGREE
        }]
      }
    ]
  },
  { 
    title: '政府が新政策を提案', 
    id: "2", 
    date: '2023-10-04', 
    summary: '政府が経済成長と雇用創出を目的とした新しい政策を提案しました。', 
    description: '政府が経済成長と雇用創出を目的とした新しい政策を提案しました。', 
    category: '政治', 
    keywords: ['政府', '政策', '経済', '雇用'],
    participants: [
      { name: '大臣', summary: 'この政策は雇用を創出します。' },
      { name: '経済学者', summary: '政策には可能性がありますが、詳細を見る必要があります。' },
      { name: '野党リーダー', summary: '実施方法に懸念があります。' },
      { name: 'ジャーナリスト', summary: '雇用創出の具体的な詳細を教えていただけますか？' }
    ],
    terms: [
      { term: '政策', definition: '組織や個人が採用または提案する行動の方針。' },
      { term: '経済', definition: '特定の地域や国の財産や資源、特に生産や消費に関連するもの。' }
    ],
    dialogs: [
      {
        order: 0,
        speaker: '大臣',
        summary: 'この政策は雇用を創出します。',
        response_to: [{
          dialog_id: -1,
          reaction: Reaction.AGREE
        }]
      },
      {
        order: 1,
        speaker: '経済学者',
        summary: '政策には可能性がありますが、詳細を見る必要があります。',
        response_to: [{
          dialog_id: 0,
          reaction: Reaction.NEUTRAL
        }]
      },
      {
        order: 2,
        speaker: '野党リーダー',
        summary: '実施方法に懸念があります。',
        response_to: [{
          dialog_id: 1,
          reaction: Reaction.DISAGREE
        }]
      },
      {
        order: 3,
        speaker: 'ジャーナリスト',
        summary: '雇用創出の具体的な詳細を教えていただけますか？',
        response_to: [{
          dialog_id: 0,
          reaction: Reaction.QUESTION
        }]
      }
    ]
  },
  { 
    title: '金融市場の動向', 
    id: "3", 
    date: '2023-10-05', 
    summary: '市場の動向についての分析が注目されています。', 
    description: '市場の動向についての分析が注目されています。', 
    category: '金融', 
    keywords: ['金融', '市場', '分析'],
    participants: [
      { name: 'アナリスト', summary: '市場は現在不安定です。' },
      { name: '投資家', summary: '今は慎重に投資を進めています。' },
      { name: 'ファイナンシャルアドバイザー', summary: 'このような時期には分散投資が鍵です。' }
    ],
    terms: [
      { term: '金融', definition: '特に政府や大企業による大量の資金の管理。' }
    ],
    dialogs: [
      {
        order: 0,
        speaker: 'アナリスト',
        summary: '市場は現在不安定です。',
        response_to: [{
          dialog_id: -1,
          reaction: Reaction.NEUTRAL
        }]
      },
      {
        order: 1,
        speaker: '投資家',
        summary: '今は慎重に投資を進めています。',
        response_to: [{
          dialog_id: 0,
          reaction: Reaction.AGREE
        }]
      },
      {
        order: 2,
        speaker: 'ファイナンシャルアドバイザー',
        summary: 'このような時期には分散投資が鍵です。',
        response_to: [{
          dialog_id: 1,
          reaction: Reaction.AGREE
        }]
      }
    ]
  }
];


export const articles = [
  { 
    title: '地元スポーツチームが優勝', 
    id: 1, 
    date: '2023-10-03', 
    summary: '地元のスポーツチームが劇的な試合で優勝を果たしました。', 
    description: '地元のスポーツチームが劇的な試合で優勝を果たしました。', 
    category: 'スポーツ', 
    keywords: ['スポーツ', '優勝', '地元チーム'],
    participants: [
      { name: 'コーチ', summary: '最高の試合をしました。' },
      { name: '選手', summary: '厳しい試合でしたが全力を尽くしました。' },
      { name: 'ファン', summary: '会場の雰囲気が最高でした！' }
    ],
    terms: [
      { term: '優勝', definition: '特定のスポーツで最高のチームまたは選手を決める競技。' }
    ],
    dialogs: [
      {
        order: 0,
        speaker: 'コーチ',
        summary: '最高の試合をしました。',
        response_to: [{
          dialog_id: -1,
          reaction: Reaction.AGREE
        }]
      },
      {
        order: 1,
        speaker: '選手',
        summary: '厳しい試合でしたが全力を尽くしました。',
        response_to: [{
          dialog_id: 0,
          reaction: Reaction.AGREE
        }]
      },
      {
        order: 2,
        speaker: 'ファン',
        summary: '会場の雰囲気が最高でした！',
        response_to: [{
          dialog_id: 1,
          reaction: Reaction.AGREE
        }]
      }
    ]
  },
  { 
    title: '政府が新政策を提案', 
    id: "2", 
    date: '2023-10-04', 
    summary: '政府が経済成長と雇用創出を目的とした新しい政策を提案しました。', 
    description: '政府が経済成長と雇用創出を目的とした新しい政策を提案しました。', 
    category: '政治', 
    keywords: ['政府', '政策', '経済', '雇用'],
    participants: [
      { name: '大臣', summary: 'この政策は雇用を創出します。' },
      { name: '経済学者', summary: '政策には可能性がありますが、詳細を見る必要があります。' },
      { name: '野党リーダー', summary: '実施方法に懸念があります。' },
      { name: 'ジャーナリスト', summary: '雇用創出の具体的な詳細を教えていただけますか？' }
    ],
    terms: [
      { term: '政策', definition: '組織や個人が採用または提案する行動の方針。' },
      { term: '経済', definition: '特定の地域や国の財産や資源、特に生産や消費に関連するもの。' }
    ],
    dialogs: [
      {
        order: 0,
        speaker: '大臣',
        summary: 'この政策は雇用を創出します。',
        response_to: [{
          dialog_id: -1,
          reaction: Reaction.AGREE
        }]
      },
      {
        order: 1,
        speaker: '経済学者',
        summary: '政策には可能性がありますが、詳細を見る必要があります。',
        response_to: [{
          dialog_id: 0,
          reaction: Reaction.NEUTRAL
        }]
      },
      {
        order: 2,
        speaker: '野党リーダー',
        summary: '実施方法に懸念があります。',
        response_to: [{
          dialog_id: 1,
          reaction: Reaction.DISAGREE
        }]
      },
      {
        order: 3,
        speaker: 'ジャーナリスト',
        summary: '雇用創出の具体的な詳細を教えていただけますか？',
        response_to: [{
          dialog_id: 0,
          reaction: Reaction.QUESTION
        }]
      }
    ]
  },
  { 
    title: '金融市場の動向', 
    id: "3", 
    date: '2023-10-05', 
    summary: '市場の動向についての分析が注目されています。', 
    description: '市場の動向についての分析が注目されています。', 
    category: '金融', 
    keywords: ['金融', '市場', '分析'],
    participants: [
      { name: 'アナリスト', summary: '市場は現在不安定です。' },
      { name: '投資家', summary: '今は慎重に投資を進めています。' },
      { name: 'ファイナンシャルアドバイザー', summary: 'このような時期には分散投資が鍵です。' }
    ],
    terms: [
      { term: '金融', definition: '特に政府や大企業による大量の資金の管理。' }
    ],
    dialogs: [
      {
        order: 0,
        speaker: 'アナリスト',
        summary: '市場は現在不安定です。',
        response_to: [{
          dialog_id: -1,
          reaction: Reaction.NEUTRAL
        }]
      },
      {
        order: 1,
        speaker: '投資家',
        summary: '今は慎重に投資を進めています。',
        response_to: [{
          dialog_id: 0,
          reaction: Reaction.AGREE
        }]
      },
      {
        order: 2,
        speaker: 'ファイナンシャルアドバイザー',
        summary: 'このような時期には分散投資が鍵です。',
        response_to: [{
          dialog_id: 1,
          reaction: Reaction.AGREE
        }]
      }
    ]
  }
];
