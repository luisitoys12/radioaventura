/**
 * Module to fetch and provide metadata (e.g., last played song) from Azuracast or Zenoradio APIs
 */

export async function fetchMetadata(service, baseUrl) {
  try {
    if (service === 'azuracast') {
      // Azuracast API endpoint for now playing
      const response = await fetch(baseUrl + '/api/nowplaying');
      if (!response.ok) throw new Error('Error fetching Azuracast metadata');
      const data = await response.json();
      // Extract relevant metadata from Azuracast response
      return {
        title: data.now_playing.song.title,
        artist: data.now_playing.song.artist,
        album: data.now_playing.song.album,
        artwork: data.now_playing.song.art,
        isPlaying: data.now_playing.playing,
      };
    } else if (service === 'zenoradio') {
      // Zenoradio API endpoint for current song (example, adjust as needed)
      const response = await fetch(baseUrl + '/api/nowplaying');
      if (!response.ok) throw new Error('Error fetching Zenoradio metadata');
      const data = await response.json();
      // Extract relevant metadata from Zenoradio response
      return {
        title: data.current_song.title,
        artist: data.current_song.artist,
        album: data.current_song.album,
        artwork: data.current_song.artwork_url,
        isPlaying: data.is_playing,
      };
    } else {
      // Unsupported service or no metadata available
      return null;
    }
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return null;
  }
}
