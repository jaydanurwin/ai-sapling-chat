const waveAnimationStyle = `
  .waving-hand {
    animation-name: wave-animation;
    animation-duration: 2.5s;
    animation-iteration-count: infinite;
    transform-origin: 70% 70%;
    display: inline-block;
  }

  @keyframes wave-animation {
      0% { transform: rotate( 0.0deg) }
     10% { transform: rotate(14.0deg) }
     20% { transform: rotate(-8.0deg) }
     30% { transform: rotate(14.0deg) }
     40% { transform: rotate(-4.0deg) }
     50% { transform: rotate(10.0deg) }
     60% { transform: rotate( 0.0deg) }
    100% { transform: rotate( 0.0deg) }
  }
`;

export default function WavingHand() {
    return (
        <sapling-island>
            <template>
                <style dangerouslySetInnerHTML={{ __html: waveAnimationStyle }} />
            </template>
            <span class="waving-hand">👋</span>
        </sapling-island>
    );
}