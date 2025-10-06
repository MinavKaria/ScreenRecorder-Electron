import { desktopCapturer } from 'electron';

async function getAudioSources() {
  const sources = await desktopCapturer.getSources({
    types: ['screen', 'window'],
    thumbnailSize: { width: 0, height: 0 }
  });
  
  return sources;
}

module.exports = { getAudioSources };

export { getAudioSources };