import Wavesurfer from 'wavesurfer.js';
import { useEffect, useRef, useState } from 'react';
import * as WaveformRegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import { consoleSandbox } from '@sentry/utils';

const Waveform = ({ url, id }) => {
  // let url =
  //   'https://www.mfiles.co.uk/mp3-downloads/franz-schubert-standchen-serenade.mp3';
  const wavesurfer = useRef(null);
  const [loaded, setLoaded] = useState(0);
  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current = Wavesurfer.create({
        container: `#waveform-${id}`,
        waveColor: '#B7B7B7',
        barWidth: 3,
        barRadius: 3,
        cursorWidth: 3,
        barHeight: 7,
        cursorColor: '#8D2CCB',
        // Add the regions plugin.
        // More info here https://wavesurfer-js.org/plugins/regions.html
        plugins: [WaveformRegionsPlugin.create({ maxLength: 90 })],
      });

      wavesurfer.current.load(`${url}`);

      wavesurfer.current.on('loading', (value) => {
        setLoaded(value);
      });

      // =========== ADDED =========

      // Enable dragging on the audio waveform
      wavesurfer.current.enableDragSelection({
        maxLength: 90,
      });
      // Perform action when new region is created
      wavesurfer.current.on('region-created', (e) => {
        let color = '#8D2CCB';
        e.color = color;
      });
    }

    // =========== ADDED =========
  }, []);

  //    ========== ADDED ===========

  // delete a particular region
  const deleteClip = (clipid) => {
    wavesurfer.current.regions.list[clipid].remove();
  };

  // play a particular region
  const playClip = (clipid) => {
    wavesurfer.current.regions.list[clipid].play();
  };

  //   ========== ADDED ===========

  const playAudio = () => {
    if (wavesurfer?.current.isPlaying()) {
      wavesurfer.current.pause();
    } else {
      wavesurfer.current.play();
    }
  };

  return (
    <div className='flex flex-col w-full'>
      <div id={`waveform-${id}`} className='cursor-pointer' ref={wavesurfer} />
      <div className='flex flex-row justify-center'>
        <button className='m-4 contained-button' onClick={playAudio}>
          Play / Pause
        </button>
      </div>
    </div>
  );
};

export default Waveform;
