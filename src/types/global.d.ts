
interface Window {
  mapboxgl: any;
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

// Add default Mapbox token to the window object
interface Window {
  DEFAULT_MAPBOX_TOKEN?: string;
}
