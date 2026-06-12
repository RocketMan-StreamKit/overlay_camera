const readQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    settingsCode: params.get('settings') || '',
    token: params.get('token') || '',
  };
};

const fetchOverlayRuntime = async defaults => {
  const { settingsCode, token } = readQueryParams();
  let volume = defaults.volume ?? 70;

  if (settingsCode && token) {
    try {
      const response = await fetch(
        `/overlay/settings/${encodeURIComponent(settingsCode)}?token=${encodeURIComponent(token)}`
      );
      const data = await response.json();
      if (data.success) {
        volume = Number(data.volume) || volume;
      }
    } catch (_err) {
      // Fallback to defaults.
    }
  }

  return { volume };
};

const startLoopingAudio = (audio, volume, loopFrom) => {
  audio.currentTime = 0;
  audio.volume = Math.max(0, Math.min(1, volume / 100));
  void audio.play();

  audio.onended = () => {
    audio.currentTime = loopFrom;
    void audio.play();
  };

  return () => {
    audio.pause();
  };
};

const runEffect = async () => {
  const effectEl = document.getElementById('effect');
  const runtime = await fetchOverlayRuntime({ volume: 70 });
  const audio = new Audio('pnv_final.mp3');

  effectEl.classList.remove('hidden');
  startLoopingAudio(audio, runtime.volume, 5.76);
};

void runEffect();
