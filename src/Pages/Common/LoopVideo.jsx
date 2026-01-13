import { LOGO } from "../../lib/constant";

function LoopVideo() {
  return (
    <video
      className="w-full h-full object-cover"
      src={LOGO.MASTER_VIDEO}
      autoPlay
      muted
      playsInline
      loop
    />
  );
}

export default LoopVideo;
