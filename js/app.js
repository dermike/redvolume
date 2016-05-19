{
  'use strict';
  let webdata,
    sleeping,
    sleeptime = 45000;
  const chat = document.querySelector('.chat');
  const content = document.querySelector('.content');
  const getJSON = (url, cb) => {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.timeout = 5000;
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        try {
          let response = JSON.parse(request.responseText);
          cb(response);
        } catch (e) {
          cb(false);
        }
      } else {
        cb(false);
      }
    };
    request.ontimeout = () => {
      cb(false);
    };
    request.onerror = () => {
      cb(false);
    };
    request.send();
  };

  const newMessage = (message, type = 'user') => {
    let bubble = document.createElement('section'),
      slideIn = (el, i) => {
        setTimeout(() => {
          el.classList.add('show');
        }, i * 150 ? i * 150 : 10);
      },
      scroll,
      scrollDown = () => {
        chat.scrollTop += bubble.offsetHeight / 20;
      };
    bubble.classList.add('message');
    bubble.classList.add(type);
    bubble.innerHTML = `<p>${message}</p>`;
    chat.appendChild(bubble);

    scroll = window.setInterval(scrollDown, 10);
    setTimeout(() => {
      window.clearInterval(scroll);
    }, 300);

    setTimeout(() => {
      bubble.classList.add('show');
    }, 10);

    if (type === 'user') {
      let animate = chat.querySelectorAll('button:not(:disabled)');
      for (let i = 0; i < animate.length; i += 1) {
        slideIn(animate[i], i);
      }
      bubble.classList.add('active');
    }
  };

  const randomReply = replies => {
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const startAlternatives = () => {
    let startReplies = [
      'Yeah, go ahead! &#x1F680;',
      'Sure! &#x1F44D;',
      'Why not! &#x1F44C;'
    ];
    newMessage(`<button class="choice style">${randomReply(startReplies)}</button>`);
  };

  const checkUp = () => {
    let lastMessage = document.querySelector('.active'),
      sleepingReplies = [
        'Did you fall asleep? &#x1F634;',
        'Coffee break? &#x2615;',
        'Still there?',
        '&#x2744; &#x1F331; &#x1F31E; &#x1F342;'
      ];
    if (lastMessage) {
      lastMessage.parentNode.removeChild(lastMessage);
    }
    newMessage(randomReply(sleepingReplies), 'bot');
    setTimeout(() => {
      let helpReplies = [
        'Undrar du något kan du ringa <a href="tel:0852484000">08-524 840 00</a>, eller komma in till oss i KIB-labb mellan 11-16 på vardagar. &#x1F46B;',
        'Kom in till oss i KIB-labb mellan 11-16 på vardagar om du behöver mer hjälp eller ring <a href="tel:0852484000">08-524 840 00</a>. &#x1F4F2;',
        'Vill du prata referenser med en riktig person? &#x1F4AC; Kom in till oss i KIB-labb mellan 11-16 på vardagar.'
      ];
      newMessage(randomReply(helpReplies), 'bot');
      setTimeout(() => {
        let knowMoreReplies = [
            'Jag vill veta mer om hur jag refererar &#x1F61E;',
            'Vad är referenser nu igen? &#x1F631;',
            'Kan jag läsa mer om referenser någonstans? &#x1F680;'
          ],
          styleAgainReplies = [
            'Låt mig välja referensstil igen &#x1F4A1;',
            'Jag vill sätta igång! &#x1F525;',
            'Ok, kör &#x1F697;'
          ],
          categoriesAgainReplies = [
            'Visa kategorierna igen tack &#x2705;',
            'Ok, kör igen! &#x1F697;',
            'Jag vill välja källa &#x1F44D;'
          ];
        if (webdata) {
          newMessage(`<button class="choice newmenu showinfo">${randomReply(knowMoreReplies)}</button><br /><button class="choice newmenu showmenu">${randomReply(categoriesAgainReplies)}</button>`);
        } else {
          newMessage(`<button class="choice newmenu showinfo">${randomReply(knowMoreReplies)}</button><br /><button class="choice newmenu showstart">${randomReply(styleAgainReplies)}</button>`);
        }
      }, 300);
    }, 500);
  };

  const init = again => {
    let welcomeReplies = [
        'Hi, welcome to Redvolume Records! &#x1F603; This is not the most active label at the moment. Would you like to continue anyway? &#x1F37B;',
        'Hello! &#x1F44B; Welcome to Redvolume Records! We\'re not very active at the moment, would you still like to know more?'
      ],
      againReplies = [
        'Hmm, try again &#x1F635;',
        'Typical. If it\'s not your connection, the fault could be here &#x1F6A7; Please try again.',
        '&#x1F44E; Try again or come back later...'
      ];
    sleeping = window.setInterval(() => {
      window.clearInterval(sleeping);
      checkUp();
    }, sleeptime);
    again ? newMessage(randomReply(againReplies), 'bot') : newMessage(randomReply(welcomeReplies), 'bot');
    setTimeout(() => {
      startAlternatives();
    }, 300);
  };

  const makeUserBubble = el => {
    el.parentNode.parentNode.classList.add('selected');
    el.parentNode.parentNode.classList.remove('active');
    el.parentNode.innerHTML = el.textContent;
  };

  const showMenu = again => {
    let menu = '',
      goBack = chat.querySelector('button.newmenu'),
      againReplies = [
        'Here\'s what I can tell you about... &#x1F3A4;',
        'Ok, check this out! &#x1F447;',
        'Anything else you\'re interested in? &#x1F64F;'
      ],
      replies = [
        'What would you like to know more about? &#x1F4BF; &#x1F3B5; &#x1F3A7;',
        'Can I interest you in any of this? &#x1F4AF;',
        'Select something of the following... &#x1F447;'
      ];
    if (goBack) {
      makeUserBubble(goBack);
    }
    setTimeout(() => {
      again ? newMessage(randomReply(againReplies), 'bot') : newMessage(randomReply(replies), 'bot');
      webdata.menu.forEach((val, index) => {
        menu += `<button class="choice menu" data-submenu="${index}">${val.title}</button>`;
      });
      setTimeout(() => {
        newMessage(menu);
      }, 500);
    }, 500);
    sleeping = window.setInterval(() => {
      window.clearInterval(sleeping);
      checkUp();
    }, sleeptime);
  };

  const loadStyle = () => {
    let replies = [
      'Ok, hold on... &#x1F4AA;',
      'One moment... &#x1F440;',
      'Just a second... &#x1F60E;'
    ];
    newMessage(randomReply(replies), 'bot');
    getJSON('data/data.json', data => {
      if (data) {
        let examples = '';
        examples += '<span class="close">&times;</span>';
        webdata = data;
        webdata.examples.forEach(val => {
          examples += `<article id="${val.id}">
                         <h3>${val.title}</h3>
                         ${val.body}
                       </article>`;
        });
        content.innerHTML = examples;
        showMenu();
      } else {
        let errorReplies = [
          '&#x1F622; Oops, something went wrong...',
          'Grrr... &#x1F621;',
          'Something\'s not working at the moment &#x1F62B;'
        ];
        window.clearInterval(sleeping);
        newMessage(randomReply(errorReplies), 'bot');
        setTimeout(() => {
          init(true);
        }, 300);
      }
    });
  };

  const menuClick = clicked => {
    let submenu = '',
      menuChoice = webdata.menu[clicked.getAttribute('data-submenu')],
      replies = [
        '&#x1F44D; Here\'s what I have on that...',
        'See anything interesting? &#x1F648;',
        'Any of this cool?'
      ],
      userReplies = [
        `I wanna read about something other than ${menuChoice.title.toLowerCase()} &#x1F61C;`,
        `Show me the menu again &#x1F60B;`,
        `${menuChoice.title} was interesting, but show me something else... &#x1F612;`
      ];
    newMessage(randomReply(replies), 'bot');
    menuChoice.submenu.forEach(val => {
      submenu += `<button class="choice submenu" data-example="${menuChoice.id}-${val.id}">${val.title}</button>`;
    });
    submenu += `<br /><button class="choice submenu newmenu">${randomReply(userReplies)}</button>`;
    setTimeout(() => {
      newMessage(submenu);
    }, 500);
  };

  const subMenuClick = clicked => {
    if (clicked.classList.contains('newmenu')) {
      showMenu(true);
    } else {
      document.getElementById(clicked.getAttribute('data-example')).classList.add('show');
      content.classList.add('show');
    }
  };

  const closeContent = () => {
    content.classList.remove('show');
    setTimeout(() => {
      let active = document.querySelector('.content article.show');
      if (active) {
        active.classList.remove('show');
      }
    }, 300);
  };

  document.addEventListener('click', e => {
    if (e.target.classList.contains('choice')) {
      window.clearInterval(sleeping);
      if (!e.target.classList.contains('submenu')) {
        makeUserBubble(e.target);
      }

      if (e.target.classList.contains('style')) {
        loadStyle(e.target.textContent.toLowerCase());
      }

      if (e.target.classList.contains('menu')) {
        menuClick(e.target);
      }

      if (e.target.classList.contains('submenu')) {
        subMenuClick(e.target);
      }

      if (e.target.classList.contains('showstart')) {
        startAlternatives();
      }

      if (e.target.classList.contains('showmenu')) {
        showMenu(true);
      }

      if (e.target.classList.contains('showinfo')) {
        let infoReplies = [
          'Här kan du läsa mer om hur du refererar',
          'På vår webbplats kan du läsa mer om referenser',
          'Ok, kolla den här länken:'
        ];
        newMessage(`${randomReply(infoReplies)} <a target="_new" href="https://kib.ki.se/skriva-referera/skriva-referenser">https://kib.ki.se/skriva-referera/skriva-referenser</a>`, 'bot');
        setTimeout(() => {
          let okReplies = [
            'OK &#x1F60E;',
            'How do I get back? &#x1F312;',
            'Ok, I\'m ready! &#x1F44C;'
          ];
          if (webdata) {
            newMessage(`<button class="choice newmenu showmenu">${randomReply(okReplies)}</button>`);
          } else {
            newMessage(`<button class="choice newmenu showstart">${randomReply(okReplies)}</button>`);
          }
        }, 300);
      }
    }
    if (e.target.classList.contains('close')) {
      closeContent();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.keyCode === 27) {
      closeContent();
    }
  });

  setTimeout(() => {
    init();
  }, 500);
}
