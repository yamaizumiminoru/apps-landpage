/* Static, editorial routing only. No profile, diagnosis, storage, or network calls. */
(function (root) {
  'use strict';
  const guide = Object.freeze({
    discover: Object.freeze({
      id: 'speaking', name: 'Speaking Lab', intro: 'まずは、話してみる。',
      description: '自分の好きな話題で会話して、言いたかったのに言えなかったことを振り返る。AIの提案を自分で確かめ、納得したノビシロを残せます。'
    }),
    retrieve: Object.freeze({
      id: 'sprint', name: 'Sprint Lab', intro: '「知っている」を、一言に。',
      description: '動詞に続く形、冠詞、時制。「正解を見ればわかる」表現を、文脈や意味から取り出す練習へ。対照や苦手復習で、迷うところを繰り返し確かめます。'
    }),
    pronounce: Object.freeze({
      id: 'pronunciation', name: 'Pronunciation Lab', intro: 'あなたの音声から、必要な練習を。',
      description: '発音をすべてやり直すのではなく、自分の音読や会話から改善候補を確認。一度にひとつの焦点で、自然な発話にも残る変化を目指します。'
    }),
    understand: Object.freeze({
      id: 'annotator', name: 'Annotator-Connotator', intro: '好きな題材を、自分の教材に。',
      description: '気になる文章やYouTube字幕を、語彙・表現・ニュアンスの解説つきで読む。ことばの選び方が生む細かな意味まで、文脈の中で確かめます。'
    })
  });
  root.LAB_GUIDE = guide;
  if (typeof module !== 'undefined' && module.exports) module.exports = guide;
})(typeof globalThis !== 'undefined' ? globalThis : window);
