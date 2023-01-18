import Wavesurfer from 'wavesurfer.js';
import { useEffect, useRef, useState } from 'react';
import * as WaveformRegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import {} from 'react';
const Waveform = ({ url, id }) => {
  const waveform = useRef(null);
  const [loaded, setLoaded] = useState(0);
  useEffect(() => {
    if (!waveform.current) {
      waveform.current = Wavesurfer.create({
        container: `#waveform-${id}`,
        waveColor: '#567FFF ',
        barGap: 2,
        barWidth: 3,
        barRadius: 3,
        cursorWidth: 3,
        cursorColor: '#8D2CCB',
        // Add the regions plugin.
        // More info here https://wavesurfer-js.org/plugins/regions.html
        plugins: [WaveformRegionsPlugin.create({ maxLength: 90 })],
      });
      waveform.current.load(url);

      waveform.current.on('loading', (value) => {
        setLoaded(value);
      });

      // =========== ADDED =========

      // Enable dragging on the audio waveform
      waveform.current.enableDragSelection({
        maxLength: 90,
      });
      // Perform action when new region is created
      waveform.current.on('region-created', (e) => {
        let color = '#8D2CCB';
        e.color = color;
      });
    }

    // =========== ADDED =========
  }, []);

  //    ========== ADDED ===========

  // delete a particular region
  const deleteClip = (clipid) => {
    waveform.current.regions.list[clipid].remove();
  };

  // play a particular region
  const playClip = (clipid) => {
    waveform.current.regions.list[clipid].play();
  };

  //   ========== ADDED ===========

  const playAudio = () => {
    if (waveform.current.isPlaying()) {
      waveform.current.pause();
    } else {
      waveform.current.play();
    }
  };

  return (
    <div className='flex flex-col w-full'>
      <div id={`waveform-${id}`} className='cursor-pointer' />
      <div className='flex flex-row justify-center'>
        <button className='m-4 contained-button' onClick={playAudio}>
          Play / Pause
        </button>
      </div>
    </div>
  );
};

export default Waveform;
