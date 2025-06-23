/**
 * Firebase Realtime Database integration for Radio Aventura
 */

import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { fetchMetadata } from "./metadata.js";

const db = getDatabase();

const streamsConfigRef = ref(db, 'config/streams');
const messagesRef = ref(db, 'messages');
const programsRef = ref(db, 'programs');
const newsRef = ref(db, 'news');
const teamRef = ref(db, 'team');
const historyRef = ref(db, 'history');
const sliderRef = ref(db, 'slider');

export function listenForStreamsConfig() {
  onValue(streamsConfigRef, (snapshot) => {
    const config = snapshot.val();
    if (config) {
      window.streams = {
        sliderTiming: config.sliderTiming || 10000,
        carouselTiming: config.carouselTiming || 5000,
        timeRefresh: config.timeRefresh || 10000,
        base_url: config.base_url || 'https://streaming.live365.com/a32532',
        id_user: config.id_user || 12,
        multi_stream: config.multi_stream || false,
        service: config.service || 'live365',
        module_video_tops: config.module_video_tops !== undefined ? config.module_video_tops : true,
        module_news: config.module_news !== undefined ? config.module_news : true,
        module_team: config.module_team !== undefined ? config.module_team : true,
      };
      updateMetadata();
    }
  });
}

onValue(messagesRef, (snapshot) => {
  const messages = snapshot.val();
  const prmSend = document.getElementById('player-prm-send');
  if (prmSend) {
    prmSend.innerHTML = '';
    if (messages) {
      Object.values(messages).forEach(msg => {
        const p = document.createElement('p');
        p.textContent = msg.text;
        prmSend.appendChild(p);
      });
    }
  }
});

onValue(programsRef, (snapshot) => {
  const programs = snapshot.val();
  if (!programs) return;
  ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].forEach(day => {
    const ul = document.getElementById(`program-${day}`);
    if (ul) {
      ul.innerHTML = '';
      const dayPrograms = programs[day] || [];
      dayPrograms.forEach(prog => {
        const li = document.createElement('li');
        li.textContent = `${prog.time} - ${prog.title}: ${prog.description}`;
        ul.appendChild(li);
      });
    }
  });
});

onValue(newsRef, (snapshot) => {
  const news = snapshot.val();
  const newsContainer = document.getElementById('news');
  if (newsContainer) {
    newsContainer.innerHTML = '';
    if (news) {
      Object.values(news).forEach(item => {
        const div = document.createElement('div');
        div.className = 'news swiper-slide';
        div.innerHTML = `
          <img src="${item.image || ''}" alt="${item.title || ''}" />
          <h3>${item.title || ''}</h3>
          <p>${item.content || ''}</p>
          <small>${item.date || ''}</small>
        `;
        newsContainer.appendChild(div);
      });
    }
  }
});

onValue(teamRef, (snapshot) => {
  const team = snapshot.val();
  const teamContainer = document.getElementById('team');
  if (teamContainer) {
    teamContainer.innerHTML = '';
    if (team) {
      Object.values(team).forEach(member => {
        const div = document.createElement('div');
        div.className = 'team swiper-slide';
        div.innerHTML = `
          <img src="${member.photo || ''}" alt="${member.name || ''}" />
          <h3>${member.name || ''}</h3>
          <p>${member.role || ''}</p>
          <p>${member.bio || ''}</p>
        `;
        teamContainer.appendChild(div);
      });
    }
  }
});

onValue(historyRef, (snapshot) => {
  const history = snapshot.val();
  const historyContainer = document.querySelector('.history-insert .last-played');
  if (historyContainer) {
    historyContainer.innerHTML = '';
    if (history) {
      Object.values(history).forEach(song => {
        const div = document.createElement('div');
        div.className = 'history';
        div.innerHTML = `
          <div class="history-wrapper">
            <img class="history-art" src="${song.artwork || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYGBgaAAAAIUAgbVRNccAAAAASUVORK5CYII='}" alt="${song.title || ''}" />
            <div class="history-meta fs-7">
              <span class="history-title fw-700 uppercase">${song.title || ''}</span>
              <span class="history-artist">${song.artist || ''}</span>
            </div>
          </div>
        `;
        historyContainer.appendChild(div);
      });
    }
  }
});

onValue(sliderRef, (snapshot) => {
  const slider = snapshot.val();
  const sliderContainer = document.querySelector('.slider-wrapper');
  if (sliderContainer) {
    sliderContainer.innerHTML = '';
    if (slider) {
      Object.values(slider).forEach(slide => {
        const div = document.createElement('div');
        div.className = 'slider-slide';
        div.innerHTML = `
          <a href="${slide.url || '#'}" target="_blank">
            <img src="${slide.image || ''}" alt="Banner" />
          </a>
        `;
        sliderContainer.appendChild(div);
      });
    }
  }
});

async function updateMetadata() {
  if (!window.streams) return;
  const { service, base_url } = window.streams;
  const metadata = await fetchMetadata(service, base_url);
  if (metadata) {
    const coverEl = document.getElementById('player-cover');
    if (coverEl) {
      if (metadata.artwork) {
        coverEl.src = metadata.artwork;
      } else {
        coverEl.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYGBgaAAAAIUAgbVRNccAAAAASUVORK5CYII=';
      }
    }
    const event = new CustomEvent('metadataUpdated', { detail: metadata });
    window.dispatchEvent(event);
    console.log('Metadata updated:', metadata);
  }
}
