const messages = ['Course tested', 'Ruthlessly selected', 'Better by design', 'No filler', 'Golf’s best stuff'];

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <span className="lux-motion-ticker__set" aria-hidden={hidden || undefined}>
      {messages.map((message) => <span key={message}><b>WYX</b>{message}<i /></span>)}
    </span>
  );
}

export function MotionTicker() {
  return (
    <div className="lux-motion-ticker" aria-label="WYX: course tested, ruthlessly selected, better by design, no filler, golf's best stuff">
      <div className="lux-motion-ticker__track">
        <Track hidden />
        <Track hidden />
      </div>
    </div>
  );
}
