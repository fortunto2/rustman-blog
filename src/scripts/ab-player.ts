// Hydrates the ```ab players rendered by lib/md.ts. One playhead for all takes: switching keeps the
// position, so A and B are heard at the same bar. Only one take ever sounds.
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export function initAbPlayers(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-ab]').forEach(player => {
    const audios = [...player.querySelectorAll('audio')];
    const takes = [...player.querySelectorAll<HTMLButtonElement>('.ab-take')];
    const play = player.querySelector<HTMLButtonElement>('.ab-play')!;
    const seek = player.querySelector<HTMLInputElement>('.ab-seek')!;
    const time = player.querySelector<HTMLElement>('.ab-time')!;
    let active = 0;

    const cur = () => audios[active];
    const render = () => {
      const a = cur();
      play.textContent = a.paused ? '▶' : '❚❚';
      play.setAttribute('aria-label', a.paused ? 'Play' : 'Pause');
      if (a.duration) seek.value = String(Math.round((a.currentTime / a.duration) * 1000));
      time.textContent = fmt(a.currentTime);
      takes.forEach((b, i) => b.setAttribute('aria-pressed', String(i === active)));
    };

    takes.forEach((btn, i) => btn.addEventListener('click', () => {
      if (i === active) return;
      const from = cur();
      const wasPlaying = !from.paused;
      const to = audios[i];
      to.currentTime = from.currentTime;
      from.pause();
      active = i;
      if (wasPlaying) to.play();
      render();
    }));

    play.addEventListener('click', () => {
      // Another player on the page stops: two takes from different pairs at once is noise.
      document.querySelectorAll('audio').forEach(a => { if (a !== cur()) a.pause(); });
      cur().paused ? cur().play() : cur().pause();
    });

    seek.addEventListener('input', () => {
      const a = cur();
      if (a.duration) a.currentTime = (Number(seek.value) / 1000) * a.duration;
      render();
    });

    audios.forEach(a => ['timeupdate', 'play', 'pause', 'ended', 'loadedmetadata'].forEach(e =>
      a.addEventListener(e, () => { if (a === cur()) render(); })));
  });
}
